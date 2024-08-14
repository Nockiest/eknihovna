import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'

type ResponseData = {
  message: string
}

export   function GET(
  // req: NextApiRequest,
  // res: NextApiResponse<ResponseData>
) {
  // const books =  await prisma.knihy.findMany()
  // res.status(200).json({ message: 'Hello from Next.js!' })
  return NextResponse.json({ message: 'Hello from Next.js!' })
}