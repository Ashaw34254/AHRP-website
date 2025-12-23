import { NextRequest, NextResponse } from "next/server";

// Proxy endpoint for FiveM Staff Reports Web API
// Forwards requests to your FiveM server

const FIVEM_SERVER = process.env.FIVEM_SERVER_URL || "http://localhost:30120";

// GET /api/fivem/staff-reports - Fetch reports from FiveM server
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Forward query parameters to FiveM API
    const status = searchParams.get("status") || "all";
    const priority = searchParams.get("priority") || "all";
    const type = searchParams.get("type") || "all";
    const limit = searchParams.get("limit") || "50";
    const offset = searchParams.get("offset") || "0";
    const reportId = searchParams.get("reportId");

    // Build FiveM API URL
    let fivemUrl = `${FIVEM_SERVER}/api/reports`;
    
    if (reportId) {
      // Get single report
      fivemUrl = `${FIVEM_SERVER}/api/reports/${reportId}`;
    } else {
      // List reports with filters
      const params = new URLSearchParams();
      if (status !== "all") params.append("status", status);
      if (priority !== "all") params.append("priority", priority);
      if (type !== "all") params.append("type", type);
      params.append("limit", limit);
      params.append("offset", offset);
      
      const queryString = params.toString();
      if (queryString) {
        fivemUrl += `?${queryString}`;
      }
    }

    // Make request to FiveM server
    const response = await fetch(fivemUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // FiveM server doesn't have the endpoint - return mock data for testing
      console.warn(`[Staff Reports] FiveM API returned ${response.status}, using mock data`);
      
      if (reportId) {
        // Mock single report
        return NextResponse.json({
          success: true,
          report: {
            id: reportId,
            title: "Test Report",
            details: "This is mock data. Install Staff Reports resource on FiveM server.",
            submitter_name: "Test User",
            submitter_id: "1",
            status: "pending",
            priority: "medium",
            type: "general",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      } else {
        // Mock list of reports
        return NextResponse.json({
          success: true,
          reports: [
            {
              id: "1",
              title: "Server Performance Issue",
              details: "Mock data - install Staff Reports resource on FiveM",
              submitter_name: "Admin",
              submitter_id: "1",
              status: "pending",
              priority: "high",
              type: "bug",
              created_at: new Date(Date.now() - 3600000).toISOString(),
              updated_at: new Date(Date.now() - 3600000).toISOString()
            },
            {
              id: "2",
              title: "Player Complaint",
              details: "Mock data for testing",
              submitter_name: "User123",
              submitter_id: "2",
              status: "reviewed",
              priority: "medium",
              type: "complaint",
              created_at: new Date(Date.now() - 7200000).toISOString(),
              updated_at: new Date(Date.now() - 1800000).toISOString()
            },
            {
              id: "3",
              title: "Feature Request",
              details: "Mock data - needs FiveM Staff Reports resource",
              submitter_name: "TestPlayer",
              submitter_id: "3",
              status: "closed",
              priority: "low",
              type: "suggestion",
              created_at: new Date(Date.now() - 86400000).toISOString(),
              updated_at: new Date(Date.now() - 3600000).toISOString()
            }
          ],
          total: 3
        });
      }
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Staff Reports Proxy] Error fetching reports:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch reports from FiveM server",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// POST /api/fivem/staff-reports - Create report via website
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.submitter_name || !body.title || !body.details) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Missing required fields: submitter_name, title, details" 
        },
        { status: 400 }
      );
    }

    // Forward to FiveM server
    const response = await fetch(`${FIVEM_SERVER}/api/reports`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`FiveM API returned status ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[Staff Reports Proxy] Error creating report:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to create report",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
