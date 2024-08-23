import { NextApiRequest, NextApiResponse } from 'next';
import Cors from 'cors';

// Initialize CORS middleware
const cors = Cors({
  methods: ['GET', 'POST', 'OPTIONS'],
  origin: '*', // Allow requests from any origin
});

// Helper function to run middleware
export function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  fn: (req: NextApiRequest, res: NextApiResponse, result: (err?: Error) => void) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    fn(req, res, (err?: Error) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
}

export default cors;