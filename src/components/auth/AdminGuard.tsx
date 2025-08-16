'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminContext } from '@/contexts/AdminContext'
import { useAuthContext } from '@/contexts/AuthContext'
import AuthGuard from './AuthGuard'

interface AdminGuardProps {
  children: React.ReactNode
  requirePermission?: string
  fallbackPath?: string
}

export default function AdminGuard({ 
  children, 
  requirePermission,
  fallbackPath = '/admin/dashboard' 
}: AdminGuardProps) {
  const { isAdmin, adminUser, loading: adminLoading } = useAdminContext()
  const { isAuthenticated, loading: authLoading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    console.log('🛡️ AdminGuard: State check', { 
      authLoading, 
      adminLoading, 
      isAuthenticated, 
      isAdmin,
      adminUser: !!adminUser 
    })
    
    if (!authLoading && !adminLoading) {
      if (!isAuthenticated) {
        console.log('🛡️ AdminGuard: Not authenticated, redirecting to login')
        router.push('/admin/login')
        return
      }
      
      if (!isAdmin) {
        console.log('🛡️ AdminGuard: Not admin, redirecting to setup')
        router.push('/admin/setup')
        return
      }

      // Check specific permission if required
      if (requirePermission && adminUser) {
        const hasPermission = adminUser.permissions[requirePermission as keyof typeof adminUser.permissions]
        if (!hasPermission) {
          console.log('🛡️ AdminGuard: Missing permission, redirecting to fallback')
          router.push(fallbackPath)
          return
        }
      }
    }
  }, [
    isAuthenticated, 
    isAdmin, 
    authLoading, 
    adminLoading, 
    requirePermission, 
    adminUser, 
    router, 
    fallbackPath
  ])

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span className="text-lg">Loading admin access...</span>
          </div>
          <div className="text-center text-sm text-gray-600 max-w-md">
            <p>Checking authentication and admin permissions...</p>
            <p className="mt-2">If this takes too long, check the browser console for errors.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <AuthGuard requireAuth={true}>
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
            <p className="text-muted-foreground mb-6">Please sign in with an admin account.</p>
          </div>
        </div>
      </AuthGuard>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
          <p className="text-muted-foreground mb-6">
            Your account does not have admin privileges. Contact a super admin to grant access.
          </p>
          <button 
            onClick={() => router.push('/')}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  if (requirePermission && adminUser) {
    const hasPermission = adminUser.permissions[requirePermission as keyof typeof adminUser.permissions]
    if (!hasPermission) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Permission Required</h1>
            <p className="text-muted-foreground mb-6">
              You don't have permission to access this area.
            </p>
            <button 
              onClick={() => router.push(fallbackPath)}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}