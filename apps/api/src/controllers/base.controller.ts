import type { Response } from 'express';
import type { ApiResponse, ApiResponseMetadata } from '@ai-sales-assistant/types';
import { HTTP_STATUS } from '@ai-sales-assistant/config';

export abstract class BaseController {
  protected sendSuccess<T>(
    res: Response,
    data: T,
    message?: string,
    statusCode: number = HTTP_STATUS.OK,
    metadata?: ApiResponseMetadata
  ): Response {
    const responsePayload: ApiResponse<T> = {
      success: true,
      message,
      data,
      metadata: {
        timestamp: new Date().toISOString(),
        ...metadata,
      },
    };
    return res.status(statusCode).json(responsePayload);
  }
}
