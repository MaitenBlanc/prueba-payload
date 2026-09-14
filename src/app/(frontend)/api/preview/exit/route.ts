import { draftMode } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const draft = await draftMode()
  draft.disable()

  // Construimos la URL absoluta usando la petición actual
  const url = new URL('/', request.url)

  // Retornamos una respuesta HTTP formal que el servidor puede procesar sin errores
  return NextResponse.redirect(url)
}