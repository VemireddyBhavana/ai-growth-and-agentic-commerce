import { frontendEnvSchema } from '@ai-sales-assistant/config';

// Validate environment variables at build/runtime
export const env = frontendEnvSchema.parse({
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  NEXT_PUBLIC_STORE_ID: process.env.NEXT_PUBLIC_STORE_ID,
  NEXT_PUBLIC_DATA_SOURCE_MODE: process.env.NEXT_PUBLIC_DATA_SOURCE_MODE,
  NODE_ENV: process.env.NODE_ENV,
});
