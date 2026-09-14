import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin } from '../access/roles'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Imagen', plural: 'Biblioteca de imágenes' },
  admin: {
    group: 'Contenido',
    useAsTitle: 'alt',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
    hideAPIURL: true,
    description: 'Subí tus imágenes, logos e íconos. Después podés elegirlos al editar una página.',
  },
  access: {
    read: () => true,
    create: canEditContent,
    update: canEditContent,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      label: 'Descripción de la imagen',
      admin: { description: 'Contá brevemente qué se ve. Esta descripción ayuda a las personas que usan lectores de pantalla.' },
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
