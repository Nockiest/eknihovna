import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';
const secret = new TextEncoder().encode(process.env.JWT_SECRET);

async function verifyToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret);
    console.log('Decoded token:', payload);
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

  return NextResponse.next();
}
// function verifyToken(token: string): boolean {
//   // Your token verification logic (e.g., JWT verification)
//   try {
//     // Example: JWT verification
//     const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
//     // Check if the decoded token is an object and has the role 'admin'
//     return typeof decoded === 'object' && (decoded as any).role === 'admin';
//   } catch (error) {
//     // If there's an error during verification, return false
//     return false;
//   }
// }

export const config = {
  matcher: ['/upload/:path*'], // Protect all routes under /upload
};
