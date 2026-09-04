import type { ApiErrorDetail } from '@ai-sales-assistant/types';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly details?: ApiErrorDetail[];
  public readonly remediation?: string;
  public readonly isOperational: boolean;

  constructor(options: {
    message: string;
    statusCode?: number;
    code?: string;
    details?: ApiErrorDetail[];
    remediation?: string;
    isOperational?: boolean;
  }) {
    super(options.message);
    this.name = 'AppError';
    this.statusCode = options.statusCode ?? 500;
    this.code = options.code ?? 'INTERNAL_SERVER_ERROR';
    this.details = options.details;
    this.remediation = options.remediation;
    this.isOperational = options.isOperational ?? true;

    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: ApiErrorDetail[], remediation?: string): AppError {
    return new AppError({
      message,
      statusCode: 400,
      code: 'BAD_REQUEST',
      details,
      remediation,
    });
  }

  static unauthorized(message: string = 'Authentication required'): AppError {
    return new AppError({
      message,
      statusCode: 401,
      code: 'UNAUTHORIZED',
      remediation: 'Provide a valid Bearer JWT access token in the Authorization header.',
    });
  }

  static forbidden(message: string = 'Permission denied'): AppError {
    return new AppError({
      message,
      statusCode: 403,
      code: 'FORBIDDEN',
      remediation: 'Ensure your account has the appropriate role permissions.',
    });
  }

  static notFound(resource: string = 'Resource'): AppError {
    return new AppError({
      message: `${resource} not found`,
      statusCode: 404,
      code: 'NOT_FOUND',
    });
  }

  static conflict(message: string): AppError {
    return new AppError({
      message,
      statusCode: 409,
      code: 'CONFLICT',
    });
  }

  static unprocessable(message: string, details?: ApiErrorDetail[]): AppError {
    return new AppError({
      message,
      statusCode: 422,
      code: 'UNPROCESSABLE_ENTITY',
      details,
    });
  }
}
