import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtUserPayload, UserRole } from '@ai-sales-assistant/types';
import { jwtConfig } from '../config/jwt.config.js';
import { AppError } from '../utils/app-error.js';

// Extend Express Request interface to include authenticated user.
// `declare global { namespace Express { ... } }` is the only way TypeScript
// allows augmenting an existing ambient namespace, so the no-namespace rule
// is disabled here rather than elsewhere in the codebase.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}

/**
 * Authentication Middleware: Validates Bearer JWT Token
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(AppError.unauthorized('Missing or malformed Authorization header'));
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return next(AppError.unauthorized('Bearer token was not provided'));
  }

  try {
    const decoded = jwt.verify(token, jwtConfig.secret) as JwtUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return next(new AppError({
        message: 'JWT token has expired',
        statusCode: 401,
        code: 'TOKEN_EXPIRED',
        remediation: 'Refresh your authentication token via the /auth/refresh endpoint.',
      }));
    }
    return next(AppError.unauthorized('Invalid authentication token signature'));
  }
}

/**
 * Role-Based Access Control (RBAC) Guard Middleware
 */
export function requireRoles(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(AppError.unauthorized());
    }

    if (!roles.includes(req.user.role)) {
      return next(AppError.forbidden(`Access requires one of roles: [${roles.join(', ')}]`));
    }

    next();
  };
}
