import { NextRequest, NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getDevSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { citizenId, plate, model, color, year } = await req.json();

    if (!citizenId || !plate || !model || !color) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create vehicle record
    const vehicle = await prisma.vehicle.create({
      data: {
        plate: plate.toUpperCase(),
        model,
        color,
        year: year ? parseInt(year) : null,
        ownerId: citizenId,
        isStolen: false,
      },
    });

    return NextResponse.json({
      success: true,
      vehicle,
    });
  } catch (error) {
    console.error('Add vehicle error:', error);
    return NextResponse.json(
      { error: 'Failed to add vehicle' },
      { status: 500 }
    );
  }
}
