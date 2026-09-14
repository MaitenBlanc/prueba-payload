import Link from 'next/link'

export function StudioWelcome() {
  return <section className="studio-welcome" aria-labelledby="studio-heading">
    <div className="studio-welcome__intro">
      <p className="studio-eyebrow">TU ESPACIO DE EDICIÓN</p>
      <h1 id="studio-heading">Dale forma a tu contenido.</h1>
      <p className="studio-welcome__description">Actualizá textos, elegí imágenes y revisá cada detalle antes de publicar. Empezá por el contenido que querés editar.</p>
      <div className="studio-actions">
        <Link className="studio-link studio-link--primary" href="/admin/collections/pages">Editar páginas</Link>
        <Link className="studio-link" href="/admin/collections/media">Biblioteca de imágenes</Link>
        <Link className="studio-link studio-link--quiet" href="/" target="_blank" rel="noreferrer">Ver sitio publicado</Link>
      </div>
    </div>
    <ol className="studio-steps" aria-label="Cómo actualizar tu página">
      <li><span className="studio-steps__number">01</span><div><h2>Editá a tu ritmo</h2><p>Elegí una sección, hacé tus cambios y presioná <strong>Guardar borrador</strong>.</p></div></li>
      <li><span className="studio-steps__number">02</span><div><h2>Revisá cómo se ve</h2><p>Abrí la <strong>vista previa</strong>. Si seguís editando, guardá y recargá esa vista.</p></div></li>
      <li><span className="studio-steps__number">03</span><div><h2>Publicá cuando esté listo</h2><p><strong>Publicar cambios</strong> actualiza la página. En <strong>Versiones</strong> podés consultar los cambios anteriores.</p></div></li>
    </ol>
    <p className="studio-welcome__note">Los borradores de tus páginas no cambian el sitio publicado.</p>
  </section>
}
