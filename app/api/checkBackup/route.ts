import { NextResponse } from "next/server";
import { getNewestBackupByAdmin } from "@/lib/prisma"; // Import the function you already created

export async function GET(req: Request) {
  const url = new URL(req.url);
  const adminEmail = url.searchParams.get("adminname"); // Extract the admin email from query params

  if (!adminEmail) {
    return NextResponse.json(
      { error: "Admin email is required" },
      { status: 400 }
    );
  }

  try {
    const backup = await getNewestBackupByAdmin(adminEmail || "");
    if (!backup) {
      console.error("admin doaesnt have an entry in the backup db yet");
    }
    // Return the actual backup date to the frontend
    return NextResponse.json({
      backupat: backup ? backup.backupat : new Date(0).toISOString(),
    });
  } catch (error) {
    console.error("Error fetching backup:", error);
    return NextResponse.json(
      { error: "Failed to fetch backup data" },
      { status: 500 }
    );
  }
}
