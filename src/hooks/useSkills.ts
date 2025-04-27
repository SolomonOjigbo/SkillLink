/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';
// import { typedSelect } from '../types/supabase.helpers';
// import { typedSelect } from '../lib/supabaseClient';
import { supabase } from '../lib/supabaseClient';

export function useUserSkills(userId: string) {
  const [skills, setSkills] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('skills')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSkills(data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch skills');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) fetchSkills();
  }, [userId]);

  return { data: skills, isLoading, error };
}
