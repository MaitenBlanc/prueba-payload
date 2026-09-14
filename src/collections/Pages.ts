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
        drafts: true,
        maxPerDoc: 20,
    },
    fields: [
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Secciones',
                    fields: [
                        {
                            name: 'layout',
                            label: 'Secciones de la landing',
                            type: 'blocks',
                            blocks: landingBlocks,
                            defaultValue: () => structuredClone(defaultLayout),
                            admin: {
                                components: { Field: '@/components/admin/SectionEditor#SectionEditor' },
                                description: 'Encabezado y pie mantienen sus posiciones fijas. Usa Mostrar sección para ocultar un bloque.',
                            },
                            validate: (value: unknown) => {
                                if (!Array.isArray(value)) return true
                                for (const type of ['header', 'footer']) {
                                    if (value.filter((item) => item.blockType === type).length > 1) return 'Solo se permite un encabezado y un pie de página.'
                                }
                                return true
                            },
                        }
                    ]
                },
            ]
        },
    ],
}