import { headers as getHeaders } from 'next/headers.js'
import { draftMode } from 'next/headers' // <-- 1. Importar draftMode
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Banner from './components/Banner'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  // 2. Verificamos si estamos en modo preview
  const draft = await draftMode()
  const isDraftMode = draft.isEnabled

  const { docs } = await payload.find({
    collection: 'pages',
    // 3. ¡La magia ocurre aquí! Pedimos el borrador si estamos en preview
    draft: isDraftMode,
    where: {
      slug: { equals: 'inicio' },
    },
  })

  const pageData = docs[0]

  // 4. Manejo por si aún no has creado la página en el panel de administración
  if (!pageData || !pageData.banner) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Página no encontrada</h1>
        <p className="text-gray-600 mb-6">
          Aún no has creado la página con el slug "inicio" en Payload.
        </p>
        <a
          href={payloadConfig.routes.admin}
          className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Ir al panel de administración
        </a>
      </div>
    )
  }

  // 5. Extraemos la URL de la imagen del grupo 'banner'
  const imageUrl =
    typeof pageData.banner.image === 'object' && pageData.banner.image !== null
      ? pageData.banner.image.url
      : ''

  // 6. Renderizamos la página usando Tailwind y nuestro componente
  return (
    <main className="min-h-screen bg-white">
      {/* Indicador visual opcional para saber que estás viendo un borrador */}
      {isDraftMode && (
        <div className="bg-yellow-400 text-black text-center text-sm py-1 font-bold z-50 relative">
          Modo Previsualización Activo
        </div>
      )}

      <Banner
        title={pageData.banner.title}
        imageUrl={imageUrl || ''}
        altText={
          typeof pageData.banner.image === 'object' && pageData.banner.image?.alt
            ? pageData.banner.image.alt
            : 'Banner image'
        }
      />
    </main>
  )
}
