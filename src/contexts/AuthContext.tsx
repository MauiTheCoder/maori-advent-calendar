'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthState } from '@/hooks/useAuth'
import { User } from '@/lib/firebase-auth'

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<{ user: any; needsVerification: boolean }>
  signIn: (email: string, password: string) => Promise<any>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<User>
  resetPassword: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  isAuthenticated: boolean
  hasProfile: boolean
  emailVerified: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Re-export the hook with context name for clarity
export { useAuth as useFirebaseAuth }