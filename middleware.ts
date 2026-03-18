// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  // 1. Is this coming from ANY admin subdomain? 
  // (Works for admin.localhost, admin.staging.choweazy.com, admin.choweazy.com)
  const isAdminSubdomain = hostname.startsWith('admin.');

  // 2. Is someone trying to snoop the secret folder from the main site? 
  // (e.g. typing choweazy.com/admin)
  const isSnoopingAdminFolder = url.pathname.startsWith('/admin') && !isAdminSubdomain;

  if (isSnoopingAdminFolder) {
    // Pretend the page doesn't exist to confuse them
    return NextResponse.redirect(new URL('/404', req.url)); 
  }

  if (isAdminSubdomain) {
    // Rewrite to the secret folder
    return NextResponse.rewrite(new URL(`/admin${url.pathname === '/' ? '' : url.pathname}`, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};