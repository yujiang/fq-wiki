import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient | null {
  if (client) return client

  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  console.log("Supabase url:", url);

  if (!url || !anonKey) {
    if (import.meta.env.DEV) {
      console.warn(
        '[Discuss] Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
      )
    }
    return null
  }

  client = createClient(url, anonKey, {
    auth: {
      persistSession: false
    }
  })

  return client
}
