import { describe, expect, it } from 'vitest';
import { rankedRecommendationsSchema, shoppingRequirementsSchema } from '../src/services/ai/ai.schemas.js';

describe('Phase 7.4 AI guardrail schemas', () => {
  it('accepts structured requirements and applies safe defaults', () => {
    const value=shoppingRequirementsSchema.parse({intent:'PRODUCT_SEARCH',query:'wireless headset',maxPrice:5000});
    expect(value.currency).toBe('INR'); expect(value.availabilityRequired).toBe(true);
  });
  it('rejects invalid budgets and malformed model recommendations', () => {
    expect(()=>shoppingRequirementsSchema.parse({intent:'PRODUCT_SEARCH',query:'x',minPrice:10,maxPrice:1})).toThrow();
    expect(()=>rankedRecommendationsSchema.parse([{productId:'not-a-cuid',rank:1,confidence:2,reason:'x'}])).toThrow();
  });
  it('does not permit recommendation fields outside grounded identifiers', () => {
    const value=rankedRecommendationsSchema.parse([{productId:'ck12345678901234567890123',rank:1,confidence:.8,reason:'Within budget',matchedPreferences:['budget']}]);
    expect(value[0]?.productId).toBe('ck12345678901234567890123');
  });
});
