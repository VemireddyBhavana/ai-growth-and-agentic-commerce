'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowLeft, ArrowRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Button } from '@ai-sales-assistant/ui';
import {
  FormRoot,
  FieldControl,
  FieldMessage,
  PasswordInput,
  Label,
  useZodForm,
  AuthPageShell,
  AuthHeader,
  AuthCard,
  BackLink,
  authShellChildVariants,
} from '@/components/auth/primitives';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/lib/auth/validation/schemas';

type ResetState =
  | { kind: 'idle' }
  | { kind: 'done' }
  | { kind: 'error'; message: string };

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const hasCode = searchParams.has('code') || true;

  const [state, setState] = React.useState<ResetState>({ kind: 'idle' });

  const form = useZodForm(resetPasswordSchema, {
    defaultValues: { password: '', confirmPassword: '' },
  });
  const auth = useAuthActions();
  const isBusy = auth.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: ResetPasswordFormValues) => {
    const ok = await auth.resetPassword(values);
    if (ok) {
      setState({ kind: 'done' });
      setTimeout(() => {
        router.replace('/login');
      }, 2200);
    }
  });

  return (
    <AuthPageShell>
      <BackLink href="/login" label="Back to sign in" />

      <AuthHeader
        eyebrow={{ label: 'Set New Password', tone: 'cyan' }}
        title="Choose a new password"
        subtitle={
          state.kind === 'done'
            ? 'Your password has been updated. Redirecting you to sign in…'
            : 'Create a strong, unique password to secure your AI Sales Assistant workspace.'
        }
      />

      <AuthCard
        footerSlot={
          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>Remembered your password?</span>
            <Link
              href="/login"
              className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              Sign in
            </Link>
          </div>
        }
      >
        {!hasCode ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-5 py-2"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="p-2 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 shrink-0">
                <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-foreground">
                  Invalid or expired link
                </h3>
                <p className="mt-1 text-[13px] text-muted-foreground leading-relaxed">
                  This password reset link is missing or has already been used. Please request a
                  new one.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="mt-4 h-10 rounded-xl text-sm font-semibold w-full"
                  onClick={() => router.replace('/forgot-password')}
                >
                  Request new reset link
                </Button>
              </div>
            </div>
          </motion.div>
        ) : state.kind === 'done' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center gap-3 py-8"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-ai-emerald/40 blur-md animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-ai-emerald/15 dark:bg-ai-emerald/25 border border-ai-emerald/40 flex items-center justify-center text-ai-emerald">
                <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                Password updated
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                You can now sign in with your new password.
              </p>
            </div>
          </motion.div>
        ) : state.kind === 'error' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="space-y-5 py-2"
          >
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 p-4">
              <div className="p-2 rounded-xl bg-red-500/15 text-red-600 dark:text-red-400 shrink-0">
                <AlertTriangle className="w-5 h-5" strokeWidth={2.2} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="font-heading font-semibold text-foreground">
                  Something went wrong
                </h3>
                <p className="mt-1 text-[13px] text-red-700 dark:text-red-400 leading-relaxed break-words">
                  {state.message}
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          <FormRoot form={form} onSubmit={onSubmit}>
            <FieldControl
              control={form.control}
              name="password"
              render={({ field, fieldState, invalid }) => (
                <div>
                  <Label htmlFor="reset-password" required>
                    New Password
                  </Label>
                  <PasswordInput
                    id="reset-password"
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                    invalid={invalid}
                    prefixIcon={<Lock className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
                    disabled={isBusy}
                    {...field}
                  />
                  <FieldMessage type="hint">
                    Must be at least 8 characters with uppercase, lowercase, number, and symbol.
                  </FieldMessage>
                  <FieldMessage>{fieldState.error?.message}</FieldMessage>
                </div>
              )}
            />

            <FieldControl
              control={form.control}
              name="confirmPassword"
              render={({ field, fieldState, invalid }) => (
                <div>
                  <Label htmlFor="reset-confirm" required>
                    Confirm New Password
                  </Label>
                  <PasswordInput
                    id="reset-confirm"
                    placeholder="Re-enter your new password"
                    autoComplete="new-password"
                    invalid={invalid}
                    prefixIcon={<Lock className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
                    disabled={isBusy}
                    {...field}
                  />
                  <FieldMessage>{fieldState.error?.message}</FieldMessage>
                </div>
              )}
            />

            <motion.div variants={authShellChildVariants} className="pt-1.5">
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isBusy}
                className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
              >
                {auth.submitting === 'reset' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce" />
                    </span>
                    Updating password…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Update Password
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </span>
                )}
              </Button>
            </motion.div>
          </FormRoot>
        )}
      </AuthCard>
    </AuthPageShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-white/50">Loading...</div>}>
      <ResetPasswordContent />
    </React.Suspense>
  );
}
