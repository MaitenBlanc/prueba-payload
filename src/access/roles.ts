import type { Access } from 'payload'

export const isAdmin = ({ req }: Parameters<Access>[0]): boolean => req.user?.role === 'admin'
export const canEditContent = ({ req }: Parameters<Access>[0]): boolean =>
  req.user?.role === 'admin' || req.user?.role === 'designer'
