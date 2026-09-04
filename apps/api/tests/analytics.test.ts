/**
 * Phase 7.8 — Analytics Engine Unit Tests (no DB)
 *
 * Tests cover:
 * - Safe percentage change calculations (handles zero, negative, null)
 * - Safe rate division (handles zero denominator)
 * - Period preset resolution (today, 7d, 30d, 90d)
 * - Comparison period duration calculation
 * - Paid order status taxonomy completeness
 * - Analytics event taxonomy completeness
 */

import { describe, expect, it } from 'vitest';
import {
  percentChange,
  safeRate,
  resolvePeriod,
  comparisonPeriod,
  PAID_ORDER_STATUSES,
  ANALYTICS_EVENT_TYPES,
} from '../src/services/analytics/analytics.types.js';

describe('Phase 7.8 — Analytics Helper Unit Tests', () => {
  describe('percentChange()', () => {
    it('calculates positive percentage growth', () => {
      expect(percentChange(150, 100)).toBe(50);
    });

    it('calculates negative percentage drop', () => {
      expect(percentChange(75, 100)).toBe(-25);
    });

    it('returns 0 when current equals previous', () => {
      expect(percentChange(100, 100)).toBe(0);
    });

    it('returns null when previous value is 0 (avoids Infinity)', () => {
      expect(percentChange(100, 0)).toBeNull();
      expect(percentChange(0, 0)).toBeNull();
    });

    it('rounds percentage to two decimal places', () => {
      expect(percentChange(133.333, 100)).toBe(33.33);
    });
  });

  describe('safeRate()', () => {
    it('calculates percentage rate correctly', () => {
      expect(safeRate(25, 100)).toBe(25);
      expect(safeRate(1, 3)).toBe(33.33);
    });

    it('returns null when denominator is 0 (avoids NaN)', () => {
      expect(safeRate(10, 0)).toBeNull();
      expect(safeRate(0, 0)).toBeNull();
    });

    it('returns 0 when numerator is 0', () => {
      expect(safeRate(0, 100)).toBe(0);
    });
  });

  describe('resolvePeriod()', () => {
    it('resolves "today" to start of today and end of today', () => {
      const range = resolvePeriod('today');
      expect(range.from).toBeInstanceOf(Date);
      expect(range.to).toBeInstanceOf(Date);
      expect(range.from.getHours()).toBe(0);
      expect(range.from.getMinutes()).toBe(0);
      expect(range.to.getHours()).toBe(23);
      expect(range.to.getMinutes()).toBe(59);
    });

    it('resolves "7d" preset', () => {
      const range = resolvePeriod('7d');
      const diffDays = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(7);
    });

    it('resolves "30d" preset', () => {
      const range = resolvePeriod('30d');
      const diffDays = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(30);
    });

    it('resolves "90d" preset', () => {
      const range = resolvePeriod('90d');
      const diffDays = Math.round((range.to.getTime() - range.from.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(90);
    });
  });

  describe('comparisonPeriod()', () => {
    it('creates previous range of equal duration immediately preceding current', () => {
      const current = resolvePeriod('7d');
      const comp = comparisonPeriod(current);

      expect(comp.current).toEqual(current);
      expect(comp.previous.to.getTime()).toBeLessThan(current.from.getTime());
      
      const currentDuration = current.to.getTime() - current.from.getTime();
      const previousDuration = comp.previous.to.getTime() - comp.previous.from.getTime();
      
      // Durations should match within 1 second due to hour truncation
      expect(Math.abs(currentDuration - previousDuration)).toBeLessThan(1000);
    });
  });

  describe('Taxonomy & Constants', () => {
    it('includes authoritative revenue order statuses', () => {
      expect(PAID_ORDER_STATUSES).toContain('CONFIRMED');
      expect(PAID_ORDER_STATUSES).toContain('DELIVERED');
      expect(PAID_ORDER_STATUSES).not.toContain('PENDING');
      expect(PAID_ORDER_STATUSES).not.toContain('CANCELLED');
      expect(PAID_ORDER_STATUSES).not.toContain('FAILED');
    });

    it('contains all required analytics event types', () => {
      expect(ANALYTICS_EVENT_TYPES).toContain('PRODUCT_VIEWED');
      expect(ANALYTICS_EVENT_TYPES).toContain('AI_RECOMMENDATION_GENERATED');
      expect(ANALYTICS_EVENT_TYPES).toContain('CART_VIEWED');
      expect(ANALYTICS_EVENT_TYPES).toContain('ORDER_CREATED');
      expect(ANALYTICS_EVENT_TYPES).toContain('PAYMENT_VERIFICATION_SUCCESS');
    });
  });
});
