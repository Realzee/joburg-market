import { createClient } from '@supabase/supabase-js'

// Your project credentials
const SUPABASE_URL = 'https://xvcehitgpuvzagjttecc.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh2Y2VoaXRncHV2emFnanR0ZWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0MjMyODMsImV4cCI6MjA3NTk5OTI4M30.UQs15hRbGPwJxhbx2b4dr2oMN5T2ZX9pP0T5pTi3FWU'

// Initialize Supabase client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Utility: Get current user
export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  if (error) console.error('Error fetching user:', error.message)
  return data?.user || null
}

// Utility: Sign in user
export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) console.error('Sign-in error:', error.message)
  return { data, error }
}

// Utility: Sign up new user
export const signUp = async (email, password, meta = {}) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: meta }
  })
  if (error) console.error('Sign-up error:', error.message)
  return { data, error }
}

// Utility: Sign out user
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) console.error('Sign-out error:', error.message)
}