'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '@ai-sales-assistant/ui';
import {
  FormRoot,
  FieldControl,
  FieldMessage,
  Input,
  PasswordInput,
  Label,
  Checkbox,
  useZodForm,
  AuthPageShell,
  AuthHeader,
  AuthCard,
  authShellChildVariants,
  SocialButtons,
  SocialDivider,
} from '@/components/auth/primitives';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';
import {
  loginSchema,
  type LoginFormValues,
} from '@/lib/auth/validation/schemas';

function LoginContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const emailParam = searchParams.get('email') ?? undefined;

  const form = useZodForm(loginSchema, {
    defaultValues: {
      email: emailParam ?? '',
      password: '',
      rememberMe: true,
    },
  });

  const auth = useAuthActions();
  const oauthLoading =
    auth.submitting === 'google' || auth.submitting === 'github' ? auth.submitting : null;
  const isBusy = auth.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: LoginFormValues) => {
    await auth.signInWithPassword(values);
  });

  return (
    <AuthPageShell>
      <AuthHeader
        eyebrow={{ label: 'Welcome Back', tone: 'violet' }}
        title="Sign in to your account"
        subtitle="Access your merchant dashboard, AI sales assistant, and explainable revenue telemetry."
      />

      <AuthCard
        footerSlot={
          <div className="flex items-center justify-center text-sm text-muted-foreground">
            <span>Don&apos;t have an account?&nbsp;</span>
            <Link
              href="/register"
              className="font-semibold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1 group"
            >
              Create an account
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        }
      >
        {reason === 'session-expired' ? (
          <motion.div
            variants={authShellChildVariants}
            className="mb-5 inline-flex w-full items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-3 text-[13px] text-amber-700 dark:text-amber-400"
          >
            <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-amber-500 animate-pulse" />
            Your session expired. Please sign in again to continue.
          </motion.div>
        ) : null}

        <SocialButtons
          onGoogle={() => auth.signInWithOAuth('google')}
          onGitHub={() => auth.signInWithOAuth('github')}
          loadingProvider={oauthLoading}
        />

        <SocialDivider label="Or sign in with email" />

        <FormRoot form={form} onSubmit={onSubmit}>
          <FieldControl
            control={form.control}
            name="email"
            render={({ field, fieldState, invalid }) => (
              <div>
                <Label htmlFor="login-email" required>
                  Email
                </Label>
                <Input
                  id="login-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@merchant.com"
                  invalid={invalid}
                  prefixIcon={
                    <Mail className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
                  }
                  disabled={isBusy}
                  {...field}
                />
                <FieldMessage>{fieldState.error?.message}</FieldMessage>
              </div>
            )}
          />

          <FieldControl
            control={form.control}
            name="password"
            render={({ field, fieldState, invalid }) => (
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="login-password" required>
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-[11.5px] font-medium text-brand-600 dark:text-brand-400 hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <PasswordInput
                  id="login-password"
                  placeholder="Enter your password"
                  invalid={invalid}
                  prefixIcon={
                    <Lock className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />
                  }
                  disabled={isBusy}
                  {...field}
                />
                <FieldMessage>{fieldState.error?.message}</FieldMessage>
              </div>
            )}
          />

          <FieldControl
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                id="login-remember"
                label="Remember me on this device for 30 days"
                disabled={isBusy}
                checked={field.value ?? false}
                onCheckedChange={(v) => field.onChange(v)}
                onBlur={field.onBlur}
                name={field.name}
              />
            )}
          />

          <motion.div
            variants={authShellChildVariants}
            className="pt-1.5"
          >
            <Button
              type="submit"
              variant="default"
              size="lg"
              disabled={isBusy}
              className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
            >
              {auth.submitting === 'login' ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce" />
                  </span>
                  Signing you in…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Sign In
                  <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                </span>
              )}
            </Button>
          </motion.div>
        </FormRoot>
      </AuthCard>

      <motion.p
        variants={authShellChildVariants}
        className="text-[12px] text-muted-foreground/80 text-center max-w-md"
      >
        Protected by Supabase Authentication · Your data is encrypted in transit and at rest.
      </motion.p>
    </AuthPageShell>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-white/50">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}
