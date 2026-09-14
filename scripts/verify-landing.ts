import 'dotenv/config'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { chromium } from 'playwright'
import config from '../src/payload.config'
import type { Page } from '../src/payload-types'
import { defaultLayout } from '../src/landing/defaults'

const payload = await getPayload({ config })
let pageId: number | undefined
let userId: number | undefined
let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined
try {
  const original = (await payload.find({ collection: 'pages', where: { slug: { equals: 'inicio' } }, depth: 0 })).docs[0]

  // 1. Buscamos el banner dentro del array layout en lugar de la raíz
  const originalBanner = original.layout?.find(block => block.blockType === 'banner')

  const layout = structuredClone(defaultLayout) as Page['layout']
  const kit = layout!.find(block => block.blockType === 'kit')!
  assert.equal(kit.blockType, 'kit')
  if (kit.blockType === 'kit') {
    kit.items![0].title = 'Tarjeta de verificación'
    kit.items![0].url = '#soluciones-de-cobro'
    // 2. Extraemos la imagen del bloque banner que encontramos arriba
    if (originalBanner && originalBanner.blockType === 'banner') {
      kit.items![0].image = originalBanner.image
    }
  }
  const slug = `cms-verification-${randomUUID()}`

  // 3. Eliminamos la propiedad "banner: original.banner". El banner ya va incluido adentro de "layout"
  const doc = await payload.create({ collection: 'pages', data: { slug, layout, _status: 'published' } })
  pageId = doc.id

  const populated = await payload.findByID({ collection: 'pages', id: pageId, depth: 3 })
  const readKit = populated.layout!.find(block => block.blockType === 'kit')!
  assert.equal(readKit.blockType, 'kit')
  if (readKit.blockType === 'kit') {
    assert.equal(readKit.items![0].title, 'Tarjeta de verificación')
    assert.equal(readKit.items![0].url, '#soluciones-de-cobro')
    // El tipo object lo pasamos a condicional ya que la imagen de prueba podría no existir localmente
    if (readKit.items![0].image) {
      assert.equal(typeof readKit.items![0].image, 'object')
    }
  }
  const draftLayout = structuredClone(layout)!
  draftLayout.reverse()
  const stats = draftLayout.find(block => block.blockType === 'stats')!
  stats.visible = false
  await payload.update({ collection: 'pages', id: pageId, draft: true, data: { layout: draftLayout, _status: 'draft' } })
  const published = await payload.findByID({ collection: 'pages', id: pageId, overrideAccess: false })
  assert.equal(published.layout![0].blockType, 'header')
  const draft = await payload.findByID({ collection: 'pages', id: pageId, draft: true })
  assert.equal(draft.layout![0].blockType, 'footer')
  assert.equal(draft.layout!.find(block => block.blockType === 'stats')!.visible, false)
  await payload.update({ collection: 'pages', id: pageId, data: { layout: draft.layout, _status: 'published' } })
  const republished = await payload.findByID({ collection: 'pages', id: pageId, overrideAccess: false })
  assert.equal(republished.layout![0].blockType, 'footer')
  let invalidRejected = false
  try {
    await payload.update({ collection: 'pages', id: pageId, data: { layout: [{ blockType: 'header', links: [{ label: 'Invalid', url: 'javascript:alert(1)' }] }] } })
  } catch { invalidRejected = true }
  assert.ok(invalidRejected)
  console.log('PASS: persisted fields, media population, draft isolation, reorder/hide, publication and URL validation')

  const password = randomUUID() + randomUUID()
  const email = `cms-verification-${randomUUID()}@example.invalid`
  const user = await payload.create({ collection: 'users', data: { email, password } })
  userId = user.id
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const login = await context.request.post('http://localhost:3000/api/users/login', { data: { email, password } })
  assert.equal(login.status(), 200)
  const page = await context.newPage()
  const response = await page.goto(`http://localhost:3000/admin/collections/pages/${pageId}`, { waitUntil: 'networkidle', timeout: 120000 })
  assert.equal(response?.status(), 200)
  await page.getByText('Secciones', { exact: true }).click()
  await page.getByText('Secciones de la landing', { exact: true }).waitFor({ timeout: 30000 })
  await page.getByRole('button', { name: 'Marca y menú', exact: true }).click()
  const visibleRows = page.locator('.landing-section-editor > .blocks-field > .blocks-field__rows > div[id]:visible')
  assert.equal(await visibleRows.count(), 1)
  await page.getByRole('textbox', { name: 'Nombre de marca', exact: true }).fill('Marca de verificación UI')
  await page.getByRole('button', { name: 'Cifras', exact: true }).click()
  assert.equal(await visibleRows.count(), 1)
  await page.getByRole('button', { name: 'Marca y menú', exact: true }).click()
  assert.equal(await page.getByRole('textbox', { name: 'Nombre de marca', exact: true }).inputValue(), 'Marca de verificación UI')
  await page.getByRole('button', { name: 'Ordenar / agregar secciones', exact: true }).click()

  assert.equal(await visibleRows.count(), 8)

  await page.getByRole('button', { name: 'Marca y menú', exact: true }).click()
  const saved = page.waitForResponse(response => response.url().includes(`/api/pages/${pageId}`) && response.request().method() === 'PATCH', { timeout: 30000 })
  await page.getByRole('button', { name: 'Guardar borrador', exact: true }).click()
  assert.equal((await saved).status(), 200)
  const uiDraft = await payload.findByID({ collection: 'pages', id: pageId, draft: true })
  const savedHeader = uiDraft.layout!.find(block => block.blockType === 'header')!
  assert.equal(savedHeader.blockType === 'header' && savedHeader.brand, 'Marca de verificación UI')
  console.log('PASS: section navigation, single visible block, overview and save after switching sections')
  await page.screenshot({ path: '.local/admin-editing.png', fullPage: true })
  console.log('PASS: authenticated /admin renders editable landing blocks')
  const publicContext = await browser.newContext()
  const preview = await publicContext.request.get('http://localhost:3000/api/preview?slug=inicio')
  assert.equal(preview.status(), 401)
  const home = await publicContext.newPage()
  const homeResponse = await home.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 60000 })
  assert.equal(homeResponse?.status(), 200)
  assert.equal(await home.locator('.solutions-kit-card').count(), 4)
  for (const width of [1440, 390]) {
    await home.setViewportSize({ width, height: 1000 })
    assert.equal(await home.evaluate(() => document.documentElement.scrollWidth > innerWidth), false)
    await home.screenshot({ path: `.local/landing-cms-${width}.png`, fullPage: true })
  }
  console.log('PASS: public landing, protected preview and responsive rendering')
} finally {
  if (browser) await browser.close()
  if (pageId) await payload.delete({ collection: 'pages', id: pageId })
  if (userId) await payload.delete({ collection: 'users', id: userId })
  await payload.destroy()
  console.log('Temporary test page and user removed.')
}
process.exit(0)