'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { User as FirebaseUser } from 'firebase/auth'
import { useAuth } from '@/hooks/useAuth'
import { User, Character } from '@/lib/firebase-auth'

interface AuthContextType {
  // AuthState properties
  user: FirebaseUser | null
  profile: User | null
  character: Character | null
  loading: boolean
  error: string | null
  
  // Auth methods
  signUp: (email: string, password: string, name: string) => Promise<{ user: FirebaseUser; needsVerification: boolean }>
  signIn: (email: string, password: string) => Promise<FirebaseUser>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<User>) => Promise<User>
  resetPassword: (email: string) => Promise<void>
  resendVerification: () => Promise<void>
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>
  
  // Computed properties
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