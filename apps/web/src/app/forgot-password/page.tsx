'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, Send, CheckCircle2 } from 'lucide-react';
import { Button } from '@ai-sales-assistant/ui';
import {
  FormRoot,
  FieldControl,
  FieldMessage,
  Input,
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
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/lib/auth/validation/schemas';

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState<{ email: string } | null>(null);
  const form = useZodForm(forgotPasswordSchema, { defaultValues: { email: '' } });
  const auth = useAuthActions();
  const isBusy = auth.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: ForgotPasswordFormValues) => {
    const ok = await auth.forgotPassword(values);
    if (ok) setSent({ email: values.email });
  });

  return (
    <AuthPageShell>
      <BackLink href="/login" label="Back to sign in" />

      <AuthHeader
        eyebrow={{ label: 'Account Recovery', tone: 'cyan' }}
        title="Reset your password"
        subtitle={
          sent
            ? `We’ve sent a password reset link to ${sent.email}. Follow the link to choose a new password.`
            : 'Enter your email and we’ll send you a secure link to reset your password.'
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
        {sent ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-5 py-2"
          >
            <div className="flex flex-col items-center text-center gap-3">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-ai-emerald/40 blur-md animate-pulse" />
                <div className="relative w-16 h-16 rounded-2xl bg-ai-emerald/15 dark:bg-ai-emerald/25 border border-ai-emerald/40 flex items-center justify-center text-ai-emerald">
                  <CheckCircle2 className="w-8 h-8" strokeWidth={2.2} />
                </div>
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground">
                  Check your inbox
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  If there is an account associated with{' '}
                  <span className="font-semibold text-foreground">{sent.email}</span>, you will
                  receive a password reset link shortly.
                </p>
              </div>
            </div>

            <ul className="space-y-2 rounded-2xl border border-border/60 bg-secondary/30 dark:bg-obsidian-950/40 p-4 text-[12.5px] text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-ai-emerald shrink-0" />
                Links expire after 60 minutes and can only be used once.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 inline-block h-1.5 w-1.5 rounded-full bg-ai-violet shrink-0" />
                Can’t find the email? Check Spam, Promotions, or search for “AI Sales Assistant”.
              </li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-11 rounded-xl flex-1 text-sm font-semibold"
                onClick={() => {
                  setSent(null);
                  form.reset();
                }}
                disabled={isBusy}
              >
                Use a different email
              </Button>
              <Button
                type="button"
                variant="default"
                size="lg"
                className="h-11 rounded-xl flex-1 text-sm font-semibold bg-gradient-to-r from-brand-600 via-brand-500 to-ai-violet hover:from-brand-600 hover:via-brand-500 hover:to-ai-violet shadow-lg shadow-brand-500/25"
                onClick={onSubmit}
                disabled={isBusy}
              >
                {auth.submitting === 'forgot' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce" />
                    </span>
                    Resending…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Resend link
                    <Send className="w-4 h-4" strokeWidth={2.2} />
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        ) : (
          <FormRoot form={form} onSubmit={onSubmit}>
            <FieldControl
              control={form.control}
              name="email"
              render={({ field, fieldState, invalid }) => (
                <div>
                  <Label htmlFor="forgot-email" required>
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@merchant.com"
                    invalid={invalid}
                    prefixIcon={<Mail className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
                    disabled={isBusy}
                    {...field}
                  />
                  <FieldMessage type="hint">
                    We’ll never share your email with third parties.
                  </FieldMessage>
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
                {auth.submitting === 'forgot' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="inline-flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce" />
                    </span>
                    Sending reset link…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Send Reset Link
                    <ArrowRight className="w-4 h-4" strokeWidth={2.2} />
                  </span>
                )}
              </Button>
            </motion.div>
          </FormRoot>
        )}
      </AuthCard>

      <motion.p
        variants={authShellChildVariants}
        className="text-[12px] text-muted-foreground/80 text-center max-w-md"
      >
        Need help? Contact our support team at{' '}
        <Link
          href="mailto:support@ai-sales-assistant.io"
          className="text-foreground font-medium hover:underline"
        >
          support@ai-sales-assistant.io
        </Link>
        .
      </motion.p>
    </AuthPageShell>
  );
}
