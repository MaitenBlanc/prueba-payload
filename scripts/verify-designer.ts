import 'dotenv/config'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { randomUUID } from 'node:crypto'
import { getPayload } from 'payload'
import { chromium, type Browser } from 'playwright'
import config from '../src/payload.config'

const payload = await getPayload({ config })
const ids: number[] = []
let pageId: number | undefined
let browser: Browser | undefined
try {
  const password = randomUUID() + randomUUID()
  const admin = await payload.create({ collection: 'users', data: { email: `admin-${randomUUID()}@example.invalid`, password, role: 'admin' } })
  ids.push(admin.id)
  const designer = await payload.create({ collection: 'users', data: { email: `designer-${randomUUID()}@example.invalid`, password, role: 'designer' } })
  ids.push(designer.id)
  const doc = await payload.create({ collection: 'pages', data: { slug: `role-check-${randomUUID()}`, layout: [], _status: 'published' } })
  pageId = doc.id
  browser = await chromium.launch({ channel: 'chrome', headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const request = context.request
  const base = 'http://localhost:3000'
  const login = await request.post(`${base}/api/users/login`, { data: { email: designer.email, password } })
  assert.equal(login.status(), 200, 'designer login')
  assert.equal((await request.get(`${base}/api/users/me`)).status(), 200, 'own session remains available')
  assert.equal((await request.get(`${base}/api/users`)).status(), 403, 'cannot list users')
  assert.equal((await request.get(`${base}/api/users/${admin.id}`)).status(), 403, 'cannot read another user')
  assert.equal((await request.post(`${base}/api/users`, { data: { email: 'not-created@example.invalid', password, role: 'admin' } })).status(), 403, 'cannot create a user')
  assert.equal((await request.patch(`${base}/api/users/${designer.id}`, { data: { role: 'admin' } })).status(), 403, 'cannot elevate own role')
  assert.equal((await request.delete(`${base}/api/users/${admin.id}`)).status(), 403, 'cannot delete users')
  assert.equal((await request.post(`${base}/api/users/unlock`, { data: { email: admin.email } })).status(), 403, 'cannot unlock users')
  assert.equal((await request.patch(`${base}/api/pages/${pageId}?draft=true`, { data: { layout: [{ blockType: 'stats', title: 'Edición de diseñadora', visible: true, items: [{ value: '1', label: 'Verificación' }] }], _status: 'draft' } })).status(), 200, 'can edit a draft')
  assert.equal((await request.patch(`${base}/api/pages/${pageId}`, { data: { _status: 'published' } })).status(), 200, 'can publish')
  assert.equal((await request.delete(`${base}/api/pages/${pageId}`)).status(), 403, 'cannot delete pages')
  const permissions = await request.get(`${base}/api/access`)
  assert.equal(permissions.status(), 200)
  const access = await permissions.json()
  assert.equal(access.collections.media.create, true)
  assert.equal(access.collections.media.update, true)
  assert.equal(access.collections.media.delete ?? false, false)
  assert.equal(access.collections.users?.create ?? false, false)
  const page = await context.newPage()
  await page.goto(`${base}/admin`, { waitUntil: 'networkidle', timeout: 120000 })
  assert.equal(await page.locator('a[href="/admin/collections/users"]').count(), 0, 'Users is absent from dashboard and navigation')
  assert.ok(await page.locator('a[href="/admin/collections/pages"]').count() > 0)
  assert.ok(await page.locator('a[href="/admin/collections/media"]').count() > 0)
  fs.mkdirSync('.local', { recursive: true })
  await page.screenshot({ path: '.local/designer-dashboard.png', fullPage: true })
  await page.goto(`${base}/admin/collections/pages/${pageId}`, { waitUntil: 'networkidle', timeout: 60000 })
  assert.ok(await page.getByRole('button', { name: /Guardar borrador/ }).count() > 0)
  const adminContext = await browser.newContext()
  assert.equal((await adminContext.request.post(`${base}/api/users/login`, { data: { email: admin.email, password } })).status(), 200)
  assert.equal((await adminContext.request.get(`${base}/api/users`)).status(), 200, 'admin still manages users')
  const publicContext = await browser.newContext()
  assert.equal((await publicContext.request.patch(`${base}/api/pages/${pageId}`, { data: { slug: 'unauthorized' } })).status(), 403)
  console.log('PASS: designer login, /me, hidden Users, blocked Users API/role escalation/unlock, page edits and publication, upload permissions, admin permissions, anonymous write denied.')
} finally {
  if (browser) await browser.close()
  if (pageId) await payload.delete({ collection: 'pages', id: pageId })
  for (const id of ids.reverse()) await payload.delete({ collection: 'users', id })
  await payload.destroy()
  console.log('Temporary accounts and page removed.')
}
process.exit(0)


