import { NextRequest   } from "next/server";
import DELETE_BOOKS from "./DELETE";
import POST_BOOKS from "./POST";

export async function POST(req: NextRequest) {
  return POST_BOOKS(req)
}


export async function DELETE(req: NextRequest) {
  return DELETE_BOOKS(req)
}
 