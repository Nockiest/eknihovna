import { NextRequest, NextResponse   } from "next/server";
import DELETE_BOOKS from "./DELETE";
import POST_BOOKS from "./POST";
import verifyDomain from "@/app/middleware/checkTrustedDomain";
export const maxDuration = 60; // This function can run for a maximum of 60 seconds
export async function POST(req: NextRequest   ) {
  ;
  if (!verifyDomain(req)) {
    return NextResponse.json(
      { success: false, message: "Access denied: Unauthorized domain" },
      { status: 403 }
    );
  }
  const json = await req.json()
  return POST_BOOKS(json);
}


export async function DELETE(req: NextRequest) {
   if (!verifyDomain(req)) {
    return NextResponse.json(
      { success: false, message: "Access denied: Unauthorized domain" },
      { status: 403 }
    );
  }
  return DELETE_BOOKS(req)
}
