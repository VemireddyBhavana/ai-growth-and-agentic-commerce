import { describe, it, expect } from 'vitest';
import {
  parseUserShoppingQuery,
  rankProducts,
  generateComparison,
  processShoppingAssistantMessage,
} from './ai-engine';
import { ASSISTANT_CATALOG } from './catalog-data';

describe('AI Shopping Assistant Engine', () => {
  describe('parseUserShoppingQuery', () => {
    it('should parse budget constraints accurately', () => {
      const parsed1 = parseUserShoppingQuery('I need wireless earbuds under ₹3000');
      expect(parsed1.budgetMax).toBe(3000);
      expect(parsed1.category).toBe('Audio');
      expect(parsed1.features).toContain('Wireless');

      const parsed2 = parseUserShoppingQuery('smartwatch below 5k');
      expect(parsed2.budgetMax).toBe(5000);
      expect(parsed2.category).toBe('Wearables');
    });

    it('should detect category and brand preferences', () => {
      const parsed = parseUserShoppingQuery('Show me Bolt anc headphones with fast charging');
      expect(parsed.category).toBe('Audio');
      expect(parsed.brand).toBe('Bolt');
      expect(parsed.features).toContain('ANC');
      expect(parsed.features).toContain('Fast Charging');
    });

    it('should detect comparison requests', () => {
      const parsed = parseUserShoppingQuery('Compare Nexus Pro Earbuds vs Bolt Sonic');
      expect(parsed.intentType).toBe('comparison');
    });

    it('should detect bundle requests', () => {
      const parsed = parseUserShoppingQuery('What is the best home office setup bundle?');
      expect(parsed.intentType).toBe('bundle_request');
    });
  });

  describe('rankProducts', () => {
    it('should prioritize budget-fitting items and include explainability metrics', () => {
      const intent = parseUserShoppingQuery('earbuds under ₹3000');
      const ranked = rankProducts(ASSISTANT_CATALOG, intent, 3);

      expect(ranked.length).toBeGreaterThan(0);
      expect(ranked[0].isTopPick).toBe(true);

      const top = ranked[0];
      expect(top.explainability).toBeDefined();
      expect(top.explainability.confidenceScore).toBeGreaterThanOrEqual(70);
      expect(top.explainability.reason).toContain('budget');
      expect(top.explainability.inventoryAvailability).toBeDefined();
      expect(top.explainability.priceMatch).toBeDefined();
    });
  });

  describe('generateComparison', () => {
    it('should generate structured matrix between 2 products', () => {
      const comparison = generateComparison([ASSISTANT_CATALOG[0], ASSISTANT_CATALOG[1]]);
      expect(comparison.title).toContain('Comparison');
      expect(comparison.columns.length).toBe(3);
      expect(comparison.rows.length).toBeGreaterThanOrEqual(5);
      expect(comparison.recommendationNote).toBeDefined();
    });
  });

  describe('processShoppingAssistantMessage', () => {
    it('should process user inquiry end-to-end and return complete response', async () => {
      const res = await processShoppingAssistantMessage('I need wireless earbuds under ₹3000');

      expect(res.reply).toBeDefined();
      expect(res.thinkingSteps.length).toBeGreaterThan(0);
      expect(res.recommendations.length).toBeGreaterThan(0);
      expect(res.followUpSuggestions.length).toBeGreaterThan(0);
      expect(res.insights).toBeDefined();
      expect(res.insights.budget.max).toBe(3000);
      expect(res.insights.detectedCategory).toBe('Audio');
    });
  });
});
