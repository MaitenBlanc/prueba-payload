import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
    slug: 'pages',
    admin: {
        useAsTitle: 'slug',
        preview: (doc) => {
            if (doc?.slug) {
                // Pasamos el slug actual y nuestra contraseña secreta
                return `/api/preview?slug=${doc.slug}&secret=mi-secreto-123`
            }
            return null
        },
    },
    access: {
        read: () => true, // Permite que React pueda leer las páginas
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
        // estructura del Banner
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
                    required: true,
                    label: 'Imagen del Banner',
                },
            ],
        },
    ],
}
