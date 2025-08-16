'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { User } from 'firebase/auth'
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
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

export const useAdmin = () => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🔥 useAdmin: Starting admin hook initialization')
    
    // Set a timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      console.warn('⚠️ useAdmin: Auth state change timeout - setting loading to false')
      setLoading(false)
    }, 10000) // 10 second timeout

    const unsubscribe = auth.onAuthStateChanged(async (user: User | null) => {
      console.log('🔥 useAdmin: Auth state changed', { user: user?.email || 'null' })
      clearTimeout(timeoutId) // Clear timeout since auth state changed
      setLoading(true)
      
      if (user) {
        try {
          console.log('🔥 useAdmin: Checking admin user for:', user.uid)
          const adminDoc = await getDoc(doc(db, 'admin_users', user.uid))
          
          if (adminDoc.exists()) {
            console.log('✅ useAdmin: Admin user found')
            const adminData = adminDoc.data() as AdminUser
            setAdminUser(adminData)
            
            // Update last login
            await setDoc(doc(db, 'admin_users', user.uid), {
              ...adminData,
              lastLogin: new Date().toISOString()
            }, { merge: true })
          } else {
            console.log('❌ useAdmin: No admin user found for this account')
            setAdminUser(null)
          }
        } catch (error: unknown) {
          console.error('❌ useAdmin: Error fetching admin user:', error)
          setAdminUser(null)
        }
      } else {
        console.log('🔥 useAdmin: No authenticated user')
        setAdminUser(null)
      }
      setLoading(false)
      console.log('🔥 useAdmin: Loading complete')
    })

    return () => {
      clearTimeout(timeoutId)
      unsubscribe()
    }
  }, [])

  const checkAdminAccess = async (): Promise<boolean> => {
    const user = auth.currentUser
    if (!user) return false

    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', user.uid))
      return adminDoc.exists()
    } catch (error: unknown) {
      console.error('Error checking admin access:', error)
      return false
    }
  }

  const updateAdminProfile = async (updates: Partial<AdminUser>): Promise<void> => {
    const user = auth.currentUser
    if (!user || !adminUser) throw new Error('No authenticated admin user')

    try {
      const updatedData = {
        ...adminUser,
        ...updates,
        lastUpdated: new Date().toISOString()
      }

      await setDoc(doc(db, 'admin_users', user.uid), updatedData, { merge: true })
      setAdminUser(updatedData)
    } catch (error: unknown) {
      console.error('Error updating admin profile:', error)
      throw error
    }
  }

  const createAdminUser = async (userData: Omit<AdminUser, 'uid' | 'createdAt'>, uid: string): Promise<void> => {
    try {
      const newAdminUser: AdminUser = {
        ...userData,
        uid,
        createdAt: new Date().toISOString()
      }

      await setDoc(doc(db, 'admin_users', uid), newAdminUser)
    } catch (error: unknown) {
      console.error('Error creating admin user:', error)
      throw error
    }
  }

  return {
    adminUser,
    isAdmin: !!adminUser,
    loading,
    checkAdminAccess,
    updateAdminProfile,
    createAdminUser
  }
}

// Helper hook for admin permissions
export const useAdminPermissions = () => {
  const { adminUser } = useAdmin()

  return {
    canEditContent: adminUser?.permissions.canEditContent ?? false,
    canEditLayout: adminUser?.permissions.canEditLayout ?? false,
    canManageUsers: adminUser?.permissions.canManageUsers ?? false,
    canManageMedia: adminUser?.permissions.canManageMedia ?? false,
    canEditActivities: adminUser?.permissions.canEditActivities ?? false,
    canViewAnalytics: adminUser?.permissions.canViewAnalytics ?? false,
    isSuperAdmin: adminUser?.role === 'super_admin',
    isAdmin: adminUser?.role === 'admin' || adminUser?.role === 'super_admin',
    role: adminUser?.role
  }
}