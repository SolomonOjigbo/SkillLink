/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import type { PostgrestError } from '@supabase/supabase-js';
import type { Database } from '../types/database';

// Use process.env for Vercel compatibility with Next.js/Nuxt
// Fall back to import.meta.env for Vite
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Enhanced environment variable validation
const validateEnv = () => {
  const missingVars = [];
  if (!supabaseUrl) missingVars.push('SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('SUPABASE_ANON_KEY');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing Supabase environment variables: ${missingVars.join(', ')}. ` +
        `Check your Vercel project settings and .env file`
    );
  }
};

validateEnv();

// Create typed client with enhanced config
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
      'X-Client-Info': 'skill-link-app/1.0'
    }
  }
});


// Helper type for queries
export type Table<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

// Helper function for typed selects
export async function typedSelect<T extends keyof Database['public']['Tables']>(
  table: T,
  columns = '*'
) {
  return supabase.from(table).select(columns).returns<Table<T>[]>();
}

export const handleSupabaseResponse = ({
  data,
  error
}: {
  data: any;
  error: PostgrestError | null;
}) => {
  if (error) throw new Error(error.message);
  return data;
};
