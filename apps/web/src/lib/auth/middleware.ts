import { type NextRequest, NextResponse } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/auth/supabase/server';

const PUBLIC_ROUTES: ReadonlyArray<string> = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
  '/',
  '/about',
  '/pricing',
  '/blog',
  '/contact',
];

const PUBLIC_PREFIXES: ReadonlyArray<string> = [
  '/_next',
  '/static',
  '/favicon',
  '/api/',
  '/auth/',
  '/images',
  '/og',
  '/sitemap',
  '/robots',
];

const AUTH_ROUTES: ReadonlyArray<string> = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email',
  '/reset-password',
];

const MERCHANT_ROUTES: ReadonlyArray<string> = ['/dashboard', '/merchant', '/settings'];

function isPublicRoute(pathname: string): boolean {
  if (pathname === '/') return true;
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return true;
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) return true;
  return false;
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isMerchantRoute(pathname: string): boolean {
  return MERCHANT_ROUTES.some((route) => pathname.startsWith(route));
}

function buildLoginUrl(request: NextRequest, reason: string): NextResponse {
  const destination = new URL('/login', request.nextUrl.origin);
  destination.searchParams.set('redirect', request.nextUrl.pathname + request.nextUrl.search);
  destination.searchParams.set('reason', reason);
  return NextResponse.redirect(destination);
}

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    const supabase = createSupabaseMiddlewareClient(request, response);
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Session invalid / expired — only block protected routes
      if (!isPublicRoute(request.nextUrl.pathname) && !isAuthRoute(request.nextUrl.pathname)) {
        return buildLoginUrl(request, 'session-expired');
      }
      return response;
    }

    const user = data?.user ?? null;
    const hasSession = Boolean(user);
    const emailVerified = Boolean(user?.email_confirmed_at ?? user?.phone_confirmed_at);

    if (!hasSession) {
      if (!isPublicRoute(request.nextUrl.pathname) && !isAuthRoute(request.nextUrl.pathname)) {
        return buildLoginUrl(request, 'login-required');
      }
      return response;
    }

    if (isAuthRoute(request.nextUrl.pathname)) {
      // Authenticated users shouldn't hit login/register — send to dashboard
      if (!emailVerified && request.nextUrl.pathname.startsWith('/verify-email')) {
        return response;
      }
      if (!emailVerified) {
        const destination = new URL('/verify-email', request.nextUrl.origin);
        return NextResponse.redirect(destination);
      }
      const destination = new URL('/dashboard', request.nextUrl.origin);
      return NextResponse.redirect(destination);
    }

    if (!emailVerified && isMerchantRoute(request.nextUrl.pathname)) {
      const destination = new URL('/verify-email', request.nextUrl.origin);
      destination.searchParams.set('email', user.email ?? '');
      return NextResponse.redirect(destination);
    }

    return response;
  } catch (_err) {
    // Safely degrade — only block merchant routes
    if (isMerchantRoute(request.nextUrl.pathname)) {
      return buildLoginUrl(request, 'auth-error');
    }
    return response;
  }
}
