'use client'

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AdminUser } from '@/types/cms'

export default function CreateAdmin() {
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
        setStatus('✅ Admin user already exists!')
        setLoading(false)
        return
      }

      // Create admin user document
      const adminUserData: AdminUser = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || 'Admin User',
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
        lastLogin: new Date().toISOString()
      }

      await setDoc(doc(db, 'admin_users', user.uid), adminUserData)
      setStatus('✅ Admin user created successfully! You can now access the admin panel.')
      
      // Verify creation
      setTimeout(async () => {
        const verifyDoc = await getDoc(doc(db, 'admin_users', user.uid))
        if (verifyDoc.exists()) {
          setStatus('✅ Admin user verified and ready! Redirecting to admin panel...')
          setTimeout(() => {
            window.location.href = '/admin'
          }, 2000)
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
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Please sign in to your account first, then return to this page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto cultural-card">
          <CardHeader>
            <CardTitle className="text-2xl">🛡️ Admin User Setup</CardTitle>
            <CardDescription>
              Create admin access for: <strong>{user?.email}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            {status && (
              <Alert className="bg-blue-50">
                <AlertDescription className="text-blue-600">
                  {status}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Current User Information</h3>
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <p><strong>UID:</strong> <code className="text-sm bg-muted px-2 py-1 rounded">{user?.uid}</code></p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
                  <p><strong>Email Verified:</strong> {user?.emailVerified ? '✅ Yes' : '❌ No'}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={checkAdminStatus} 
                  disabled={loading}
                  variant="outline"
                  className="flex-1"
                >
                  {loading ? '⏳ Checking...' : '🔍 Check Admin Status'}
                </Button>

                <Button 
                  onClick={createAdminUser} 
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? '⏳ Creating...' : '🚀 Create Admin User'}
                </Button>
              </div>

              <div className="bg-accent/10 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 text-accent">📋 Instructions:</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>First, check your current admin status</li>
                  <li>If no admin user exists, click "Create Admin User"</li>
                  <li>Wait for the success message</li>
                  <li>You'll be automatically redirected to the admin panel</li>
                  <li><strong>Security:</strong> Remove this page in production</li>
                </ol>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  After successful setup, access the admin panel:
                </p>
                <Button variant="outline" asChild>
                  <a href="/admin" target="_blank">
                    🎛️ Go to Admin Panel
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}