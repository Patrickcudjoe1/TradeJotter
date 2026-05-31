import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

const isConfigured = !!(supabaseUrl && supabaseAnonKey)

if (!isConfigured) {
  console.warn('⚠️ Missing Supabase URL or Anonymous Key in environment variables.')
}

// Graceful fallback to avoid crashing React on startup when env keys are missing
export const supabase = isConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : {
      auth: {
        getSession: async () => ({ data: { session: null } }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: { message: "Supabase not configured. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment variables." } }),
        signUp: async () => ({ error: { message: "Supabase not configured." } }),
        signOut: async () => {}
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null }) }) })
      })
    }

