import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Generates an HMAC SHA256 signature for payload verification (e.g. Razorpay webhook/order verification)
 */
export function generateHmacSha256(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('hex');
}

/**
 * Timing-safe comparison of two hash strings to prevent side-channel timing attacks
 */
export function verifyHmacSignature(expectedSignature: string, actualSignature: string): boolean {
  if (!expectedSignature || !actualSignature) return false;
  
  const expectedBuffer = Buffer.from(expectedSignature, 'utf8');
  const actualBuffer = Buffer.from(actualSignature, 'utf8');

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, actualBuffer);
}

/**
 * Generates a cryptographically secure random token
 */
export function generateSecureToken(byteLength: number = 32): string {
  return randomBytes(byteLength).toString('hex');
}
