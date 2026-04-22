import { NextRequest, NextResponse } from "next/server";
import { getNewestBackupByAdmin } from "@/lib/prisma";
import { getCorsHeaders } from "@/data/values";

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const adminEmail = url.searchParams.get("adminname");

  if (!adminEmail) {
    return NextResponse.json(
      { error: "Admin email is required" },
      { status: 400 }
    );
  }

  try {
    const backup = await getNewestBackupByAdmin(adminEmail);
    if (!backup) {
      console.error("admin doaesnt have an entry in the backup db yet");
    }
    return NextResponse.json(
      { backupat: backup ? backup.backupat : new Date(0).toISOString() },
      { headers: getCorsHeaders(req.headers.get("origin")) }
    );
  } catch (error) {
    console.error("Error fetching backup:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup data" },
      { status: 500 }
    );
  }
}
