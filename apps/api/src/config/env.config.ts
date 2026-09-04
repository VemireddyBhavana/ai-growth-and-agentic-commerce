import dotenv from 'dotenv';
import { backendEnvSchema, type BackendEnv } from '@ai-sales-assistant/config';

// Load environment variables from .env file
dotenv.config();

function validateEnv(): BackendEnv {
  const result = backendEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Invalid environment variables configuration:');
    result.error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }

  return result.data;
}

export const env = validateEnv();
