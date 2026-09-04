'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { useSupabase } from '@/lib/auth/supabase/client';
import type { AuthError, Provider, AuthOtpResponse } from '@supabase/supabase-js';
import type {
  LoginFormValues,
  RegisterFormValues,
  ForgotPasswordFormValues,
  ResetPasswordFormValues,
} from '@/lib/auth/validation/schemas';

type AuthProvider = Extract<Provider, 'google' | 'github'>;

interface UseAuthActionsOptions {
  redirect?: string;
}

function parseAuthError(error: unknown): { message: string; code?: string } {
  if (!error) return { message: 'An unexpected error occurred' };
  if (typeof error === 'string') return { message: error };
  const err = error as AuthError & { code?: string };
  const code = err.code ?? undefined;
  switch (code) {
    case 'invalid_credentials':
      return { message: 'Invalid email or password', code };
    case 'email_not_confirmed':
      return {
        message: 'Please verify your email before signing in',
        code,
      };
    case 'user_already_registered':
      return {
        message: 'An account with this email already exists. Try signing in.',
        code,
      };
    case 'weak_password':
      return {
        message: err.message ?? 'Password is too weak. Please use a stronger password.',
        code,
      };
    case 'over_email_send_rate_limit':
      return {
        message: 'Too many attempts. Please wait a moment before trying again.',
        code,
      };
    case 'otp_expired':
      return { message: 'Verification link has expired. Please request a new one.', code };
    case 'same_password':
      return {
        message: 'New password must be different from your current password.',
        code,
      };
    case 'reauth_needed':
      return { message: 'Please sign in again to continue.', code };
    default:
      return { message: err.message ?? 'Authentication failed. Please try again.', code };
  }
}

