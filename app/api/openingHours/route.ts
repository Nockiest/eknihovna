import { getCorsHeaders, noCacheHeaders } from "@/data/values";
import { getOpeningHours, upsertOpeningHours } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";

const DEFAULT_HOURS = [
  { id: "monday",    day: "Pondělí", open: "13:30", close: "15:30" },
  { id: "tuesday",   day: "Úterý",   open: "13:05", close: "15:35" },
  { id: "wednesday", day: "Středa",  open: "13:30", close: "15:30" },
  { id: "thursday",  day: "Čtvrtek", open: "12:45", close: "16:45" },
  { id: "friday",    day: "Pátek",   open: "13:30", close: "14:00" },
];

export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: getCorsHeaders(req.headers.get("origin")) });
}

export async function GET(req: NextRequest) {
  try {
    const hours = await getOpeningHours();
    return NextResponse.json(hours.length ? hours : DEFAULT_HOURS, {
      headers: { ...noCacheHeaders, ...getCorsHeaders(req.headers.get("origin")) },
    });
  } catch (error) {
    console.error("Error fetching opening hours:", error);
    return NextResponse.json(DEFAULT_HOURS, {
      headers: getCorsHeaders(req.headers.get("origin")),
    });
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(options);
  const allowedEmails = (process.env.NEXT_PUBLIC_WHITE_LIST_EMAILS ?? "").split(":");
  if (!session?.user?.email || !allowedEmails.includes(session.user.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { hours } = await req.json();
    if (!Array.isArray(hours)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    await upsertOpeningHours(hours);
    return NextResponse.json({ success: true }, {
      headers: getCorsHeaders(req.headers.get("origin")),
    });
  } catch (error) {
    console.error("Error saving opening hours:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
