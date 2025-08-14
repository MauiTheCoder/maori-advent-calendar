'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAdmin } from '@/hooks/useAdmin'
import { AdminUser } from '@/types/cms'

interface AdminContextType {
  adminUser: AdminUser | null
  isAdmin: boolean
  loading: boolean
  checkAdminAccess: () => Promise<boolean>
  updateAdminProfile: (updates: Partial<AdminUser>) => Promise<void>
  createAdminUser: (user: Omit<AdminUser, 'uid' | 'createdAt'>, uid: string) => Promise<void>
}

const AdminContext = createContext<AdminContextType | null>(null)

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({ children }: AdminProviderProps) {
  const admin = useAdmin()

  return (
    <AdminContext.Provider value={admin}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdminContext(): AdminContextType {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdminContext must be used within an AdminProvider')
  }
  return context
}

// Re-export the hook for direct usage
export { useAdmin as useFirebaseAdmin }