import { RichText } from '@payloadcms/richtext-lexical/react'
import type { Page } from '@/payload-types'
import { MediaSlot } from './LandingSection'

export default function Banner({ title, image }: { title?: Page['banner']['title']; image?: Page['banner']['image'] }) {
  return (
    <section className="hero" aria-label="Vos cambiás. Nosotros cambiamos con vos.">
      <div className="hero-copy">
        <div className="hero-title">
          {title ? <RichText data={title} /> : (
            <h1>Vos cambiás.<br />Nosotros<br /><strong>cambiamos</strong> con vos.</h1>
          )}
        </div>
      </div>
      <MediaSlot media={image} className="hero-image-placeholder" label="Imagen del banner" />
    </section>
  )
}
