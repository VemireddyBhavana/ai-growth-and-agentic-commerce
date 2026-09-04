export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface StructuredLogMeta {
  requestId?: string;
  userId?: string;
  merchantId?: string;
  executionMs?: number;
  [key: string]: unknown;
}

export function formatLogMessage(
  level: LogLevel,
  message: string,
  meta?: StructuredLogMeta
): string {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  return JSON.stringify(payload);
}
