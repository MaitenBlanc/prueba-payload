import { draftMode, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  if (searchParams.get('slug') !== 'inicio') return new Response('Página no válida', { status: 400 })
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: await headers() })
  if (!user) return new Response('Iniciá sesión en /admin para previsualizar borradores.', { status: 401 })
  const draft = await draftMode()
  draft.enable()
  redirect('/')
}
