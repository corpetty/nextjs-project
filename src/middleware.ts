import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// List of paths that require authentication
const protectedPaths = ['/addresses', '/portfolio', '/settings'];

// List of paths that should redirect to /addresses if logged in
const authPaths = ['/login', '/register'];

export function middleware(request: NextRequest) {
  // Skip middleware for API routes and static files
  if (request.nextUrl.pathname.startsWith('/api/') || 
      request.nextUrl.pathname.startsWith('/_next/') ||
      request.nextUrl.pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('payload-token');
  const { pathname } = request.nextUrl;

  // Check if the path requires authentication
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!token?.value) {
      // Redirect to login if trying to access protected path without token
      const response = NextResponse.redirect(new URL('/login', request.url));
      // Clear any invalid tokens
      response.cookies.delete('payload-token');
      return response;
    }
  }

  // Only redirect from auth pages if there's a valid token
  if (authPaths.includes(pathname) && token?.value) {
    // Check if token is not empty
    if (token.value.length > 0) {
      return NextResponse.redirect(new URL('/addresses', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
