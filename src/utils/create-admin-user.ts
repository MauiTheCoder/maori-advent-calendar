/**
 * Utility to create admin user record for authenticated users
 * This can be used in browser console or as a one-time setup script
 */

import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { AdminUser } from '@/types/cms'

export const createAdminUserRecord = async (): Promise<void> => {
  const user = auth.currentUser
  
  if (!user) {
    throw new Error('No authenticated user found. Please sign in first.')
  }

  // Check if user email is in the admin list
  const adminEmails = ['leon.green@twoa.ac.nz']
  if (!user.email || !adminEmails.includes(user.email)) {
    throw new Error(`Email ${user.email} is not authorized for admin access.`)
  }

  console.log('🔥 Creating admin user record for:', user.email)

  // Create the admin user record
  const adminUserData: AdminUser = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || 'Admin User',
    role: 'super_admin',
    permissions: {
      canEditContent: true,
      canEditLayout: true,
      canManageUsers: true,
      canManageMedia: true,
      canEditActivities: true,
      canViewAnalytics: true,
    },
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }

  try {
    await setDoc(doc(db, 'admin_users', user.uid), adminUserData)
    console.log('✅ Admin user record created successfully!')
    console.log('Admin data:', adminUserData)
    
    // Refresh the page to load the new admin state
    window.location.reload()
  } catch (error) {
    console.error('❌ Failed to create admin user record:', error)
    throw error
  }
}

// Export for browser console use
if (typeof window !== 'undefined') {
  (window as any).createAdminUser = createAdminUserRecord
}