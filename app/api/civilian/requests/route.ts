import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const recordRequest = await prisma.recordsRequest.create({
      data: {
        requestorName: body.requestorName,
        requestorEmail: body.requestorEmail,
        requestType: body.requestType,
        subjectName: body.subjectName || null,
        reason: body.reason || null,
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
