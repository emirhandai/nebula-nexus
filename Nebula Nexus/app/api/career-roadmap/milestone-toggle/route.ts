import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathId, milestoneId, userId } = body;

    if (!pathId || !milestoneId || !userId) {
      return NextResponse.json(
        { error: 'Path ID, Milestone ID, and User ID are required' },
        { status: 400 }
      );
    }

    // Get current milestone status
    const milestone = await prisma.milestone.findFirst({
      where: { 
        id: milestoneId,
        roadmap: { userId, id: pathId }
      }
    });

    if (!milestone) {
      return NextResponse.json(
        { error: 'Milestone not found' },
        { status: 404 }
      );
    }

    // Toggle milestone completion status
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { isCompleted: !milestone.isCompleted }
    });

    // Calculate new progress for the roadmap
    const allMilestones = await prisma.milestone.findMany({
      where: { roadmapId: pathId }
    });

    const completedCount = allMilestones.filter(m => m.isCompleted).length;
    const progress = Math.round((completedCount / allMilestones.length) * 100);

    // Update roadmap progress
    const updatedRoadmap = await prisma.careerRoadmap.update({
      where: { id: pathId },
      data: {
        progress: progress,
        isCompleted: progress === 100
      }
    });

    return NextResponse.json({
      success: true,
      milestone: updatedMilestone,
      roadmap: updatedRoadmap,
      progress: progress
    });

  } catch (error: any) {
    console.error('Error toggling milestone:', error);
    return NextResponse.json(
      { error: 'Failed to toggle milestone', details: error?.message },
      { status: 500 }
    );
  }
} 