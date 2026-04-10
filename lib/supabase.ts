import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export interface User {
  id: string
  email: string
  name: string | null
  is_pro: boolean
  scripts_used: number
  scripts_limit: number
  created_at: string
}

export interface Script {
  id: string
  user_id: string
  topic: string
  tone: string
  duration: number
  hooks: string[]
  script: string
  caption: string
  hashtags: string
  created_at: string
}
