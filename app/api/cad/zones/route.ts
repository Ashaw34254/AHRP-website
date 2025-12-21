import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const zones = await prisma.zone.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(zones);
  } catch (error) {
    console.error("Error fetching zones:", error);
    return NextResponse.json({ error: "Failed to fetch zones" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const zone = await prisma.zone.create({
      data: {
        name: body.name,
        code: body.code,
        description: body.description || null,
        boundaries: body.boundaries || "",
        status: body.status || "ACTIVE",
        priority: body.priority || "MEDIUM",
        assignedOfficers: [],
      },
    });
    return NextResponse.json(zone);
  } catch (error) {
    console.error("Error creating zone:", error);
    return NextResponse.json({ error: "Failed to create zone" }, { status: 500 });
  }
}
