import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Traffic stops today
    const stopsToday = await prisma.trafficStop.count({
      where: {
        timestamp: {
          gte: today,
        },
      },
    });

    // Infringements today
    const infringementsToday = await prisma.infringement.count({
      where: {
        issuedAt: {
          gte: today,
        },
      },
    });

    // Active pursuits
    const activePursuits = await prisma.pursuit.count({
      where: {
        status: "ACTIVE",
      },
    });

    // Vehicles checked (from plate scans today)
    const vehiclesChecked = await prisma.plateScan.count({
      where: {
        scannedAt: {
          gte: today,
        },
      },
    });

    // Total fines (unpaid infringements)
    const unpaidInfringements = await prisma.infringement.findMany({
      where: {
        isPaid: false,
      },
      select: {
        fineAmount: true,
      },
    });

    const totalFines = unpaidInfringements.reduce((sum, inf) => sum + inf.fineAmount, 0);

    const stats = {
      stopsToday,
      infringementsToday,
      activePursuits,
      vehiclesChecked,
      totalFines,
    };

    return NextResponse.json({ stats });
  } catch (error) {
    console.error("Failed to fetch highway stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch highway stats" },
      { status: 500 }
    );
  }
}
