import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password })
  return { data, error }
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const forgotPassword = async (email: string) => {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  return { data, error }
}

// Database helper functions
export const fetchData = async (table: string, query: any = {}) => {
  const { data, error } = await supabase
    .from(table)
    .select(query.select || '*')
    .match(query.match || {})
    .order(query.order || { created_at: 'desc' })
    .range(query.range?.[0] || 0, query.range?.[1] || 9)

  return { data, error }
}

export const insertData = async (table: string, data: any) => {
  const { data: insertedData, error } = await supabase
    .from(table)
    .insert(data)
    .select()

  return { data: insertedData, error }
}

export const updateData = async (table: string, id: string, data: any) => {
  const { data: updatedData, error } = await supabase
    .from(table)
    .update(data)
    .match({ id })
    .select()

  return { data: updatedData, error }
}

export const deleteData = async (table: string, id: string) => {
  const { data, error } = await supabase
    .from(table)
    .delete()
    .match({ id })

  return { data, error }
}

export const insertAIPrompt = async (userId: string, prompt: string, tokens: number) => {
  const { data, error } = await supabase
    .from('ai_prompts')
    .insert({
      user_id: userId,
      prompt,
      tokens,
    })
    .select()

  return { data, error }
}

export const getUserPromptCount = async (userId: string, timeframe: 'day' | 'month' = 'day') => {
  const now = new Date();
  const startDate = timeframe === 'day' 
    ? new Date(now.setHours(0,0,0,0)) 
    : new Date(now.getFullYear(), now.getMonth(), 1);

  const { count, error } = await supabase
    .from('ai_prompts')
    .select('id', { count: 'exact' })
    .eq('user_id', userId)
    .gte('created_at', startDate.toISOString());

  return { count, error };
};