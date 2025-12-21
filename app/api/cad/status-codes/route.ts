import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const codes = await prisma.statusCode.findMany({
      where: {
        isActive: true,
      },
      orderBy: [
        { category: "asc" },
        { code: "asc" },
      ],
    });

    return NextResponse.json({ codes });
  } catch (error) {
    console.error("Error fetching status codes:", error);
    return NextResponse.json(
      { error: "Failed to fetch status codes" },
      { status: 500 }
    );
  }
}
