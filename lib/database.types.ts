export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          user_id: string
          is_dark_mode: boolean
          notifications_enabled: boolean
          playback_speed: number
          preferred_voice: 'ai' | 'human'
          updated_at: string
        }
        Insert: {
          user_id: string
          is_dark_mode?: boolean
          notifications_enabled?: boolean
          playback_speed?: number
          preferred_voice?: 'ai' | 'human'
          updated_at?: string
        }
        Update: {
          user_id?: string
          is_dark_mode?: boolean
          notifications_enabled?: boolean
          playback_speed?: number
          preferred_voice?: 'ai' | 'human'
          updated_at?: string
        }
      }
      user_interests: {
        Row: {
          id: string
          user_id: string
          interest_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          interest_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          interest_id?: string
          created_at?: string
        }
      }
      articles: {
        Row: {
          id: string
          category: string | null
          source: string | null
          title: string | null
          read_time: string | null
          listen_time: string | null
          time_ago: string | null
          image_url: string | null
          content: string | null
          link: string | null
          author: string | null
          published_date: string | null
          timestamp: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          category?: string | null
          source?: string | null
          title?: string | null
          read_time?: string | null
          listen_time?: string | null
          time_ago?: string | null
          image_url?: string | null
          content?: string | null
          link?: string | null
          author?: string | null
          published_date?: string | null
          timestamp?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          category?: string | null
          source?: string | null
          title?: string | null
          read_time?: string | null
          listen_time?: string | null
          time_ago?: string | null
          image_url?: string | null
          content?: string | null
          link?: string | null
          author?: string | null
          published_date?: string | null
          timestamp?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      saved_articles: {
        Row: {
          id: string
          user_id: string
          article_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          created_at?: string
        }
      }
      listening_history: {
        Row: {
          id: string
          user_id: string
          article_id: string
          progress: number
          duration_seconds: number
          last_played_at: string
          completed: boolean
        }
        Insert: {
          id?: string
          user_id: string
          article_id: string
          progress?: number
          duration_seconds?: number
          last_played_at?: string
          completed?: boolean
        }
        Update: {
          id?: string
          user_id?: string
          article_id?: string
          progress?: number
          duration_seconds?: number
          last_played_at?: string
          completed?: boolean
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
