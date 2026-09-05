import { NextRequest, NextResponse } from 'next/server';
import '@/env';
import { authMiddleware } from '@/lib/auth/middleware';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Also run on `/` and all API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|bmp|svg)$).*)',
  ],
};

export async function middleware(request: NextRequest): Promise<NextResponse> {
  return authMiddleware(request);
}
