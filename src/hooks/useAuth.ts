/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { AuthError, Session, User } from '@supabase/supabase-js';

// Type definitions for our hooks
type AuthCredentials = {
  email: string;
  password: string;
};

type SignUpCredentials = AuthCredentials & {
  options?: {
    data?: Record<string, any>;
    redirectTo?: string;
  };
};

// Get current user session with proper typing
export function useSession() {
  return useQuery<Session | null, AuthError>({
    queryKey: ['auth', 'session'],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      return data.session;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes instead of Infinity
    retry: (failureCount, error) => {
      // Don't retry for 401 errors (unauthorized)
      if (error.message.includes('401')) return false;
      return failureCount < 3;
    }
  });
}

// Get current user with extended data
export function useUser() {
  return useQuery<User | null, AuthError>({
    queryKey: ['auth', 'user'],
    queryFn: async () => {
      const {
        data: { user },
        error
      } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    }
  });
}

// Login mutation with proper typing
export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation<
    { session: Session; user: User },
    AuthError,
    AuthCredentials
  >({
    mutationFn: async ({ email, password }) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate all auth-related queries
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });
}

// Enhanced signup mutation
export function useSignup() {
  const queryClient = useQueryClient();

  return useMutation<
    { session: Session | null; user: User | null },
    AuthError,
    SignUpCredentials
  >({
    mutationFn: async ({ email, password, options }) => {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation<void, AuthError, void>({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] });
      queryClient.resetQueries({ queryKey: ['auth'] });
    }
  });
}

// Password reset mutation
export function useResetPassword() {
  return useMutation<void, AuthError, { email: string }>({
    mutationFn: async ({ email }) => {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    }
  });
}

// Update user mutation
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, AuthError, { updates: Partial<User> }>({
    mutationFn: async ({ updates }) => {
      const { data, error } = await supabase.auth.updateUser(updates);
      if (error) throw error;
      return data.user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    }
  });
}
