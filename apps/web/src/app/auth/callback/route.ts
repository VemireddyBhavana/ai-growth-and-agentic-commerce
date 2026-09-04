import { NextResponse, type NextRequest } from 'next/server';
import { createSupabaseMiddlewareClient } from '@/lib/auth/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const response = NextResponse.redirect(`${origin}${next}`);
    try {
      const supabase = createSupabaseMiddlewareClient(request, response);
      await supabase.auth.exchangeCodeForSession(code);
    } catch (err) {
      const fallback = new URL('/login', origin);
      fallback.searchParams.set('reason', 'oauth-failed');
      return NextResponse.redirect(fallback);
    }
    return response;
  }

  const fallback = new URL('/login', origin);
  fallback.searchParams.set('reason', 'invalid-callback');
  return NextResponse.redirect(fallback);
}
