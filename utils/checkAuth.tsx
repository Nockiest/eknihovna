import { NextApiRequest } from 'next';

export const checkAuth = (req: NextApiRequest): boolean => {
  const authtoken = req.cookies.authtoken;
  return !!authtoken;
};