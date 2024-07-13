<<<<<<< HEAD
import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify, decodeJwt } from 'jose';

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string): Promise<boolean> {
  try {
    // Decode the token without verifying it to access the payload
    const decodedToken = decodeJwt(token);
    const currentTime = Math.floor(Date.now() / 1000); // Get current time in seconds

    console.log('Decoded token:', decodedToken);

    // Check if the token has expired
    if (decodedToken.exp && decodedToken.exp < currentTime) {
      console.log('Token has expired');
      return false;
    }

    // Verify the token
    const { payload } = await jwtVerify(token, secret);

    console.log('Verified token payload:', payload);

    return typeof payload === 'object' && payload.role === 'admin';
  } catch (error) {
    console.error('Token verification error:', error);
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get('authToken');
  const token = tokenCookie ? tokenCookie.value : null;

  console.log('Token from cookie:', token);

  if (!token || !(await verifyToken(token))) {
    console.log('Invalid or missing token, redirecting to login.');
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url.toString());
  }

  const response = NextResponse.next();
  response.headers.set('X-Auth-Token', token);
  return response;
}

export const config = {
  matcher: ['/upload/:path*'], // Protect all routes under /upload
};
=======
export {default} from 'next-auth/middleware'
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // If the user is not authenticated, redirect them to the login page
  if (!token) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/upload/:path*'], // Apply the middleware to the /upload path
};
>>>>>>> nextauth
