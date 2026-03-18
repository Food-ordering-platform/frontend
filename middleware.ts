// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Detect if the request is on the admin subdomain
  const isAdminSubdomain = hostname.startsWith('admin.');

  // 2. Prevent path-based access (e.g., choweazy.com/admin)
  // This makes the /admin folder invisible on the main site
  if (url.pathname.startsWith('/admin') && !isAdminSubdomain) {
    return NextResponse.rewrite(new URL('/404', req.url));
  }

  // 3. Handle the subdomain rewrite
  if (isAdminSubdomain) {
    return NextResponse.rewrite(new URL(`/admin${url.pathname === '/' ? '' : url.pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};