import { NextRequest, NextResponse } from "next/server";
import { insertJsonDataToPostgres } from "./insertExcelDataIntoPostgres"; // Assuming this function exists
import { prisma } from "@/lib/prisma";

// CORS headers configuration
const corsHeaders = {
'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function POST(req: NextRequest) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  console.log("POST request received",req.headers.get('Content-Type'));

  try {
    const contentType = req.headers.get('Content-Type');

    // Check if the request is JSON
    if ((contentType && contentType.includes('application/json')) ) {
      const jsonData = await req.json();

      if (!jsonData.headers || !jsonData.chunk) {
        throw new Error('Invalid JSON data');
      }
      try {
        await insertJsonDataToPostgres(jsonData, "knihy");
      } catch (dbError: any) {
        console.error("Database insertion error:", dbError);
        return NextResponse.json({
          success: false,
          error: "Database insertion error",
          details: dbError.message,
        }, { headers:corsHeaders });
      }

      return NextResponse.json({ success: true, message: "Data processed and uploaded successfully" }, { headers: corsHeaders});

    }

  } catch (error: any) {
    console.error("Error processing data:", error);
    return NextResponse.json({ success: false, error: "Server error", details: error.message }, { headers: corsHeaders });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Delete the books with the provided IDs
    const deleteResult = await prisma.knihy.deleteMany( );

    // Return a success response with the number of deleted books
    return NextResponse.json({
      success: true,
      message: `${deleteResult.count} book(s) deleted successfully`,
    });
  } catch (error: any) {
    console.error('Error deleting books:', error);
    return NextResponse.json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  } finally {
    await prisma.$disconnect();
  }
}
