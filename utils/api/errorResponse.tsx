import { NextResponse } from 'next/server';

export const errorResponse = (message: string, status: number) => {
  return NextResponse.json({ error: message }, { status });
};