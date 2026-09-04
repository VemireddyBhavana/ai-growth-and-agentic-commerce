/**
 * Phase 7.10 — Guardrail Error Classes
 */

import { AppError } from '../../utils/app-error.js';

export class GuardrailError extends AppError {
  constructor(message: string, statusCode = 422, code = 'GUARDRAIL_VIOLATION') {
    super({ message, statusCode, code });
    this.name = 'GuardrailError';
  }
}

export class PolicyViolationError extends GuardrailError {
  constructor(reason: string) {
    super(`Action violates merchant guardrail policy: ${reason}`, 422, 'POLICY_VIOLATION');
    this.name = 'PolicyViolationError';
  }
}

export class FinancialActionProhibitedError extends GuardrailError {
  constructor(actionType: string) {
    super(
      `Financial action "${actionType}" cannot be autonomously executed by the AI Growth Agent.`,
      403,
      'FINANCIAL_ACTION_PROHIBITED'
    );
    this.name = 'FinancialActionProhibitedError';
  }
}

export class ActionStaleError extends GuardrailError {
  constructor(reason = 'Target entity state has changed since action approval.') {
    super(`Action is stale and cannot be executed: ${reason}`, 409, 'ACTION_STALE');
    this.name = 'ActionStaleError';
  }
}

export class ActionExpiredError extends GuardrailError {
  constructor() {
    super('Action approval has expired and requires re-approval.', 410, 'ACTION_EXPIRED');
    this.name = 'ActionExpiredError';
  }
}

export class RateLimitExceededError extends GuardrailError {
  constructor(reason = 'Action limit exceeded for merchant policy window.') {
    super(reason, 429, 'ACTION_LIMIT_EXCEEDED');
    this.name = 'RateLimitExceededError';
  }
}

export class SelfApprovalError extends GuardrailError {
  constructor() {
    super('The AI Agent cannot approve its own action proposal.', 403, 'SELF_APPROVAL_PROHIBITED');
    this.name = 'SelfApprovalError';
  }
}
