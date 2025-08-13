import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  User as FirebaseUser,
  UserCredential,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  DocumentReference,
  onSnapshot
} from 'firebase/firestore'
import { auth, db } from './firebase'

// Types
export interface User {
  id: string
  email: string
  name: string
  character_id?: string | null
  difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null
  current_day: number
  total_points: number
  achievements: string[]
  completed_days?: number[]
  created_at: string
  updated_at: string
  email_verified: boolean
}

export interface Character {
  id: string
  name: string
  description: string
  image_url: string
  cultural_significance: string
  created_at: string
}

export interface Activity {
  id: string
  day: number
  title: string
  description: string
  type: 'quiz' | 'game' | 'story' | 'learning'
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  content: Record<string, unknown>
  points: number
  unlock_date: string
  created_at: string
  updated_at: string
}

export interface UserProgress {
  id: string
  user_id: string
  activity_id: string
  completed_at: string
  score: number
  time_taken: number
  created_at: string
}

// Authentication functions
export const firebaseAuth = {
  // Sign up with email and password
  signUp: async (email: string, password: string, name: string): Promise<{ user: FirebaseUser; needsVerification: boolean }> => {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Update the user's display name
      await updateProfile(user, { displayName: name })

      // Send email verification
      await sendEmailVerification(user)

      // Create user profile in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        id: user.uid,
        email: user.email,
        name: name,
        character_id: null,
        difficulty_level: null,
        current_day: 1,
        total_points: 0,
        achievements: [],
        completed_days: [],
        email_verified: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

      return { user, needsVerification: true }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create account'
      throw new Error(message)
    }
  },

  // Sign in with email and password
  signIn: async (email: string, password: string): Promise<FirebaseUser> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error: unknown) {
      let message = 'Failed to sign in'
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/user-not-found') {
          message = 'No account found with this email address'
        } else if (firebaseError.code === 'auth/wrong-password') {
          message = 'Incorrect password'
        } else if (firebaseError.code === 'auth/invalid-email') {
          message = 'Invalid email address'
        } else if (firebaseError.code === 'auth/user-disabled') {
          message = 'This account has been disabled'
        }
      }
      throw new Error(message)
    }
  },

  // Sign out
  signOut: async (): Promise<void> => {
    try {
      await signOut(auth)
    } catch (error: unknown) {
      throw new Error('Failed to sign out')
    }
  },

  // Send password reset email
  resetPassword: async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email)
    } catch (error: unknown) {
      let message = 'Failed to send password reset email'
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/user-not-found') {
          message = 'No account found with this email address'
        } else if (firebaseError.code === 'auth/invalid-email') {
          message = 'Invalid email address'
        }
      }
      throw new Error(message)
    }
  },

  // Resend email verification
  resendVerification: async (): Promise<void> => {
    if (!auth.currentUser) {
      throw new Error('No user signed in')
    }
    try {
      await sendEmailVerification(auth.currentUser)
    } catch (error: unknown) {
      throw new Error('Failed to send verification email')
    }
  },

  // Update user password
  updatePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    const user = auth.currentUser
    if (!user || !user.email) {
      throw new Error('No user signed in')
    }

    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)

      // Update password
      await updatePassword(user, newPassword)
    } catch (error: unknown) {
      let message = 'Failed to update password'
      if (error instanceof Error && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/wrong-password') {
          message = 'Current password is incorrect'
        } else if (firebaseError.code === 'auth/weak-password') {
          message = 'New password is too weak'
        }
      }
      throw new Error(message)
    }
  }
}

