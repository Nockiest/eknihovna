import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    const authtoken = req.cookies.authtoken;

    if (authtoken) {
      res.status(200).json({ isAuthenticated: true });
    } else {
      res.status(200).json({ isAuthenticated: false });
    }
  }