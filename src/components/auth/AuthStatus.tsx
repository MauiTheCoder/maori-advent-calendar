'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { useAuthContext } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'

interface AuthStatusProps {
  showUserMenu?: boolean
  variant?: 'default' | 'compact'
}

export default function AuthStatus({ showUserMenu = true, variant = 'default' }: AuthStatusProps) {
  const { user, profile, loading, signOut, isAuthenticated, emailVerified } = useAuthContext()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin')

  if (loading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        {variant === 'default' && <span className="text-sm">Loading...</span>}
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className={`flex items-center ${variant === 'compact' ? 'space-x-2' : 'space-x-4'}`}>
          <Button
            variant="outline"
            size={variant === 'compact' ? 'sm' : 'default'}
            onClick={() => {
              setAuthMode('signin')
              setShowAuthModal(true)
            }}
          >
            Sign In
          </Button>
          <Button
            size={variant === 'compact' ? 'sm' : 'default'}
            onClick={() => {
              setAuthMode('signup')
              setShowAuthModal(true)
            }}
          >
            Sign Up
          </Button>
        </div>
        <AuthModal 
          isOpen={showAuthModal} 
          onClose={() => setShowAuthModal(false)}
          initialMode={authMode}
        />
      </>
    )
  }

  return (
    <div className="relative">
      {showUserMenu ? (
        <div className="flex items-center space-x-2">
          {!emailVerified && (
            <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
              Verify Email
            </div>
          )}
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className={`flex items-center space-x-2 hover:bg-secondary/50 rounded-lg transition-colors ${
              variant === 'compact' ? 'p-1' : 'p-2'
            }`}
          >
            <div className={`bg-primary text-primary-foreground rounded-full flex items-center justify-center ${
              variant === 'compact' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
            }`}>
              {(profile?.name || user?.displayName || user?.email || 'U')[0].toUpperCase()}
            </div>
            {variant === 'default' && (
              <span className="text-sm font-medium">
                {profile?.name || user?.displayName || 'User'}
              </span>
            )}
          </button>

          <AnimatePresence>
            {showUserDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full right-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50"
              >
                <div className="p-3 border-b border-border">
                  <p className="font-medium text-sm">{profile?.name || user?.displayName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                  {profile && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Level: {profile.difficulty_level || 'Not set'} • Day {profile.current_day}
                    </p>
                  )}
                </div>
                <div className="p-1">
                  <button
                    onClick={() => window.location.href = '/dashboard'}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-md"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => window.location.href = '/character-selection'}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-md"
                  >
                    Character Selection
                  </button>
                  <button
                    onClick={() => window.location.href = '/achievements'}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-md"
                  >
                    Achievements
                  </button>
                  <div className="border-t border-border my-1"></div>
                  <button
                    onClick={async () => {
                      await signOut()
                      setShowUserDropdown(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-secondary rounded-md text-red-600"
                  >
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          <div className={`bg-primary text-primary-foreground rounded-full flex items-center justify-center ${
            variant === 'compact' ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'
          }`}>
            {(profile?.name || user?.displayName || user?.email || 'U')[0].toUpperCase()}
          </div>
          {variant === 'default' && (
            <span className="text-sm font-medium">
              {profile?.name || user?.displayName || 'User'}
            </span>
          )}
        </div>
      )}

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  )
}