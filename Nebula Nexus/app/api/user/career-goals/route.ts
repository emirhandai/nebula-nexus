import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Get career goals for the user
    const goals = await prisma.careerGoal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching career goals:', error);
    return NextResponse.json({ error: 'Failed to fetch career goals' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, title, description, targetDate, progress = 0, status = 'active' } = await request.json();

    if (!userId || !title || !description || !targetDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newGoal = await prisma.careerGoal.create({
      data: {
        userId,
        title,
        description,
        targetDate: new Date(targetDate),
        progress,
        status
      }
    });

    return NextResponse.json(newGoal);
  } catch (error) {
    console.error('Error creating career goal:', error);
    return NextResponse.json({ error: 'Failed to create career goal' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, title, description, targetDate, progress, status } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (targetDate !== undefined) updateData.targetDate = new Date(targetDate);
    if (progress !== undefined) updateData.progress = progress;
    if (status !== undefined) updateData.status = status;

    const updatedGoal = await prisma.careerGoal.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json(updatedGoal);
  } catch (error) {
    console.error('Error updating career goal:', error);
    return NextResponse.json({ error: 'Failed to update career goal' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    await prisma.careerGoal.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Career goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting career goal:', error);
    return NextResponse.json({ error: 'Failed to delete career goal' }, { status: 500 });
  }
} 