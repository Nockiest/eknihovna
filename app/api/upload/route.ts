import { NextRequest   } from "next/server";
import DELETE_BOOKS from "./DELETE";
import POST_BOOKS from "./POST";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export async function POST(req: NextRequest) {
  const json = await req.json();
  return POST_BOOKS(json);
}


export async function DELETE(req: NextRequest) {
  return DELETE_BOOKS(req)
}
