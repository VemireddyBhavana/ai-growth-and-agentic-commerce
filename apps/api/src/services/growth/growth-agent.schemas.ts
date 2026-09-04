/**
 * Phase 7.9 — AI Merchant Growth Agent Schemas
 *
 * Zod schemas for validating LLM structured JSON outputs, request parameters,
 * confidence clamping, and evidence structures.
 */

import { z } from 'zod';
import {
  OPPORTUNITY_TYPES,
  ACTION_CATEGORIES,
  SEVERITY_LEVELS,
} from './growth-agent.types.js';

export const evidenceItemSchema = z.object({
  metric: z.string().min(1),
  observedValue: z.number(),
  comparisonValue: z.number().nullable().optional(),
  unit: z.string().optional(),
  description: z.string().min(1),
});

export const opportunityExplanationSchema = z.object({
  what: z.string().min(1),
  why: z.string().min(1),
  evidenceSummary: z.string().min(1),
  recommendedNextStep: z.string().min(1),
  confidence: z.string().min(1),
});

export const growthOpportunitySchema = z.object({
  type: z.enum(OPPORTUNITY_TYPES),
  title: z.string().min(3),
  summary: z.string().min(10),
  severity: z.enum(SEVERITY_LEVELS),
  confidence: z
    .preprocess((val) => {
      const num = Number(val);
      if (isNaN(num)) return 0.5;
      if (num > 1 && num <= 100 && Number.isInteger(num)) return num / 100;
      return Math.max(0.0, Math.min(1.0, num));
    }, z.number())
    .transform((val) => Math.round(val * 100) / 100),
  actionCategory: z.enum(ACTION_CATEGORIES),
  targetProductId: z.string().nullable().optional(),
  recommendedAction: z.string().min(10),
  expectedImpact: z.string().min(5),
  evidence: z.array(evidenceItemSchema).min(1),
  explanation: opportunityExplanationSchema,
});

export const growthAnalysisOutputSchema = z.object({
  summary: z.string().min(10),
  opportunities: z.array(growthOpportunitySchema),
});

export const analyzeGrowthBodySchema = z.object({
  period: z.enum(['today', '7d', '30d', '90d']).default('30d'),
  from: z.string().optional(),
  to: z.string().optional(),
});
