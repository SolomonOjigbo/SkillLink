// types/supabase.ts

import { Database } from "./database"


type Tables = Database['public']['Tables']

export type Profile = Tables['profiles']['Row']
