'use client';

import { createBrowserClient } from '@supabase/ssr';
import * as React from 'react';
import type { SupabaseClient, AuthSession } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

type SupabaseBrowserClient = SupabaseClient<any, 'public', any>;

let singletonClient: SupabaseBrowserClient | undefined;

export function createSupabaseBrowserClient(): SupabaseBrowserClient {
  if (!singletonClient) {
    singletonClient = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    });
  }
  return singletonClient;
}

type SupabaseContext = {
  supabase: SupabaseBrowserClient;
  session: AuthSession | null;
};

const AuthContext = React.createContext<SupabaseContext | undefined>(undefined);

export interface SupabaseProviderProps {
  children: React.ReactNode;
  session: AuthSession | null;
}

export function SupabaseProvider({ children, session }: SupabaseProviderProps) {
  const [supabase] = React.useState(() => createSupabaseBrowserClient());

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, _newSession: unknown) => {});
    return () => subscription.unsubscribe();
  }, [supabase]);

  const value = React.useMemo<SupabaseContext>(
    () => ({ supabase, session }),
    [supabase, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useSupabase(): SupabaseContext {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useSupabase must be used within a <SupabaseProvider>');
  }
  return context;
}
