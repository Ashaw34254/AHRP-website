import { NextRequest, NextResponse } from 'next/server';
import { getDevSession } from '@/lib/dev-session';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getDevSession();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { citizenId, note } = await req.json();

    if (!citizenId || !note) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Add note to citizen's notes array
    const citizen = await prisma.citizen.findUnique({
      where: { id: citizenId },
    });

    if (!citizen) {
      return NextResponse.json({ error: 'Citizen not found' }, { status: 404 });
    }

    // Parse existing notes or initialize empty array
    const notes = citizen.notes ? JSON.parse(citizen.notes) : [];
    
    // Add new note with timestamp and officer info
    notes.push({
      text: note,
      officerId: session.user.id,
      officerName: session.user.name || 'Unknown Officer',
      createdAt: new Date().toISOString(),
    });

    // Update citizen with new notes
    const updatedCitizen = await prisma.citizen.update({
      where: { id: citizenId },
      data: { notes: JSON.stringify(notes) },
    });

    return NextResponse.json({
      success: true,
      citizen: updatedCitizen,
    });
  } catch (error) {
    console.error('Add note error:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
