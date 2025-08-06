import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Delete all career roadmaps for the user (cascade will handle milestones and courses)
    const deletedCount = await prisma.careerRoadmap.deleteMany({
      where: { userId }
    });

    console.log(`✅ Deleted ${deletedCount.count} career roadmaps for user ${userId}`);

    return NextResponse.json({
      success: true,
      message: `${deletedCount.count} kariyer yolu silindi`,
      deletedCount: deletedCount.count
    });

  } catch (error: any) {
    console.error('Error clearing roadmaps:', error);
    return NextResponse.json(
      { error: 'Failed to clear roadmaps', details: error?.message },
      { status: 500 }
    );
  }
} 