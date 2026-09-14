import type { CollectionConfig } from 'payload'
import { landingBlocks } from '../landing/blocks'
import { defaultLayout } from '../landing/defaults'
import { canEditContent, isAdmin } from '../access/roles'

export const Pages: CollectionConfig = {
    slug: 'pages',
    labels: { singular: 'Página', plural: 'Páginas' },
    admin: {
        useAsTitle: 'slug',
        group: 'Contenido',
        description: 'Elegí una página para editar sus secciones. Guardá un borrador para revisar los cambios antes de publicar.',
        defaultColumns: ['slug', '_status', 'updatedAt'],
        hideAPIURL: true,
        preview: (doc) => {
            if (doc?.slug) {
                return `/api/preview?slug=${encodeURIComponent(String(doc.slug))}`
            }
            return null
        },
    },
    access: {
        read: ({ req }) => ['admin', 'designer'].includes(req.user?.role || '') ? true : { _status: { equals: 'published' } },
        create: isAdmin,
        update: canEditContent,
        delete: isAdmin,
        readVersions: canEditContent,
    },
    versions: {
        drafts: true,
        maxPerDoc: 20,
    },
    fields: [
        {
            name: 'slug',
            label: 'Nombre de la página',
            admin: { description: 'La página principal se identifica como «inicio». Conservá ese nombre.' },
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
                            label: 'Secciones de la página',
                            type: 'blocks',
                            blocks: landingBlocks,
                            defaultValue: () => structuredClone(defaultLayout),
                            admin: {
                                components: { Field: '@/components/admin/SectionEditor#SectionEditor' },
                                description: 'El encabezado y el pie mantienen sus posiciones. Desmarcá Mostrar sección si querés ocultarla.',
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
