import type { Block, Field } from 'payload'

const text = (name: string, label: string): Field => ({ name, label, type: 'text' })
const image = (name = 'image', label = 'Imagen / ícono'): Field => ({ name, label, type: 'upload', relationTo: 'media' })
const url: Field = {
  name: 'url', label: 'Destino del enlace', type: 'text',
  admin: { description: 'Usá /ruta, #seccion, https://..., mailto:... o tel:... . Vacío deja el enlace deshabilitado.' },
  validate: (value: unknown) => !value || (typeof value === 'string' && /^(\/(?!\/)|#[\w-]+$|https?:\/\/|mailto:|tel:)/i.test(value)) || 'Ingresá una URL válida o una ruta que comience con /.',
}
const linkFields: Field[] = [text('label', 'Texto'), url]
const button: Field = { name: 'button', label: 'Botón', type: 'group', fields: linkFields }
const items = (fields: Field[], label = 'Elementos'): Field => ({ name: 'items', label, type: 'array', fields })
const block = (slug: string, label: string, fields: Field[]): Block => ({
  slug, labels: { singular: label, plural: label }, fields: [
    { name: 'visible', label: 'Mostrar sección', type: 'checkbox', defaultValue: true }, ...fields,
  ],
})

export const landingBlocks: Block[] = [
  block('header', 'Encabezado', [image('logo', 'Logo'), text('brand', 'Nombre de marca'),
    { name: 'links', label: 'Navegación', type: 'array', fields: linkFields },
    { name: 'actions', label: 'Botones', type: 'array', fields: linkFields },
  ]),
  block('payments', 'Nos adaptamos a tu manera de cobrar', [text('title', 'Título'), items([text('title', 'Título'), text('description', 'Descripción'), image()], 'Soluciones')]),
  block('business', 'Todo solucionado', [{ name: 'title', label: 'Título', type: 'textarea' }, image(),
    items([{ name: 'text', label: 'Texto del beneficio', type: 'richText' }], 'Beneficios'), button,
  ]),
  block('kit', 'Kit de soluciones', [text('title', 'Título'), items([text('title', 'Título'), text('description', 'Descripción'), image(), url], 'Tarjetas')]),
  block('benefits', 'Beneficios para clientes', [text('title', 'Título'), items([text('title', 'Título'), text('description', 'Texto del enlace'), url]), button]),
  block('stats', 'Payway en cifras', [text('title', 'Título'), items([text('value', 'Cifra'), text('label', 'Descripción'), image(), url], 'Cifras')]),
  block('footer', 'Pie de página', [image('logo', 'Logo'), text('brand', 'Nombre de marca'),
    { name: 'socials', label: 'Redes sociales', type: 'array', fields: [...linkFields, image()] },
    text('appsTitle', 'Título de descargas'),
    { name: 'apps', label: 'Tiendas de aplicaciones', type: 'array', fields: [...linkFields, image()] },
    { name: 'columns', label: 'Columnas', type: 'array', fields: [text('title', 'Título'), items(linkFields, 'Enlaces')] },
    { name: 'legal', label: 'Texto legal', type: 'textarea' },
  ]),
]
