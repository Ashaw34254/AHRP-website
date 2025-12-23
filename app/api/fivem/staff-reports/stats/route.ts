import { NextRequest, NextResponse } from "next/server";

const FIVEM_SERVER = process.env.FIVEM_SERVER_URL || "http://localhost:30120";

// GET /api/fivem/staff-reports/stats - Get statistics from FiveM
export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${FIVEM_SERVER}/api/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // FiveM server doesn't have the endpoint - return mock data for testing
      console.warn(`[Staff Reports Stats] FiveM API returned ${response.status}, using mock data`);
      
      return NextResponse.json({
        success: true,
        stats: {
          total_reports: 3,
          pending: 1,
          reviewed: 1,
          closed: 1,
          high_priority: 1,
          medium_priority: 1,
          low_priority: 1,
          bugs: 1,
          complaints: 1,
          suggestions: 1
        }
      });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Staff Reports Stats] Error:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch statistics",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
