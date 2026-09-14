import { draftMode, headers } from 'next/headers'
import { getPayload } from 'payload'
import config from '@/payload.config'
import Link from 'next/link'
import Banner from './components/Banner'
import { LandingSection } from './components/LandingSection'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayload({ config })
  const { isEnabled } = await draftMode()
  const { user } = isEnabled ? await payload.auth({ headers: await headers() }) : { user: null }
  const isDraftMode = isEnabled && Boolean(user)
  const { docs } = await payload.find({
    collection: 'pages', draft: isDraftMode, depth: 3, limit: 1,
    overrideAccess: false, user,
    where: { and: [{ slug: { equals: 'inicio' } }, ...(isDraftMode ? [] : [{ _status: { equals: 'published' as const } }])] },
  })
  const page = docs[0]
  const layout = page?.layout || []
  const header = layout.find(block => block.blockType === 'header')
  const footer = layout.find(block => block.blockType === 'footer')

  return <>
    <a className="skip-link" href="#contenido">Saltar al contenido</a>
    {header && <LandingSection block={header} />}
    <main id="contenido">
      {isDraftMode && <div className="preview-notice">Modo Previsualización Activo · <Link href="/api/preview/exit" prefetch={false}>Salir de previsualización</Link></div>}
      {page ? <>
        <Banner title={page.banner?.title} image={page.banner?.image} />
        {layout.filter(block => block.blockType !== 'header' && block.blockType !== 'footer').map((block, index) => <LandingSection block={block} key={block.id || index} />)}
      </> : <p className="empty-page">Publicá la página «inicio» desde el administrador para mostrar la landing.</p>}
    </main>
    {footer && <LandingSection block={footer} />}
  </>
}
