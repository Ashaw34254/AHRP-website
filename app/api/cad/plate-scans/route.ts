import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/cad/plate-scans - Get plate scan history
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const plate = searchParams.get('plate');
    const officerId = searchParams.get('officerId');
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (plate) where.plate = { contains: plate };
    if (officerId) where.officerId = officerId;

    const scans = await prisma.plateScan.findMany({
      where,
      include: {
        officer: true,
        vehicle: true,
      },
      orderBy: { scannedAt: 'desc' },
      take: limit,
    });

    return NextResponse.json(scans);
  } catch (error) {
    console.error('Error fetching plate scans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plate scans' },
      { status: 500 }
    );
  }
}

// POST /api/cad/plate-scans - Log a new plate scan
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { plate, officerId, unitId, camera, location, result } = body;

    if (!plate || !officerId) {
      return NextResponse.json(
        { error: 'Plate and officerId are required' },
        { status: 400 }
      );
    }

    // Create plate scan log
    const scan = await prisma.plateScan.create({
      data: {
        plate: plate.toUpperCase(),
        officerId,
        unitId,
        camera: camera || 'manual',
        location,
        result: result || 'CHECKED',
        scannedAt: new Date(),
      },
      include: {
        officer: true,
        vehicle: true,
      },
    });

    // Log BOLO/stolen hits
    if (result === 'BOLO_HIT' || result === 'STOLEN') {
      console.log(`ALPR alert: ${plate} - ${result} at ${location}`);
    }

    return NextResponse.json(scan, { status: 201 });
  } catch (error) {
    console.error('Error logging plate scan:', error);
    return NextResponse.json(
      { error: 'Failed to log plate scan' },
      { status: 500 }
    );
  }
}
