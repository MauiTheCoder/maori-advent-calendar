'use client'

import { useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { firebaseAuth, userProfile, User, Character, characters } from '@/lib/firebase-auth'

export interface AuthState {
  user: FirebaseUser | null
  profile: User | null
  character: Character | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    character: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setState(prev => ({ ...prev, loading: true, error: null }))

      if (firebaseUser) {
        try {
          await loadUserData(firebaseUser)
        } catch (err) {
          setState(prev => ({
            ...prev,
            error: err instanceof Error ? err.message : 'Failed to load user data',
            loading: false
          }))
        }
      } else {
        setState({
          user: null,
          profile: null,
          character: null,
          loading: false,
          error: null,
        })
      }
    })

    return () => unsubscribe()
  }, [])

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      // Get user profile from Firestore
      let profile = await userProfile.get(firebaseUser.uid)

      if (!profile) {
        console.log('🔧 User profile not found, creating one...')
        // Auto-create missing profile
        const { ensureUserProfile } = await import('@/lib/firebase-seed')
        profile = await ensureUserProfile(firebaseUser.uid, firebaseUser.email!, firebaseUser.displayName || undefined)
      }

      // Update email verification status
      if (firebaseUser.emailVerified !== profile.email_verified) {
        await userProfile.update(firebaseUser.uid, {
          email_verified: firebaseUser.emailVerified
        })
        profile.email_verified = firebaseUser.emailVerified
      }

      // Get character if user has selected one
      let character: Character | null = null
      if (profile.character_id) {
        character = await characters.getById(profile.character_id)
      }

      setState({
        user: firebaseUser,
        profile,
        character,
        loading: false,
        error: null,
      })
    } catch (err) {
      throw err
    }
  }

  const signUp = async (email: string, password: string, name: string): Promise<{ user: FirebaseUser; needsVerification: boolean }> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const result = await firebaseAuth.signUp(email, password, name)
      return result
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign up failed'
      setState(prev => ({ ...prev, error, loading: false }))
      throw err
    }
  }

  const signIn = async (email: string, password: string): Promise<FirebaseUser> => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const result = await firebaseAuth.signIn(email, password)
      return result
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign in failed'
      setState(prev => ({ ...prev, error, loading: false }))
      throw err
    }
  }

  const signOut = async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      await firebaseAuth.signOut()
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Sign out failed'
      setState(prev => ({ ...prev, error, loading: false }))
      throw err
    }
  }

  const updateProfile = async (updates: Partial<User>) => {
    if (!state.user) throw new Error('No user logged in')

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      const updatedProfile = await userProfile.update(state.user.uid, updates)

      // If character was updated, load the new character data
      let character = state.character
      if (updates.character_id && updates.character_id !== state.profile?.character_id) {
        character = await characters.getById(updates.character_id)
      }

      setState(prev => ({
        ...prev,
        profile: updatedProfile,
        character,
        loading: false,
      }))

      return updatedProfile
    } catch (err) {
      const error = err instanceof Error ? err.message : 'Failed to update profile'
      setState(prev => ({ ...prev, error, loading: false }))
      throw err
    }
  }

  const resetPassword = async (email: string) => {
    try {
      await firebaseAuth.resetPassword(email)
    } catch (err) {
      throw err
    }
  }

  const resendVerification = async () => {
    try {
      await firebaseAuth.resendVerification()
    } catch (err) {
      throw err
    }
  }

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      await firebaseAuth.updatePassword(currentPassword, newPassword)
    } catch (err) {
      throw err
    }
  }

  return {
    ...state,
    signUp,
    signIn,
    signOut,
    updateProfile,
    resetPassword,
    resendVerification,
    updatePassword,
    isAuthenticated: !!state.user,
    hasProfile: !!state.profile,
    emailVerified: state.user?.emailVerified || false,
  }
}

// Hook for managing user progress
export function useProgress() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const completeActivity = async (activityId: string, score: number, timeTaken: number) => {
    if (!user) throw new Error('No user logged in')

    try {
      setLoading(true)
      setError(null)

      const { progress } = await import('@/lib/firebase-auth')
      const result = await progress.completeActivity(user.uid, activityId, score, timeTaken)

      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to complete activity'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getUserProgress = async () => {
    if (!user) return []

    try {
      setLoading(true)
      setError(null)

      const { progress } = await import('@/lib/firebase-auth')
      const result = await progress.getUserProgress(user.uid)

      return result
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to load progress'
      setError(errorMsg)
      return []
    } finally {
      setLoading(false)
    }
  }

  const isActivityCompleted = async (activityId: string) => {
    if (!user) return false

    try {
      const { progress } = await import('@/lib/firebase-auth')
      return await progress.isActivityCompleted(user.uid, activityId)
    } catch (err) {
      console.error('Error checking activity completion:', err)
      return false
    }
  }

  return {
    loading,
    error,
    completeActivity,
    getUserProgress,
    isActivityCompleted,
  }
}

// Hook for managing characters
export function useCharacters() {
  const [characterList, setCharacterList] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        setLoading(true)
        setError(null)

        const data = await characters.getAll()
        setCharacterList(data)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load characters'
        setError(errorMsg)
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  return {
    characters: characterList,
    loading,
    error
  }
}
