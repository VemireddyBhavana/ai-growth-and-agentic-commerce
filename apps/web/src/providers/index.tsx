'use client';

import * as React from 'react';
import { ThemeProvider } from './theme-provider';
import { QueryProvider } from './query-provider';
import { ToastProvider } from './toast-provider';
import { SupabaseProvider } from '@/lib/auth/supabase/client';
import type { AuthSession } from '@supabase/supabase-js';

interface AppProvidersProps {
  children: React.ReactNode;
  initialSession?: AuthSession | null;
}

export function AppProviders({ children, initialSession = null }: AppProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SupabaseProvider session={initialSession}>
        <QueryProvider>
          {children}
          <ToastProvider />
        </QueryProvider>
      </SupabaseProvider>
    </ThemeProvider>
  );
}
