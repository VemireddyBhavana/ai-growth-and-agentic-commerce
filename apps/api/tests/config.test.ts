import { describe, it, expect, beforeEach, vi } from 'vitest';
import { backendEnvSchema, frontendEnvSchema } from '@ai-sales-assistant/config';

describe('Environment Configuration Validation (Phase 9.1)', () => {
  describe('Backend Environment Validation', () => {
    const validDevConfig = {
      DATABASE_URL: 'postgresql://localhost',
      JWT_SECRET: 'dev_jwt_secret_super_secure_key_min_32_chars_2026_xai_commerce',
      OPENAI_API_KEY: 'sk-mock',
      RAZORPAY_KEY_ID: 'rzp_test_mock',
      RAZORPAY_KEY_SECRET: 'mock_secret',
    };

    it('passes with valid development config', () => {
      const result = backendEnvSchema.safeParse({
        ...validDevConfig,
        NODE_ENV: 'development'
      });
      expect(result.success).toBe(true);
    });

    it('fails when critical secrets are missing in production', () => {
      // Intentionally missing DATABASE_URL and JWT_SECRET
      const invalidProdConfig = {
        NODE_ENV: 'production',
        OPENAI_API_KEY: 'sk-live-key',
        RAZORPAY_KEY_ID: 'rzp_live_key',
        RAZORPAY_KEY_SECRET: 'live_secret',
      };

      const result = backendEnvSchema.safeParse(invalidProdConfig);
      expect(result.success).toBe(false);
      
      if (!result.success) {
        const errorPaths = result.error.errors.map(e => e.path[0]);
        expect(errorPaths).toContain('DATABASE_URL');
        expect(errorPaths).toContain('JWT_SECRET');
      }
    });

    it('fails when JWT secret is too short', () => {
      const result = backendEnvSchema.safeParse({
        ...validDevConfig,
        JWT_SECRET: 'short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toContain('at least 32 characters');
      }
    });

    it('validates RAZORPAY_MODE safely', () => {
      const resultLive = backendEnvSchema.safeParse({
        ...validDevConfig,
        RAZORPAY_MODE: 'live',
      });
      expect(resultLive.success).toBe(true);

      const resultInvalidMode = backendEnvSchema.safeParse({
        ...validDevConfig,
        RAZORPAY_MODE: 'invalid_mode',
      });
      expect(resultInvalidMode.success).toBe(false);
    });
  });

  describe('Frontend Environment Validation', () => {
    it('passes with valid frontend config', () => {
      const result = frontendEnvSchema.safeParse({
        NEXT_PUBLIC_APP_URL: 'http://localhost:3000',
        NEXT_PUBLIC_API_URL: 'http://localhost:5000/api/v1',
        NEXT_PUBLIC_SUPABASE_URL: 'https://placeholder.supabase.co',
        NEXT_PUBLIC_SUPABASE_ANON_KEY: 'placeholder-anon-key',
        NEXT_PUBLIC_RAZORPAY_KEY_ID: 'rzp_test_mock_key_id',
      });
      expect(result.success).toBe(true);
    });

    it('fails on malformed URL', () => {
      const result = frontendEnvSchema.safeParse({
        NEXT_PUBLIC_APP_URL: 'not-a-url',
      });
      expect(result.success).toBe(false);
    });
  });
});
