import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const token = request.cookies.get("token")?.value;

  const publicPaths = ["/", "/documents", "/auth/login", "/auth/register"];

  const isPublicPath = publicPaths.includes(path);
  const isAuthPath = path.startsWith("/auth");


  if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/todos", request.nextUrl));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/auth/login", request.nextUrl));
  }


  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
