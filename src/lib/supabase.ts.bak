import { createBrowserClient as createClient } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Client-side Supabase client
export const createBrowserClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Admin client for server actions
export const createAdminClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

  return createSupabaseClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          character_id: string | null
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          current_day: number
          total_points: number
          achievements: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          character_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          current_day?: number
          total_points?: number
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          character_id?: string | null
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          current_day?: number
          total_points?: number
          achievements?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          name: string
          description: string
          image_url: string
          cultural_significance: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image_url: string
          cultural_significance: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image_url?: string
          cultural_significance?: string
          created_at?: string
        }
      }
      activities: {
        Row: {
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
        Insert: {
          id?: string
          day: number
          title: string
          description: string
          type: 'quiz' | 'game' | 'story' | 'learning'
          difficulty: 'beginner' | 'intermediate' | 'advanced'
          content: Record<string, unknown>
          points: number
          unlock_date: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          day?: number
          title?: string
          description?: string
          type?: 'quiz' | 'game' | 'story' | 'learning'
          difficulty?: 'beginner' | 'intermediate' | 'advanced'
          content?: Record<string, unknown>
          points?: number
          unlock_date?: string
          created_at?: string
          updated_at?: string
        }
      }
      user_progress: {
        Row: {
          id: string
          user_id: string
          activity_id: string
          completed_at: string
          score: number
          time_taken: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_id: string
          completed_at?: string
          score: number
          time_taken: number
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_id?: string
          completed_at?: string
          score?: number
          time_taken?: number
          created_at?: string
        }
      }
      prizes: {
        Row: {
          id: string
          name: string
          description: string
          type: 'digital' | 'physical' | 'draw_entry'
          requirements: Record<string, unknown>
          available_quantity: number | null
          claimed_count: number
          image_url: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: 'digital' | 'physical' | 'draw_entry'
          requirements: Record<string, unknown>
          available_quantity?: number | null
          claimed_count?: number
          image_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: 'digital' | 'physical' | 'draw_entry'
          requirements?: Record<string, unknown>
          available_quantity?: number | null
          claimed_count?: number
          image_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
