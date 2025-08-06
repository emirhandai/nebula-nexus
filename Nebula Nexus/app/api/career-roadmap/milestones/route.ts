import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('roadmapId');

    if (!roadmapId) {
      return NextResponse.json(
        { error: 'Roadmap ID is required' },
        { status: 400 }
      );
    }

    const milestones = await prisma.milestone.findMany({
      where: { roadmapId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(milestones);

  } catch (error) {
    console.error('Milestones API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadmapId, title, description, priority, dueDate, order } = body;

    if (!roadmapId || !title) {
      return NextResponse.json(
        { error: 'Roadmap ID and title are required' },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.create({
      data: {
        roadmapId,
        title,
        description: description || '',
        priority: priority || 'medium',
        dueDate: dueDate ? new Date(dueDate) : null,
        order: order || 0
      }
    });

    return NextResponse.json(milestone);

  } catch (error) {
    console.error('Create Milestone API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { milestoneId, updates } = body;

    if (!milestoneId || !updates) {
      return NextResponse.json(
        { error: 'Milestone ID and updates are required' },
        { status: 400 }
      );
    }

    const milestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: updates
    });

    return NextResponse.json(milestone);

  } catch (error) {
    console.error('Update Milestone API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get('id');

    if (!milestoneId) {
      return NextResponse.json(
        { error: 'Milestone ID is required' },
        { status: 400 }
      );
    }

    await prisma.milestone.delete({
      where: { id: milestoneId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete Milestone API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 