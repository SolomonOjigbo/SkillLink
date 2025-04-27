/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check your .env file'
  );
}

// Create typed client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

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
