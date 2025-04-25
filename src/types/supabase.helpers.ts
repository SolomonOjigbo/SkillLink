import { Database } from './database';

// Extract table row types
export type Tables = Database['public']['Tables'];
export type TableName = keyof Tables;

// Type for a single row
export type TableRow<T extends TableName> = Tables[T]['Row'];

// Type for insert payload
export type InsertDto<T extends TableName> = Tables[T]['Insert'];

// Type for update payload
export type UpdateDto<T extends TableName> = Tables[T]['Update'];
