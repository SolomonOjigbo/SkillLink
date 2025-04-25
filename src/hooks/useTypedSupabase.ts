/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, UseQueryOptions } from '@tanstack/react-query';
import { supabase } from '../lib/supabaseClient';
import { TableName, TableRow } from '../types/supabase.helpers';

export function useSupabaseQuery<T extends TableName>(
  table: T,
  options?: UseQueryOptions<TableRow<T>[], Error>
) {
  return useQuery<TableRow<T>[], Error>({
    queryKey: [table],
    queryFn: async () => {
      const { data, error } = await supabase.from(table).select('*');

      if (error) throw error;
      return data as unknown as TableRow<T>[];
    },
    ...options
  });
}

export function useInsertMutation<T extends TableName>(table: T) {
  return useMutation({
    mutationFn: async (item: TableRow<T>) => {
      const { data, error } = await supabase
        .from(table)
        .insert(item as any)
        .select();

      if (error) throw error;
      return data[0] as unknown as TableRow<T>;
    }
  });
}
