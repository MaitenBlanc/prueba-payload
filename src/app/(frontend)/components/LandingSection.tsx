import Image from 'next/image'
import Link from 'next/link'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { ReactNode } from 'react'
import type { Media, Page } from '@/payload-types'

export type LandingBlock = NonNullable<Page['layout']>[number]
type MediaValue = number | Media | null | undefined

export function MediaSlot({ media, className, label }: { media?: MediaValue; className: string; label: string }) {
  const file = typeof media === 'object' && media ? media : null
  return (
    <div className={`${className}${file?.url ? ' has-media' : ''}`}>
      {file?.url ? <Image src={file.url} alt={file.alt || ''} width={file.width || 800} height={file.height || 500} unoptimized /> : <span>{label}</span>}
    </div>
  )
}

export function CmsLink({ url, children, className }: { url?: string | null; children: ReactNode; className?: string }) {
  const safe = url && /^(\/(?!\/)|#[\w-]+$|https?:\/\/|mailto:|tel:)/i.test(url)
  return safe ? <Link href={url} className={className}>{children}</Link> : <span className={className} aria-disabled="true">{children}</span>
}

export function LandingSection({ block }: { block: LandingBlock }) {
  if (block.visible === false) return null
  switch (block.blockType) {
    case 'header': {
      const nav = (block.links || []).map((item, i) => <CmsLink key={item.id || i} url={item.url}>{item.label}</CmsLink>)
      return <header className="site-header"><div className="header-inner">
        <Link className="brand-placeholder" href="/" aria-label="Inicio">
          {block.logo ? <MediaSlot media={block.logo} className="cms-logo" label="Logo" /> : <><span className="logo-placeholder">Logo</span><span>{block.brand}</span></>}
        </Link>
        <nav className="desktop-nav" aria-label="Navegación principal">{nav}</nav>
        <div className="header-actions">{(block.actions || []).map((item, i) => <CmsLink key={item.id || i} url={item.url} className={`pill ${i === 0 ? 'pill-outline' : 'pill-primary'}`}>{item.label}</CmsLink>)}</div>
        <details className="mobile-menu"><summary>Menú</summary><nav aria-label="Navegación móvil">{nav}</nav></details>
      </div></header>
    }
    case 'payments':
      return <section id="soluciones-de-cobro" className="payment-solutions" aria-label={block.title || undefined}>
        <div className="solutions-heading"><h2>{block.title}</h2></div>
        <div className="solutions-band"><div className="solutions-inner">{(block.items || []).map((item, i) => <article className="solution-placeholder" key={item.id || i}>
          <MediaSlot media={item.image} className="icon-placeholder" label="Ícono" />
          <div><h3>{item.title}</h3>{item.description ? <p>{item.description}</p> : <div className="copy-placeholder" aria-label="Contenido pendiente" />}</div>
        </article>)}</div></div>
      </section>
    case 'business':
      return <section className="business-benefits" aria-label={block.title || undefined}>
        <MediaSlot media={block.image} className="business-image-placeholder" label="Imagen del comercio" />
        <div className="business-benefits-copy"><h2>{block.title}</h2><ul>{(block.items || []).map((item, i) => <li key={item.id || i}>{item.text && <RichText data={item.text} />}</li>)}</ul>
          {block.button?.label && <CmsLink url={block.button.url} className="pill pill-primary business-register">{block.button.label}</CmsLink>}
        </div>
      </section>
    case 'kit':
      return <section className="solutions-kit" aria-label={block.title || undefined}><h2>{block.title}</h2><div className="solutions-kit-grid">
        {(block.items || []).map((item, i) => <article className="solutions-kit-card" key={item.id || i}>
          <CmsLink url={item.url} className="kit-card-link"><MediaSlot media={item.image} className="kit-icon-placeholder" label="Ícono" /><h3>{item.title}</h3><p>{item.description}</p></CmsLink>
        </article>)}
      </div></section>
    case 'benefits':
      return <section className="customer-benefits" aria-label={block.title || undefined}><div className="customer-benefits-inner"><h2>{block.title}</h2>
        <div className="customer-benefits-grid">{(block.items || []).map((item, i) => <article key={item.id || i}><h3>{item.title}</h3><CmsLink url={item.url} className="benefit-detail">{item.description}</CmsLink></article>)}</div>
        {block.button?.label && <CmsLink url={block.button.url} className="pill pill-primary customer-register">{block.button.label}</CmsLink>}
      </div></section>
    case 'stats':
      return <section className="payway-stats" aria-label={block.title || undefined}><h2>{block.title}</h2><dl className="payway-stats-grid">
        {(block.items || []).map((item, i) => <div className="payway-stat" key={item.id || i}><MediaSlot media={item.image} className="stat-icon-placeholder" label="Ícono" /><div className="stat-copy"><dt><CmsLink url={item.url}>{item.label}</CmsLink></dt><dd>{item.value}</dd></div></div>)}
      </dl></section>
    case 'footer':
      return <footer className="site-footer"><div className="footer-inner"><div className="footer-grid"><div className="footer-brand">
        <div className="brand-placeholder">{block.logo ? <MediaSlot media={block.logo} className="cms-logo" label="Logo" /> : <><span className="logo-placeholder">Logo</span><span>{block.brand}</span></>}</div>
        <div className="footer-socials">{(block.socials || []).map((item, i) => <CmsLink url={item.url} key={item.id || i} className="social-placeholder">{item.image ? <MediaSlot media={item.image} className="social-image" label={item.label || ''} /> : item.label}</CmsLink>)}</div>
        <h2>{block.appsTitle}</h2><div className="footer-apps">{(block.apps || []).map((item, i) => <CmsLink url={item.url} key={item.id || i} className="store-placeholder">{item.image ? <MediaSlot media={item.image} className="store-image" label={item.label || ''} /> : item.label}</CmsLink>)}</div>
      </div>{(block.columns || []).map((column, i) => <div className="footer-column" key={column.id || i}><h2>{column.title}</h2><ul>{(column.items || []).map((item, j) => <li key={item.id || j}><CmsLink url={item.url}>{item.label}</CmsLink></li>)}</ul></div>)}</div><p className="footer-legal">{block.legal}</p></div></footer>
  }
}
