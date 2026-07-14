import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Proxy (Edge) — Admin Route Guard
 *
 * Protects all /admin/* routes EXCEPT /admin/login.
 * Reads the httpOnly `admin_token` cookie set by /api/auth/login.
 * If missing or invalid → redirect to /admin/login?from=<original path>.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes EXCEPT the login page itself
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const adminToken = request.cookies.get('admin_token')?.value;

    if (adminToken !== 'authenticated') {
      // Redirect to login, preserving the original destination
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
