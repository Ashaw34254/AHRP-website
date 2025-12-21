import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    // Search by name or State ID
    const citizen = await prisma.citizen.findFirst({
      where: {
        OR: [
          {
            firstName: {
              contains: query,
            },
          },
          {
            lastName: {
              contains: query,
            },
          },
          {
            stateId: {
              equals: query,
            },
          },
        ],
      },
      include: {
        warrants: {
          where: {
            isActive: true,
          },
        },
        vehicles: true,
      },
    });

    if (!citizen) {
      return NextResponse.json(
        { error: "Citizen not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ citizen });
  } catch (error) {
    console.error("Error searching citizen:", error);
    return NextResponse.json(
      { error: "Failed to search citizen" },
      { status: 500 }
    );
  }
}
