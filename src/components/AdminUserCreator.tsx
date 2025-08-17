'use client'

import { useEffect } from 'react'
import { createAdminUserRecord } from '@/utils/create-admin-user'

/**
 * Component that exposes admin user creation function to browser console
 * This allows easy manual creation of admin user records
 */
export function AdminUserCreator() {
  useEffect(() => {
    // Expose the function to the browser console for manual execution
    if (typeof window !== 'undefined') {
      (window as any).createAdminUser = createAdminUserRecord
      console.log('🔧 Admin utility loaded! Run window.createAdminUser() to create admin user record.')
    }
  }, [])

  // This component renders nothing, it just exposes utilities
  return null
}