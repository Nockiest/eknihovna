// app/api/users.page.ts
import type { NextRequest } from 'next/server'
import   { NextResponse } from 'next/server'

type User = {
  id: number
  name: string
}

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
]

export   function GET(req: NextRequest) {
    return NextResponse.json(
      users

      );
}