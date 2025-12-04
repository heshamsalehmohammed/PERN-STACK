import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const publicPaths = ['/', '/todos', '/documents'];
  const isPublicPath = publicPaths.includes(path);

  const token = request.cookies.get('token')?.value || '';

  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/', request.nextUrl));
  }


  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  //   matcher: ['/', '/auth/(.*)', '/hives/(.*)'],
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
