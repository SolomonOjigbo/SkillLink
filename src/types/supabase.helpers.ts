/* eslint-disable @typescript-eslint/no-explicit-any */
import { Database } from './database';
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;
export type TableRow<T extends TableName> = Tables[T]['Row'];
export type InsertDto<T extends TableName> = Tables[T]['Insert'];
export type UpdateDto<T extends TableName> = Tables[T]['Update'];

// Enhanced response handler with proper typing
export function handleSupabaseResponse<T>({
  data,
  error
}: {
  data: T | null;
  error: PostgrestError | null;
}): T {
  if (error) {
    console.error('Supabase error:', error);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error('No data returned from query');
  }
  return data;
}

// Type-safe select query builder (fixed version)
export function typedSelect<T extends TableName>(table: T) {
  return {
    async select<C extends (keyof TableRow<T>)[] | '*' = '*'>(
      columns?: C | string
    ): Promise<
      C extends '*'
        ? TableRow<T>[]
        : C extends (infer K)[]
        ? Pick<TableRow<T>, K & keyof TableRow<T>>[]
        : never
    > {
      const { data, error } = await supabase
        .from(table)
        .select(Array.isArray(columns) ? columns.join(',') : columns);

      return handleSupabaseResponse({
        data: data as any, // Necessary type assertion
        error
      });
    },

    async single<C extends (keyof TableRow<T>)[] | '*' = '*'>(
      columns?: C | string
    ): Promise<
      C extends '*'
        ? TableRow<T>
        : C extends (infer K)[]
        ? Pick<TableRow<T>, K & keyof TableRow<T>>
        : never
    > {
      const { data, error } = await supabase
        .from(table)
        .select(columns)
        .single();

      return handleSupabaseResponse({
        data: data as any, // Necessary type assertion
        error
      });
    }
  };
}

// Fixed CRUD operations with proper typing
export const supabaseHelpers = {
  async getById<T extends TableName>(
    table: T,
    id: string | number
  ): Promise<TableRow<T>> {
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('id', id)
      .single();
    return handleSupabaseResponse({ data, error });
  },

  async insert<T extends TableName>(
    table: T,
    item: InsertDto<T>
  ): Promise<TableRow<T>> {
    const { data, error } = await supabase
      .from(table)
      .insert(item)
      .select()
      .single();
    return handleSupabaseResponse({ data, error });
  },

  async update<T extends TableName>(
    table: T,
    id: string | number,
    updates: UpdateDto<T>
  ): Promise<TableRow<T>> {
    const { data, error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return handleSupabaseResponse({ data, error });
  },

  async delete<T extends TableName>(
    table: T,
    id: TableRow<T>['id']
  ): Promise<void> {
    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) {
      throw new Error(error.message);
    }
  }
};
