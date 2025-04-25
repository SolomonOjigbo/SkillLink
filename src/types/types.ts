// In your database.ts or types file
type AuthUser = {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  // Other auth fields
};

type Profile = {
  id: string;
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
  full_name: string | null;
  location: string | null;
  created_at: string | null;
  updated_at: string | null;
};

export type CompleteUser = AuthUser & { profile: Profile };
