import { createBrowserClient } from '@/lib/supabase'
import { Database } from '@/lib/supabase'

export type User = Database['public']['Tables']['users']['Row']
export type Character = Database['public']['Tables']['characters']['Row']

// Authentication functions
export const auth = {
  // Sign up with email and password
  async signUp(email: string, password: string, name: string) {
    const supabase = createBrowserClient()

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      }
    })

    if (error) throw error
    return data
  },

  // Sign in with email and password
  async signIn(email: string, password: string) {
    const supabase = createBrowserClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  // Sign out
  async signOut() {
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  // Get current user
  async getCurrentUser() {
    const supabase = createBrowserClient()

    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  // Get user profile
  async getUserProfile(userId: string): Promise<User | null> {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }
    return data
  },

  // Update user profile
  async updateUserProfile(userId: string, updates: Partial<User>) {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Reset password
  async resetPassword(email: string) {
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) throw error
  },

  // Update password
  async updatePassword(newPassword: string) {
    const supabase = createBrowserClient()

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
  }
}

// Character management functions
export const characters = {
  // Get all available characters
  async getAll(): Promise<Character[]> {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('name')

    if (error) throw error
    return data || []
  },

  // Get character by ID
  async getById(id: string): Promise<Character | null> {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching character:', error)
      return null
    }
    return data
  }
}

// Progress tracking functions
export const progress = {
  // Get user's progress
  async getUserProgress(userId: string) {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('user_progress')
      .select(`
        *,
        activities:activity_id (
          id,
          day,
          title,
          type,
          difficulty,
          points
        )
      `)
      .eq('user_id', userId)
      .order('completed_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  // Complete an activity
  async completeActivity(userId: string, activityId: string, score: number, timeTaken: number) {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('user_progress')
      .insert({
        user_id: userId,
        activity_id: activityId,
        score,
        time_taken: timeTaken,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  // Check if activity is completed
  async isActivityCompleted(userId: string, activityId: string): Promise<boolean> {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('user_progress')
      .select('id')
      .eq('user_id', userId)
      .eq('activity_id', activityId)
      .single()

    return !error && data !== null
  }
}

// Activity management
export const activities = {
  // Get activities for a specific day and difficulty
  async getByDayAndDifficulty(day: number, difficulty: 'beginner' | 'intermediate' | 'advanced') {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('day', day)
      .eq('difficulty', difficulty)
      .single()

    if (error) {
      console.error('Error fetching activity:', error)
      return null
    }
    return data
  },

  // Get all activities for a user's difficulty level
  async getForDifficulty(difficulty: 'beginner' | 'intermediate' | 'advanced') {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .eq('difficulty', difficulty)
      .order('day')

    if (error) throw error
    return data || []
  },

  // Check if activity is unlocked for user
  isActivityUnlocked(activity: Database['public']['Tables']['activities']['Row'], userCurrentDay: number): boolean {
    const today = new Date()
    const unlockDate = new Date(activity.unlock_date)

    // Activity is unlocked if:
    // 1. The unlock date has passed, AND
    // 2. The user has reached this day in their journey
    return unlockDate <= today && activity.day <= userCurrentDay
  }
}

// Prize management
export const prizes = {
  // Get all available prizes
  async getAll() {
    const supabase = createBrowserClient()

    const { data, error } = await supabase
      .from('prizes')
      .select('*')
      .order('type', { ascending: true })

    if (error) throw error
    return data || []
  },

  // Check if user is eligible for a prize
  async isEligible(userId: string, prizeId: string): Promise<boolean> {
    const supabase = createBrowserClient()

    // Get prize requirements
    const { data: prize, error: prizeError } = await supabase
      .from('prizes')
      .select('requirements')
      .eq('id', prizeId)
      .single()

    if (prizeError || !prize) return false

    // Get user data
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('total_points, current_day')
      .eq('id', userId)
      .single()

    if (userError || !user) return false

    // Get user progress count
    const { count: activitiesCompleted, error: progressError } = await supabase
      .from('user_progress')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)

    if (progressError) return false

    const requirements = prize.requirements as Record<string, unknown>

    // Check various requirements
    if (requirements.points_required && user.total_points < (requirements.points_required as number)) {
      return false
    }

    if (requirements.days_completed && user.current_day < (requirements.days_completed as number)) {
      return false
    }

    if (requirements.activities_completed && (activitiesCompleted || 0) < (requirements.activities_completed as number)) {
      return false
    }

    return true
  },

  // Claim a prize
  async claim(userId: string, prizeId: string) {
    const supabase = createBrowserClient()

    // Check eligibility first
    const isEligible = await this.isEligible(userId, prizeId)
    if (!isEligible) {
      throw new Error('Not eligible for this prize')
    }

    const { data, error } = await supabase
      .from('user_prize_claims')
      .insert({
        user_id: userId,
        prize_id: prizeId,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }
}
