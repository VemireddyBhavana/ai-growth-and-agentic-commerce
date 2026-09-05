import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts', 'apps/api/tests/**/*.test.ts'],
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/ai_sales_assistant_test?schema=public',
      JWT_SECRET: 'dev_jwt_secret_super_secure_key_min_32_chars_2026_xai_commerce',
      OPENAI_API_KEY: 'sk-test-not-used-by-api-tests',
      RAZORPAY_KEY_ID: 'rzp_test_not_used',
      RAZORPAY_KEY_SECRET: 'test_secret_not_used',
    },
    setupFiles: [],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', 'prisma/'],
    },
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
});
