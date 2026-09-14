import type { CollectionConfig } from 'payload'
import { canEditContent, isAdmin } from '../access/roles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  auth: true,
  access: {
    admin: canEditContent,
    create: isAdmin,
    // /me needs to read the signed-in user's own record. Collection listings
    // and every other user's record remain restricted to administrators.
    read: ({ req, id }) => req.user?.role === 'admin' || Boolean(req.user && id && String(id) === String(req.user.id)),
    update: isAdmin,
    delete: isAdmin,
    unlock: isAdmin,
  },
  hooks: {
    beforeChange: [async ({ data, operation, req }) => {
      // Preserve Payload's first-user setup on a new, empty installation.
      if (operation === 'create') {
        const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req })
        if (totalDocs === 0) data.role = 'admin'
      }
      return data
    }],
  },
  fields: [
    {
      name: 'role',
      label: 'Rol',
      type: 'select',
      required: true,
      defaultValue: 'designer',
      saveToJWT: true,
      options: [
        { label: 'Administrador', value: 'admin' },
        { label: 'Diseñadora / Contenido', value: 'designer' },
      ],
      access: {
        create: ({ req }) => req.user?.role === 'admin',
        update: ({ req }) => req.user?.role === 'admin',
      },
      admin: { description: 'Diseñadora: carga imágenes y edita páginas. Administrador: también administra usuarios y elimina contenido.' },
    },
  ],
}
