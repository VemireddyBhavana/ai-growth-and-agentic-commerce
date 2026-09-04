'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  ArrowRight,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  LogIn,
} from 'lucide-react';
import { Button } from '@ai-sales-assistant/ui';
import {
  AuthPageShell,
  AuthHeader,
  AuthCard,
  BackLink,
  authShellChildVariants,
  FormRoot,
  FieldControl,
  FieldMessage,
  Input,
  Label,
  useZodForm,
} from '@/components/auth/primitives';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';
import { useSupabase } from '@/lib/auth/supabase/client';
import { emailSchema } from '@/lib/auth/validation/schemas';
import { z } from 'zod';

type VerifyState =
  | { kind: 'idle' }
  | { kind: 'verifying' }
  | { kind: 'verified' }
  | { kind: 'error'; message: string };

const verifyResendSchema = z.object({ email: emailSchema });

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') ?? '';

  const [state, setState] = React.useState<VerifyState>({ kind: 'idle' });

  const { supabase } = useSupabase();
  const auth = useAuthActions();

  const form = useZodForm(verifyResendSchema, {
    defaultValues: { email: initialEmail },
  });
  const emailValue = form.watch('email') || initialEmail;
  const isBusy = auth.isSubmitting || state.kind === 'verifying';

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      const accessToken = searchParams.get('access_token');
      const type = searchParams.get('type');
      if (accessToken && type === 'signup') {
        setState({ kind: 'verifying' });
        const { error } = await supabase.auth.verifyOtp({
          token_hash: accessToken,
          type: 'signup',
        });
        if (cancelled) return;
        if (error) {
          setState({ kind: 'error', message: error.message ?? 'Verification failed.' });
        } else {
          setState({ kind: 'verified' });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [searchParams, supabase]);

  const onResend = form.handleSubmit(async (values) => {
    await auth.resendVerificationEmail(values.email);
  });

  return (
    <AuthPageShell>
      <BackLink href="/login" label="Back to sign in" />

      <AuthHeader
        eyebrow={{ label: 'Email Verification', tone: 'emerald' }}
        title={
          state.kind === 'verified'
            ? 'Email verified!'
            : 'Verify your email address'
        }
        subtitle={
          state.kind === 'verified'
            ? 'Your email is confirmed. You now have full access to the merchant dashboard and AI Sales Assistant.'
            : 'We’ve sent a 6-digit magic link to your email. Click it to confirm your account and start onboarding.'
        }
      />

      <AuthCard
        footerSlot={
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              {emailValue
                ? `Check inbox for ${emailValue}`
                : 'Enter your email to receive a verification link'}
            </span>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline group"
            >
              Go to Dashboard
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        }
      >
        {state.kind === 'verified' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center text-center gap-3 py-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl bg-ai-emerald/40 blur-md animate-pulse" />
              <div className="relative w-16 h-16 rounded-2xl bg-ai-emerald/15 dark:bg-ai-emerald/25 border border-ai-emerald/40 flex items-center justify-center text-ai-emerald">
                <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                All set! Your email is verified
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                You can now create your first merchant workspace, explore the AI assistant, and
                start driving revenue with explainable AI commerce.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-2 w-full">
              <Button
                type="button"
                variant="outline"
                size="lg"
                asChild
                className="h-11 rounded-xl flex-1 text-sm font-semibold"
              >
                <Link href="/login">
                  <LogIn className="w-4 h-4" strokeWidth={2} />
                  Go to Sign In
                </Link>
              </Button>
              <Button
                type="button"
                variant="default"
                size="lg"
                asChild
                className="h-11 rounded-xl flex-1 text-sm font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
              >
                <Link href="/dashboard">
                  Open Merchant Dashboard
                  <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                </Link>
              </Button>
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
                  Unable to verify
                </h3>
                <p className="mt-1 text-[13px] text-red-700 dark:text-red-400 leading-relaxed break-words">
                  {state.message}
                </p>
                <p className="mt-2 text-[12px] text-muted-foreground leading-relaxed">
                  Verification links expire after a short time. Request a new link below.
                </p>
              </div>
            </div>

            <FormRoot form={form} onSubmit={onResend}>
              <FieldControl
                control={form.control}
                name="email"
                render={({ field, fieldState, invalid }) => (
                  <div>
                    <Label htmlFor="verify-resend-email" required>
                      Your Email
                    </Label>
                    <Input
                      id="verify-resend-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@merchant.com"
                      invalid={invalid}
                      prefixIcon={<Mail className="w-[18px] h-[18px]" strokeWidth={2} />}
                      disabled={isBusy}
                      {...field}
                    />
                    <FieldMessage>{fieldState.error?.message}</FieldMessage>
                  </div>
                )}
              />

              <motion.div variants={authShellChildVariants}>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
                  disabled={isBusy}
                >
                  {auth.submitting === 'resend' ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        strokeWidth={2.2}
                        aria-hidden
                      />
                      Sending new link…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Resend Verification Email
                      <Send className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                  )}
                </Button>
              </motion.div>
            </FormRoot>
          </motion.div>
        ) : state.kind === 'verifying' ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center text-center gap-4 py-10"
          >
            <div className="relative w-16 h-16 rounded-2xl bg-ai-violet/15 dark:bg-ai-violet/25 border border-ai-violet/40 flex items-center justify-center text-ai-violet">
              <Loader2
                className="w-8 h-8 animate-spin"
                strokeWidth={2}
                aria-hidden
              />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground">
                Verifying your email…
              </h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Give us a moment while we confirm your email address.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 py-2"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-ai-violet/40 blur-md animate-pulse opacity-70" />
                <div className="relative w-16 h-16 rounded-2xl bg-ai-violet/15 dark:bg-ai-violet/25 border border-ai-violet/40 flex items-center justify-center text-ai-violet">
                  <Mail className="w-8 h-8" strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  Confirm your inbox
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Click the verification link sent to{' '}
                  {emailValue ? (
                    <span className="font-semibold text-foreground">{emailValue}</span>
                  ) : (
                    'your email address'
                  )}{' '}
                  to activate your account.
                </p>
              </div>
            </div>

            <ul className="space-y-2 rounded-2xl border border-border/60 bg-secondary/30 dark:bg-obsidian-950/40 p-4 text-[12.5px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-ai-cyan shrink-0" />
                The link will expire 24 hours after it was sent.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-ai-violet shrink-0" />
                Check your spam or promotions folder if it isn’t in your inbox.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                Use the same browser — verification cookies are saved automatically.
              </li>
            </ul>

            <FormRoot form={form} onSubmit={onResend}>
              <FieldControl
                control={form.control}
                name="email"
                render={({ field, fieldState, invalid }) => (
                  <div>
                    <Label htmlFor="verify-manual-email" required>
                      Email Address
                    </Label>
                    <Input
                      id="verify-manual-email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@merchant.com"
                      invalid={invalid}
                      prefixIcon={<Mail className="w-[18px] h-[18px]" strokeWidth={2} />}
                      disabled={isBusy}
                      {...field}
                    />
                    <FieldMessage>{fieldState.error?.message}</FieldMessage>
                  </div>
                )}
              />
              <motion.div variants={authShellChildVariants}>
                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  className="w-full h-11 text-sm font-semibold rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
                  disabled={isBusy}
                >
                  {auth.submitting === 'resend' ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2
                        className="w-4 h-4 animate-spin"
                        strokeWidth={2.2}
                        aria-hidden
                      />
                      Sending…
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      Resend Verification
                      <Send className="w-4 h-4" strokeWidth={2.2} />
                    </span>
                  )}
                </Button>
              </motion.div>
            </FormRoot>
          </motion.div>
        )}
      </AuthCard>
    </AuthPageShell>
  );
}

export default function VerifyEmailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-white/50">Loading...</div>}>
      <VerifyEmailContent />
    </React.Suspense>
  );
}
