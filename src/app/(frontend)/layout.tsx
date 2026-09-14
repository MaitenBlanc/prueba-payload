import React from 'react'
import './styles.css'

export const metadata = {
  description: 'Nos adaptamos a tu manera de cobrar.',
  title: 'Payway | Soluciones de cobro',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="es-AR">
      <body>
        {children}
      </body>
    </html>
  )
}
