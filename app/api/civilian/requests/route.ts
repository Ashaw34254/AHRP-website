import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Generate request number
    const count = await prisma.recordsRequest.count();
    const requestNumber = `RR-${String(count + 1).padStart(5, "0")}`;

    const recordRequest = await prisma.recordsRequest.create({
      data: {
        requestNumber,
        requesterName: body.requesterName || body.requestorName,
        requesterEmail: body.requesterEmail || body.requestorEmail,
        requesterPhone: body.requesterPhone || null,
        requestType: body.requestType,
        recordDetails: body.recordDetails || body.reason || "",
        status: "PENDING",
      },
    });

    return NextResponse.json(recordRequest);
  } catch (error) {
    console.error("Error creating records request:", error);
    return NextResponse.json(
      { error: "Failed to create request" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.recordsRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error) {
    console.error("Error fetching records requests:", error);
    return NextResponse.json(
      { error: "Failed to fetch requests" },
      { status: 500 }
    );
  }
}
