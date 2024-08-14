import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  message: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // const books =  await prisma.knihy.findMany()
  res.status(200).json({ message: 'Hello from Next.js!' })
}