'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AdminUser } from '@/types/cms'

export default function AdminSetup() {
  const { user, isAuthenticated } = useAuth()
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const createAdminUser = async () => {
    if (!user) {
      setError('You must be logged in to create an admin user')
      return
    }

    setLoading(true)
    setError('')
    setStatus('Creating admin user...')

    try {
      // Check if admin user already exists
      const adminDoc = await getDoc(doc(db, 'admin_users', user.uid))
      
      if (adminDoc.exists()) {
        setStatus('Admin user already exists!')
        setLoading(false)
        return
      }

      // Create admin user document
      const adminUserData: AdminUser = {
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || 'Admin User',
        role: 'super_admin',
        permissions: {
          canEditContent: true,
          canEditLayout: true,
          canManageUsers: true,
          canManageMedia: true,
          canEditActivities: true,
          canViewAnalytics: true
        },
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        isActive: true
      }

      await setDoc(doc(db, 'admin_users', user.uid), adminUserData)
      setStatus('✅ Admin user created successfully! You can now access the admin panel.')
      
      // Verify creation
      setTimeout(async () => {
        const verifyDoc = await getDoc(doc(db, 'admin_users', user.uid))
        if (verifyDoc.exists()) {
          setStatus('✅ Admin user verified and ready to use!')
        }
      }, 1000)

    } catch (err: unknown) {
      console.error('Error creating admin user:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to create admin user: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  const checkAdminStatus = async () => {
    if (!user) return

    setLoading(true)
    setStatus('Checking admin status...')

    try {
      const adminDoc = await getDoc(doc(db, 'admin_users', user.uid))
      
      if (adminDoc.exists()) {
        const adminData = adminDoc.data() as AdminUser
        setStatus(`✅ Admin user exists! Role: ${adminData.role}, Created: ${new Date(adminData.createdAt).toLocaleDateString()}`)
      } else {
        setStatus('❌ No admin user found for this account')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(`Failed to check admin status: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Admin Setup</CardTitle>
            <CardDescription>
              You must be logged in to set up admin access.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Admin User Setup</CardTitle>
          <CardDescription>
            Set up admin access for the current user: {user?.email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {status && (
            <Alert className="border-blue-200 bg-blue-50">
              <AlertDescription className="text-blue-600">
                {status}
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Current User Info</h3>
              <div className="bg-gray-50 p-4 rounded-md">
                <p><strong>UID:</strong> {user?.uid}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                onClick={checkAdminStatus} 
                disabled={loading}
                variant="outline"
              >
                {loading ? 'Checking...' : 'Check Admin Status'}
              </Button>

              <Button 
                onClick={createAdminUser} 
                disabled={loading}
              >
                {loading ? 'Creating...' : 'Create Admin User'}
              </Button>
            </div>

            <div className="text-sm text-gray-600">
              <h4 className="font-semibold mb-2">Instructions:</h4>
              <ol className="list-decimal list-inside space-y-1">
                <li>First, check your current admin status</li>
                <li>If no admin user exists, click "Create Admin User"</li>
                <li>Once created, you can access the admin panel at /admin</li>
                <li>For security, remove or protect this page in production</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}