import { createClient } from '@supabase/supabase-js'

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helper functions
export const signUp = async (email: string, password: string, options: { displayName?: string, phone?: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: options.displayName,
        phone: options.phone
      }
    }
  })
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
  console.log('Current user:', user);
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

export const getApiKeys = async (userId: string) => {
  const { data, error } = await supabase
    .from('user_api_keys')
    .select('*')
    .eq('user_id', userId);
  return { data, error };
};

export const createApiKey = async (userId: string, name: string, expiresAt: string | null) => {
  const apiKey = generateApiToken() // You'll need to implement this function
  const { data, error } = await supabase
    .from('user_api_keys')
    .insert({
      user_id: userId,
      name,
      api_key: apiKey,
      is_active: true,
    })
    .select()

  return { data, error }
}

export const deleteApiKey = async (id: string) => {
  const { data, error } = await supabase
    .from('user_api_keys')
    .delete()
    .match({ id })

  return { data, error }
}

// Helper function to generate a secure API token
const generateApiToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export const createFreeSubscription = async (userId: string) => {
  const { data, error } = await supabase
    .from('subscriptions')
    .insert({
      user_id: userId,
      tier: 'Free',
      status: 'active',
      start_date: new Date().toISOString(),
    })
    .select()

  return { data, error }
}

console.log('Supabase client:', supabase)