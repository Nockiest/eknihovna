
export {default} from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, redirect them to the login page
  // if (!token) {
  //   return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  // }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/upload/:path*'], // Apply the middleware to the /upload path
};
