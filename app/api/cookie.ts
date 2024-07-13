// import { NextApiRequest, NextApiResponse } from 'next';
// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';


// export default function POST(req: NextApiRequest, res: NextApiResponse) {

//   return NextResponse.json({ message: 'API endpoint for uploading login' });
//  }



// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log('X' )
// if (req.method === 'POST') {
//   const { username, password } = req.body;
//   alert('ran' + username+password )

//   // Replace with your authentication logic
//   if (  username==='admin' && password === process.env.JWT_SECRET) {
//     const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET as string, { expiresIn: '1h' });

//     // Set the cookie
//     res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=3600`);

//     return res.status(200).json({ message: 'Login successful' });
//   }

//   return res.status(401).json({ message: 'Invalid credentials' });
// }

// return res.status(405).json({ message: 'Method not allowed' });
// }
