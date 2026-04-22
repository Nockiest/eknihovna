import { NextRequest, NextResponse } from "next/server";
import DELETE_BOOKS from "./DELETE";
import POST_BOOKS from "./POST";
import verifyDomain from "@/app/middleware/checkTrustedDomain";
import { getCorsHeaders } from "@/data/values";
export const maxDuration = 60;

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function POST(req: NextRequest) {
  if (!verifyDomain(req)) {
    return NextResponse.json(
      { success: false, message: "Access denied: Unauthorized domain" },
      { status: 403 }
    );
  }
  const json = await req.json();
  return POST_BOOKS(json, req.headers.get("origin"));
}

export async function DELETE(req: NextRequest) {
  if (!verifyDomain(req)) {
    return NextResponse.json(
      { success: false, message: "Access denied: Unauthorized domain" },
      { status: 403 }
    );
  }
  return DELETE_BOOKS(req);
}
