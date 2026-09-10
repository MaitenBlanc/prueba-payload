import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get('slug')
  const secret = searchParams.get('secret')

  // Una validación simple de seguridad para que nadie externo active tu preview
  if (secret !== 'mi-secreto-123') {
    return new Response('Token inválido', { status: 401 })
  }

  // Habilitamos el modo borrador de Next.js
  const draft = await draftMode()
  draft.enable()

  // Redirigimos a la página solicitada (por defecto la home)
  redirect(`/${slug === 'inicio' ? '' : slug || ''}`)
}