function buildOrigin(): string {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export function useAuthActions(options?: UseAuthActionsOptions) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = options?.redirect ?? searchParams.get('redirect') ?? '/dashboard';
  const [submitting, setSubmitting] = React.useState<
    false | 'login' | 'register' | 'forgot' | 'reset' | 'resend' | 'logout' | 'google' | 'github'
  >(false);

  const safeRedirect = React.useCallback(
    (path?: string) => {
      const target = path ?? redirectTo;
      if (!target) {
        router.push('/dashboard');
        return;
      }
      router.push(target);
    },
    [redirectTo, router],
  );

  const signInWithPassword = React.useCallback(
    async (values: LoginFormValues): Promise<boolean> => {
      if (submitting) return false;
      setSubmitting('login');
      const toastId = toast.loading('Signing you in…');
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
        if (error) throw error;
        toast.success('Welcome back!', {
          id: toastId,
          description: data.user?.email
            ? `Signed in as ${data.user.email}`
            : 'Authenticated successfully',
        });
        const next =
          values.rememberMe === false && data.session?.refresh_token
            ? '/dashboard' // remember me false handled by session TTL on server
            : redirectTo;
        router.refresh();
        safeRedirect(next);
        return true;
      } catch (err) {
        const { message, code } = parseAuthError(err);
        toast.error(message, { id: toastId });
        if (code === 'email_not_confirmed') {
          toast.message('Verify your email', {
            description: 'Click Resend Verification if you need a new link.',
          });
        }
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, supabase, redirectTo, router, safeRedirect],
  );

  const signInWithOAuth = React.useCallback(
    async (provider: AuthProvider): Promise<void> => {
      if (submitting) return;
      setSubmitting(provider);
      const toastId = toast.loading(
        provider === 'google' ? 'Connecting to Google…' : 'Connecting to GitHub…',
      );
      try {
        const origin = buildOrigin();
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
            scopes: provider === 'github' ? 'read:user user:email' : 'openid email profile',
            queryParams:
              provider === 'google'
                ? { access_type: 'offline', prompt: 'select_account' }
                : undefined,
          },
        });
        if (error) throw error;
      } catch (err) {
        const { message } = parseAuthError(err);
        toast.error(message, { id: toastId });
        setSubmitting(false);
      }
    },
    [submitting, supabase, redirectTo],
  );

  const signUp = React.useCallback(
    async (values: RegisterFormValues): Promise<boolean> => {
      if (submitting) return false;
      setSubmitting('register');
      const toastId = toast.loading('Creating your account…');
      try {
        const origin = buildOrigin();
        const { data, error } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name,
            },
            emailRedirectTo: `${origin}/verify-email`,
          },
        });
        if (error) throw error;
        if (data.session) {
          toast.success('Account created', {
            id: toastId,
            description: `Welcome, ${values.name}!`,
          });
          router.refresh();
          safeRedirect();
          return true;
        }
        toast.success('Check your inbox', {
          id: toastId,
          description: `We sent a verification link to ${values.email}.`,
        });
        const next = new URL('/verify-email', buildOrigin());
        next.searchParams.set('email', values.email);
        router.replace(next.toString().replace(buildOrigin(), ''));
        return true;
      } catch (err) {
        const { message } = parseAuthError(err);
        toast.error(message, { id: toastId });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, supabase, router, safeRedirect],
  );

  const forgotPassword = React.useCallback(
    async (values: ForgotPasswordFormValues): Promise<boolean> => {
      if (submitting) return false;
      setSubmitting('forgot');
      const toastId = toast.loading('Sending reset link…');
      try {
        const origin = buildOrigin();
        const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
          redirectTo: `${origin}/reset-password`,
        });
        if (error) throw error;
        toast.success('Reset link sent', {
          id: toastId,
          description: `If ${values.email} exists in our system, you’ll receive a reset link shortly.`,
        });
        return true;
      } catch (err) {
        const { message } = parseAuthError(err);
        toast.error(message, { id: toastId });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, supabase],
  );

  const resetPassword = React.useCallback(
    async (values: ResetPasswordFormValues): Promise<boolean> => {
      if (submitting) return false;
      setSubmitting('reset');
      const toastId = toast.loading('Updating your password…');
      try {
        const { error } = await supabase.auth.updateUser({
          password: values.password,
        });
        if (error) throw error;
        toast.success('Password updated', {
          id: toastId,
          description: 'You can now sign in with your new password.',
        });
        safeRedirect('/login');
        return true;
      } catch (err) {
        const { message } = parseAuthError(err);
        toast.error(message, { id: toastId });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, supabase, safeRedirect],
  );

  const resendVerificationEmail = React.useCallback(
    async (email: string): Promise<boolean> => {
      if (submitting) return false;
      setSubmitting('resend');
      const toastId = toast.loading('Resending verification email…');
      try {
        const origin = buildOrigin();
        const { error } = (await supabase.auth.signInWithOtp({
          email,
          options: {
            shouldCreateUser: false,
            emailRedirectTo: `${origin}/verify-email`,
          },
        })) as AuthOtpResponse;
        if (error) throw error;
        toast.success('Email resent', {
          id: toastId,
          description: `A new verification link has been sent to ${email}.`,
        });
        return true;
      } catch (err) {
        const { message } = parseAuthError(err);
        toast.error(message, { id: toastId });
        return false;
      } finally {
        setSubmitting(false);
      }
    },
    [submitting, supabase],
  );

  const signOut = React.useCallback(async (): Promise<void> => {
    setSubmitting('logout');
    const toastId = toast.loading('Signing you out…');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Signed out', { id: toastId });
      router.refresh();
      router.push('/login');
    } catch (err) {
      const { message } = parseAuthError(err);
      toast.error(message, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  }, [supabase, router]);

  return {
    submitting,
    isSubmitting: submitting !== false,
    signInWithPassword,
    signInWithOAuth,
    signUp,
    forgotPassword,
    resetPassword,
    resendVerificationEmail,
    signOut,
    redirectTo,
  };
}
