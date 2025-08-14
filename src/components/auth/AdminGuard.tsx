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
    if (!authLoading && !adminLoading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
        return
      }
      
      if (!isAdmin) {
        router.push('/admin/setup')
        return
      }

      // Check specific permission if required
      if (requirePermission && adminUser) {
        const hasPermission = adminUser.permissions[requirePermission as keyof typeof adminUser.permissions]
        if (!hasPermission) {
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
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading admin access...</span>
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