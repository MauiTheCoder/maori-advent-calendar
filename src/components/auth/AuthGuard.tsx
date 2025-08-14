'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireVerification?: boolean
  fallback?: React.ReactNode
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  requireVerification = false,
  fallback 
}: AuthGuardProps) {
  const { user, loading, emailVerified, isAuthenticated } = useAuthContext()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !isAuthenticated) {
        setShowAuthModal(true)
      } else if (requireVerification && !emailVerified) {
        // User is authenticated but email is not verified
        // Could redirect to verification page or show verification prompt
      }
    }
  }, [loading, isAuthenticated, emailVerified, requireAuth, requireVerification])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  if (requireAuth && !isAuthenticated) {
    return (
      <>
        {fallback || (
          <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
              <p className="text-muted-foreground mb-6">Please sign in to access this page.</p>
              <button 
                onClick={() => setShowAuthModal(true)}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Sign In
              </button>
            </div>
          </div>
        )}
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)} 
        />
      </>
    )
  }

  if (requireVerification && !emailVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/10 flex items-center justify-center">
        <div className="text-center max-w-md">
          <h1 className="text-2xl font-bold mb-4">Email Verification Required</h1>
          <p className="text-muted-foreground mb-6">
            Please check your email and click the verification link to continue.
          </p>
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              I've Verified My Email
            </button>
            <div>
              <button 
                onClick={() => {
                  // This would trigger resend verification
                  // Implementation depends on your auth hook
                }}
                className="text-sm text-muted-foreground hover:text-primary"
              >
                Resend verification email
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}