// User profile functions
export const userProfile = {
  // Get user profile
  get: async (userId: string): Promise<User | null> => {
    try {
      const docRef = doc(db, 'users', userId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return docSnap.data() as User
      }
      return null
    } catch (error) {
      console.error('Error getting user profile:', error)
      return null
    }
  },

  // Update user profile
  update: async (userId: string, updates: Partial<User>): Promise<User> => {
    try {
      const docRef = doc(db, 'users', userId)
      const updateData = {
        ...updates,
        updated_at: new Date().toISOString()
      }

      await updateDoc(docRef, updateData)

      // Get updated profile
      const updated = await userProfile.get(userId)
      if (!updated) {
        throw new Error('Failed to get updated profile')
      }

      return updated
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update profile'
      throw new Error(message)
    }
  },

  // Listen to profile changes (real-time)
  listen: (userId: string, callback: (user: User | null) => void): (() => void) => {
    const docRef = doc(db, 'users', userId)
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback(doc.data() as User)
      } else {
        callback(null)
      }
    }, (error) => {
      console.error('Error listening to user profile:', error)
      callback(null)
    })
  }
}

// Characters functions
export const characters = {
  // Get all characters
  getAll: async (): Promise<Character[]> => {
    try {
      const q = query(collection(db, 'characters'), orderBy('created_at', 'asc'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Character))
    } catch (error) {
      console.error('Error getting characters:', error)
      return []
    }
  },

  // Get character by ID
  getById: async (characterId: string): Promise<Character | null> => {
    try {
      const docRef = doc(db, 'characters', characterId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        } as Character
      }
      return null
    } catch (error) {
      console.error('Error getting character:', error)
      return null
    }
  }
}

// Progress tracking functions
export const progress = {
  // Complete an activity
  completeActivity: async (userId: string, activityId: string, score: number, timeTaken: number): Promise<UserProgress> => {
    try {
      // Add progress record
      const progressData = {
        user_id: userId,
        activity_id: activityId,
        score,
        time_taken: timeTaken,
        completed_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      }

      const docRef = await addDoc(collection(db, 'user_progress'), progressData)

      // Update user's total points and current day
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        const userData = userDoc.data() as User
        const newTotalPoints = userData.total_points + score

        // Extract day from activity ID (format: "day_X_difficulty")
        const dayMatch = activityId.match(/day_(\d+)_/)
        const day = dayMatch ? parseInt(dayMatch[1]) : null

        const updates: Partial<User> = {
          total_points: newTotalPoints,
          updated_at: new Date().toISOString()
        }

        // Update current day if this was the user's current day
        if (day && day === userData.current_day) {
          updates.current_day = Math.min(day + 1, 30)
        }

        await updateDoc(doc(db, 'users', userId), updates)
      }

      return {
        id: docRef.id,
        ...progressData
      } as UserProgress
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to complete activity'
      throw new Error(message)
    }
  },

  // Get user's progress
  getUserProgress: async (userId: string): Promise<UserProgress[]> => {
    try {
      const q = query(
        collection(db, 'user_progress'),
        where('user_id', '==', userId),
        orderBy('completed_at', 'desc')
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as UserProgress))
    } catch (error) {
      console.error('Error getting user progress:', error)
      return []
    }
  },

  // Check if activity is completed
  isActivityCompleted: async (userId: string, activityId: string): Promise<boolean> => {
    try {
      const q = query(
        collection(db, 'user_progress'),
        where('user_id', '==', userId),
        where('activity_id', '==', activityId),
        limit(1)
      )
      const querySnapshot = await getDocs(q)

      return !querySnapshot.empty
    } catch (error) {
      console.error('Error checking activity completion:', error)
      return false
    }
  }
}

// Activity functions
export const activities = {
  // Get activities by day and difficulty
  getByDayAndDifficulty: async (day: number, difficulty: string): Promise<Activity | null> => {
    try {
      const q = query(
        collection(db, 'activities'),
        where('day', '==', day),
        where('difficulty', '==', difficulty),
        limit(1)
      )
      const querySnapshot = await getDocs(q)

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0]
        return {
          id: doc.id,
          ...doc.data()
        } as Activity
      }
      return null
    } catch (error) {
      console.error('Error getting activity:', error)
      return null
    }
  },

  // Get all activities
  getAll: async (): Promise<Activity[]> => {
    try {
      const q = query(collection(db, 'activities'), orderBy('day', 'asc'))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Activity))
    } catch (error) {
      console.error('Error getting activities:', error)
      return []
    }
  }
}
