import { z } from 'zod';

export const strongPasswordSchema = z
  .string({ required_error: 'Password is required' })
  .min(8, { message: 'Password must be at least 8 characters' })
  .max(128, { message: 'Password must be at most 128 characters' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least one special character (!@#$%^&*)',
  });

export const emailSchema = z
  .string({ required_error: 'Email is required' })
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
  .trim()
  .toLowerCase();

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string({ required_error: 'Password is required' }).min(1, {
    message: 'Password is required',
  }),
  rememberMe: z.boolean().optional().default(false),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    name: z
      .string({ required_error: 'Full name is required' })
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(80, { message: 'Name must be at most 80 characters' })
      .trim(),
    email: emailSchema,
    password: strongPasswordSchema,
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
    acceptTerms: z
      .boolean({ required_error: 'You must accept the terms and privacy policy' })
      .refine((val) => val === true, {
        message: 'You must accept the terms and privacy policy',
      }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    password: strongPasswordSchema,
    confirmPassword: z.string({
      required_error: 'Please confirm your password',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords do not match',
      });
    }
  });

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const verifyEmailSchema = z.object({
  token: z
    .string({ required_error: 'Verification token is required' })
    .min(1, { message: 'Verification token is required' }),
});

export const rememberMeCookieOptions = {
  maxAge: 60 * 60 * 24 * 30, // 30 days
  path: '/',
  httpOnly: false,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
};
