import OpenAI from 'openai';
import { env } from './env.config.js';

/**
 * OpenAI SDK Client Configuration
 * Pre-configured singleton instance with fallback safety checks.
 */
export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
});

export const openaiConfig = {
  model: env.OPENAI_MODEL,
  isConfigured: Boolean(env.OPENAI_API_KEY && !env.OPENAI_API_KEY.includes('mock')),
};
