'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, Mail, Lock, ArrowRight, CheckCheck } from 'lucide-react';
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
  BackLink,
  authShellChildVariants,
  SocialButtons,
  SocialDivider,
} from '@/components/auth/primitives';
import { useAuthActions } from '@/lib/auth/hooks/use-auth-actions';
import {
  registerSchema,
  type RegisterFormValues,
  strongPasswordSchema,
} from '@/lib/auth/validation/schemas';

type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  checks: { label: string; ok: boolean }[];
};

function evaluatePassword(pw: string): PasswordStrength {
  const checks: PasswordStrength['checks'] = [
    { label: 'At least 8 characters', ok: pw.length >= 8 },
    { label: 'Uppercase letter', ok: /[A-Z]/.test(pw) },
    { label: 'Lowercase letter', ok: /[a-z]/.test(pw) },
    { label: 'Number', ok: /[0-9]/.test(pw) },
    { label: 'Special character (!@#$%^&*)', ok: /[^A-Za-z0-9]/.test(pw) },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const score = (passed === 0 ? 0 : passed < 2 ? 1 : passed < 3 ? 2 : passed < 4 ? 3 : 4) as
    | 0
    | 1
    | 2
    | 3
    | 4;
  const map: Record<PasswordStrength['score'], { label: string; color: string }> = {
    0: { label: 'Enter a password', color: 'from-muted-foreground/40 to-muted-foreground/40' },
    1: { label: 'Weak', color: 'from-red-500 to-red-500/70' },
    2: { label: 'Fair', color: 'from-amber-500 to-amber-500/70' },
    3: { label: 'Good', color: 'from-brand-500 to-brand-500/70' },
    4: { label: 'Strong', color: 'from-ai-emerald to-ai-emerald/70' },
  };
  return { score, label: map[score].label, color: map[score].color, checks };
}

function RegisterContent() {
  const form = useZodForm(registerSchema, {
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false,
    },
  });

  const passwordValue = form.watch('password');
  const strength = React.useMemo(() => evaluatePassword(passwordValue), [passwordValue]);

  const auth = useAuthActions();
  const oauthLoading =
    auth.submitting === 'google' || auth.submitting === 'github' ? auth.submitting : null;
  const isBusy = auth.isSubmitting;

  const onSubmit = form.handleSubmit(async (values: RegisterFormValues) => {
    try {
      strongPasswordSchema.parse(values.password);
    } catch (e) {
      return;
    }
    await auth.signUp(values);
  });

  return (
    <AuthPageShell>
      <BackLink href="/login" label="Already have an account? Sign in" />

      <AuthHeader
        eyebrow={{ label: 'Create Account', tone: 'brand' }}
        title="Start growing merchant revenue today"
        subtitle="Create your AI Sales Assistant workspace in under 60 seconds. No credit card required."
      />

      <AuthCard
        footerSlot={
          <div className="flex items-start gap-2 text-[12px] text-muted-foreground">
            <CheckCheck className="w-4 h-4 mt-0.5 shrink-0 text-ai-emerald" strokeWidth={2.2} />
            <span>
              By creating an account you agree to our{' '}
              <Link
                href="/terms"
                className="font-semibold text-foreground hover:underline underline-offset-2"
              >
                Terms of Service
              </Link>{' '}
              &{' '}
              <Link
                href="/privacy"
                className="font-semibold text-foreground hover:underline underline-offset-2"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </div>
        }
      >
        <SocialButtons
          onGoogle={() => auth.signInWithOAuth('google')}
          onGitHub={() => auth.signInWithOAuth('github')}
          loadingProvider={oauthLoading}
          googleLabel="Sign up with Google"
          githubLabel="Sign up with GitHub"
        />

        <SocialDivider label="Or create with email" />

        <FormRoot form={form} onSubmit={onSubmit}>
          <FieldControl
            control={form.control}
            name="name"
            render={({ field, fieldState, invalid }) => (
              <div>
                <Label htmlFor="register-name" required>
                  Full Name
                </Label>
                <Input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Alex Merchant"
                  invalid={invalid}
                  prefixIcon={<User className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
                  disabled={isBusy}
                  {...field}
                />
                <FieldMessage>{fieldState.error?.message}</FieldMessage>
              </div>
            )}
          />

          <FieldControl
            control={form.control}
            name="email"
            render={({ field, fieldState, invalid }) => (
              <div>
                <Label htmlFor="register-email" required>
                  Work Email
                </Label>
                <Input
                  id="register-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="alex@your-store.com"
                  invalid={invalid}
                  prefixIcon={<Mail className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
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
                <Label htmlFor="register-password" required>
                  Password
                </Label>
                <PasswordInput
                  id="register-password"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  invalid={invalid}
                  prefixIcon={<Lock className="w-[18px] h-[18px]" strokeWidth={2} aria-hidden />}
                  disabled={isBusy}
                  {...field}
                />
                {passwordValue ? (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 h-2 rounded-full bg-border/55 overflow-hidden grid grid-cols-4 gap-1">
                        {[0, 1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`h-full w-full rounded-full transition-all duration-300 ${
                              i < strength.score
                                ? `bg-gradient-to-r ${strength.color}`
                                : 'bg-border/50'
                            }`}
                          />
                        ))}
                      </div>
                      <span
                        className={`text-[10.5px] font-mono font-bold uppercase tracking-[0.16em] ${
                          strength.score >= 3
                            ? 'text-ai-emerald'
                            : strength.score === 2
                              ? 'text-amber-500 dark:text-amber-400'
                              : strength.score === 1
                                ? 'text-red-500 dark:text-red-400'
                                : 'text-muted-foreground'
                        }`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px]">
                      {strength.checks.map((c) => (
                        <li
                          key={c.label}
                          className={`inline-flex items-center gap-1.5 ${
                            c.ok ? 'text-ai-emerald' : 'text-muted-foreground/70'
                          }`}
                        >
                          {c.ok ? (
                            <CheckCheck
                              className="w-3 h-3 shrink-0"
                              strokeWidth={2.5}
                              aria-hidden
                            />
                          ) : (
                            <span className="w-3 h-3 shrink-0 rounded-full border border-current opacity-60 inline-grid place-items-center" />
                          )}
                          {c.label}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                ) : null}
                <FieldMessage>{fieldState.error?.message}</FieldMessage>
              </div>
            )}
          />

          <FieldControl
            control={form.control}
            name="confirmPassword"
            render={({ field, fieldState, invalid }) => (
              <div>
                <Label htmlFor="register-confirm" required>
                  Confirm Password
                </Label>
                <PasswordInput
                  id="register-confirm"
                  placeholder="Re-enter your password"
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

          <FieldControl
            control={form.control}
            name="acceptTerms"
            render={({ field }) => (
              <Checkbox
                id="register-terms"
                label={
                  <span className="text-[12.5px] leading-snug">
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="font-semibold text-foreground hover:underline underline-offset-2"
                    >
                      Terms
                    </Link>{' '}
                    &{' '}
                    <Link
                      href="/privacy"
                      className="font-semibold text-foreground hover:underline underline-offset-2"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
                disabled={isBusy}
                checked={field.value ?? false}
                onCheckedChange={(v) => field.onChange(v)}
                onBlur={field.onBlur}
                name={field.name}
              />
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
              {auth.submitting === 'register' ? (
                <span className="inline-flex items-center gap-2">
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90 animate-bounce" />
                  </span>
                  Creating account…
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Create Account
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
        Secured with Supabase & SOC 2 Type II compliant infrastructure.
      </motion.p>
    </AuthPageShell>
  );
}

export default function RegisterPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-obsidian-950 flex items-center justify-center text-white/50">Loading...</div>}>
      <RegisterContent />
    </React.Suspense>
  );
}
