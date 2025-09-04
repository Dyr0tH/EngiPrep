import { createClient } from '@supabase/supabase-js'

// Get environment variables based on platform
const getSupabaseUrl = () => {
  // For Expo
  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_URL) {
    return process.env.EXPO_PUBLIC_SUPABASE_URL
  }
  // For Next.js
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return process.env.NEXT_PUBLIC_SUPABASE_URL
  }
  throw new Error('Supabase URL not found in environment variables')
}

const getSupabaseAnonKey = () => {
  // For Expo
  if (typeof process !== 'undefined' && process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY
  }
  // For Next.js
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  }
  throw new Error('Supabase Anon Key not found in environment variables')
}

const supabaseUrl = getSupabaseUrl()
const supabaseAnonKey = getSupabaseAnonKey()

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

// Auth helper functions
export const signUp = async (email: string, password: string, userData?: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  return { user, error }
}

export const getSession = async () => {
  const { data: { session }, error } = await supabase.auth.getSession()
  return { session, error }
}