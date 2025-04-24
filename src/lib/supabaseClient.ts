import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Define the Supabase configuration interface
interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Function to get Supabase configuration from environment variables
const getConfig = (): SupabaseConfig => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Supabase environment variables not set. Please check your .env file'
    );
  }

  return {
    url,
    anonKey
  };
};

const config = getConfig();
export const supabase: SupabaseClient = createClient(
  config.url,
  config.anonKey
);

// Helper type for standardized responses
export type SupabaseResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Typed wrapper for Supabase operations
export async function supabaseQuery<T>(
  query: Promise<{ data: T | null; error: Error | null }>
): Promise<SupabaseResponse<T>> {
  const { data, error } = await query;
  return { data, error };
}
