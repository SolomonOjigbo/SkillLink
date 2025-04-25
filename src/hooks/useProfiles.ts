// useUserProfiles.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { handleSupabaseResponse } from '../lib/supabaseClient';
import { TableRow } from '../types/supabase.helpers';
import { useInsertMutation } from './useTypedSupabase';

export function useUserProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*');
      return handleSupabaseResponse({ data, error });
    }
  });
}

export function useUserProfileById(userId: string) {
  return useQuery({
    queryKey: ['profiles', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single(); // Ensures we get a single record

      return handleSupabaseResponse({ data, error });
    },
    enabled: !!userId, // Only runs if userId exists
    staleTime: 5 * 60 * 1000 // 5 minutes cache
  });
}

export function useCreateUserProfile() {
  return useInsertMutation('profiles');
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: Partial<TableRow<'profiles'>>) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', updates.id ?? '')
        .select();

      return handleSupabaseResponse({ data, error });
    },
    onSuccess: (_, variables) => {
      // Invalidate both the list and specific profile
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      queryClient.invalidateQueries({ queryKey: ['profiles', variables.id] });
    }
  });
}

export function useDeleteUserProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      return handleSupabaseResponse({ data, error });
    },
    onSuccess: (_, userId) => {
      // Remove both the specific profile and invalidate the list
      queryClient.removeQueries({ queryKey: ['profiles', userId] });
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    }
  });
}
