import type { CollectionConfig } from 'payload'
import { landingBlocks } from '../landing/blocks'
import { defaultLayout } from '../landing/defaults'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'slug',
        preview: (doc) => {
            if (doc?.slug) {
                return `/api/preview?slug=${encodeURIComponent(String(doc.slug))}`
            }
            return null
        },
    },
    access: {
        read: ({ req }) => req.user ? true : { _status: { equals: 'published' } },
    },
    versions: {
        drafts: true, // Agrega el estado "Borrador" vs "Publicado"
        maxPerDoc: 20, // Limita el historial a 20 versiones para no saturar la base de datos
    },
    fields: [
        {
            name: 'slug', // Ej: 'inicio', 'contacto'
            type: 'text',
            required: true,
            unique: true,
        },
        { type: 'tabs', tabs: [
        { label: 'Portada', fields: [
        {
            name: 'banner',
            type: 'group',
            fields: [
                {
                    name: 'title',
                    type: 'richText',
                    required: true,
                    label: 'Título del Banner',
                },
                {
                    name: 'image',
                    type: 'upload',
                    relationTo: 'media', // Se conecta con la colección de media
                    required: false,
                    label: 'Imagen del Banner',
                },
            ],
        },
        ] },
        { label: 'Secciones', fields: [{
            name: 'layout',
            label: 'Secciones de la landing',
            type: 'blocks',
            blocks: landingBlocks,
            defaultValue: () => structuredClone(defaultLayout),
            admin: {
                components: { Field: '@/components/admin/SectionEditor#SectionEditor' },
                description: 'Encabezado y pie mantienen sus posiciones fijas. Usá Mostrar sección para ocultar un bloque.',
            },
            validate: (value: unknown) => {
                if (!Array.isArray(value)) return true
                for (const type of ['header', 'footer']) {
                    if (value.filter((item) => item.blockType === type).length > 1) return 'Solo se permite un encabezado y un pie de página.'
                }
                return true
            },
        }] },
        ] },
    ],
}
