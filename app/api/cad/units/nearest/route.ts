import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface LocationInput {
  latitude: number;
  longitude: number;
}

interface UnitDistance {
  id: string;
  callsign: string;
  department: string;
  status: string;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  distance: number;
  assignedOfficers: Array<{
    id: string;
    name: string;
    badge: string;
  }>;
}

function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  // Simple Euclidean distance for demo
  // In production, use Haversine formula for accurate geo distance
  const dx = lat2 - lat1;
  const dy = lon2 - lon1;
  return Math.sqrt(dx * dx + dy * dy);
}

export async function POST(request: Request) {
  try {
    const body: LocationInput = await request.json();
    const { latitude, longitude } = body;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      return NextResponse.json(
        { error: "Valid latitude and longitude required" },
        { status: 400 }
      );
    }

    // Get all available units with officers
    const units = await prisma.unit.findMany({
      where: {
        status: "AVAILABLE",
      },
      include: {
        officers: {
          select: {
            id: true,
            name: true,
            badge: true,
          },
        },
      },
    });

    // Calculate distances
    const unitsWithDistance: UnitDistance[] = units
      .map((unit) => {
        // Parse location string if it exists (expected format: "lat,lon")
        let unitLat: number | null = null;
        let unitLon: number | null = null;

        if (unit.location) {
          const parts = unit.location.split(",").map((s) => parseFloat(s.trim()));
          if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
            unitLat = parts[0];
            unitLon = parts[1];
          }
        }

        // If no valid location, assign max distance
        const distance =
          unitLat !== null && unitLon !== null
            ? calculateDistance(latitude, longitude, unitLat, unitLon)
            : Infinity;

        return {
          id: unit.id,
          callsign: unit.callsign,
          department: unit.department,
          status: unit.status,
          location: unit.location,
          latitude: unitLat,
          longitude: unitLon,
          distance,
          assignedOfficers: unit.officers,
        };
      })
      .filter((unit) => unit.distance !== Infinity)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Return top 5 nearest units

    return NextResponse.json({
      callLocation: { latitude, longitude },
      nearestUnits: unitsWithDistance,
    });
  } catch (error) {
    console.error("Error finding nearest units:", error);
    return NextResponse.json(
      { error: "Failed to find nearest units" },
      { status: 500 }
    );
  }
}
