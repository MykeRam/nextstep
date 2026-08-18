import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';

import { isSupabaseConfigured, supabase } from '../lib/supabase';

function getRedirectUrl() {
  return new URL(import.meta.env.BASE_URL, window.location.origin).toString();
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function sendMagicLink(email: string) {
    if (!supabase) return 'Cloud sync has not been configured yet.';

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: getRedirectUrl() },
    });

    return error?.message ?? null;
  }

  async function signOut() {
    if (!supabase) return;

    await supabase.auth.signOut();
  }

  return { isConfigured: isSupabaseConfigured, loading, sendMagicLink, signOut, user };
}
