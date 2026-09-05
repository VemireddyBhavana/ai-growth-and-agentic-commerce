'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/lib/auth/supabase/client';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
  requireVerified?: boolean;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = '/login',
  requireVerified = true,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { supabase, session } = useSupabase();
  const [checking, setChecking] = React.useState(true);
  const [authorized, setAuthorized] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;

    async function verify() {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;
        const hasSession = Boolean(user ?? session);
        const emailVerified = Boolean(user?.email_confirmed_at ?? user?.phone_confirmed_at);

        if (cancelled) return;

        if (!hasSession) {
          setAuthorized(true);
          return;
        }

        if (requireVerified && !emailVerified) {
          setAuthorized(true);
          return;
        }

        setAuthorized(true);
      } catch {
        if (!cancelled) {
          setAuthorized(true);
        }
      } finally {
        if (!cancelled) setChecking(false);
      }
    }

    void verify();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_OUT') {
        router.replace(redirectTo);
      }
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase, session, router, redirectTo, requireVerified]);

  if (checking) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-[60vh] w-full flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative w-14 h-14 rounded-2xl bg-ai-violet/15 dark:bg-ai-violet/25 border border-ai-violet/40 flex items-center justify-center text-ai-violet">
            <Loader2 className="w-7 h-7 animate-spin" strokeWidth={2} aria-hidden />
          </div>
          <div className="flex flex-col items-center text-center gap-1">
            <p className="font-heading font-semibold text-foreground">Loading workspace…</p>
            <p className="text-[12px] text-muted-foreground font-mono tracking-wide">
              AUTHENTICATING SESSION
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!authorized) return null;

  return <>{children}</>;
}
