/**
 * Phase 7.10 — Deterministic Risk Classification Service
 */

import { RiskLevel } from '@prisma/client';
import { ActionType, PROHIBITED_FINANCIAL_ACTION_TYPES } from './action.types.js';

export class RiskService {
  /**
   * Deterministically classify the risk level of an action proposal.
   */
  classifyRisk(
    actionType: ActionType,
    parameters?: Record<string, unknown>,
    currentValues?: { price?: number; inventory?: number }
  ): RiskLevel {
    // 1. Financial actions are ALWAYS CRITICAL
    if (PROHIBITED_FINANCIAL_ACTION_TYPES.has(actionType)) {
      return 'CRITICAL';
    }

    // 2. Executable actions assessment
    switch (actionType) {
      case 'UPDATE_PRODUCT_PRICE': {
        const newPrice = Number(parameters?.newPrice);
        const currentPrice = currentValues?.price;

        if (isNaN(newPrice) || newPrice <= 0) {
          return 'CRITICAL';
        }

        if (currentPrice && currentPrice > 0) {
          const changePercent = (Math.abs(newPrice - currentPrice) / currentPrice) * 100;
          if (changePercent > 30) {
            return 'CRITICAL';
          }
        }
        return 'HIGH';
      }

      case 'CREATE_PROMOTION':
      case 'REVIEW_OFFER':
        return 'HIGH';

      case 'UPDATE_INVENTORY': {
        const newQuantity = Number(parameters?.quantity);
        const currentQuantity = currentValues?.inventory ?? 0;
        const diff = Math.abs(newQuantity - currentQuantity);

        if (diff > 100 || newQuantity === 0) {
          return 'HIGH';
        }
        return 'MEDIUM';
      }

      case 'UPDATE_PRODUCT_STATUS':
      case 'UPDATE_PRODUCT_METADATA':
      case 'REVIEW_CATEGORY':
      case 'REVIEW_DESCRIPTION':
        return 'MEDIUM';

      case 'REVIEW_PRODUCT':
      case 'REVIEW_PRICE':
      case 'REVIEW_INVENTORY':
      case 'REVIEW_AI_RECOMMENDATION':
      default:
        return 'LOW';
    }
  }
}

export const riskService = new RiskService();
