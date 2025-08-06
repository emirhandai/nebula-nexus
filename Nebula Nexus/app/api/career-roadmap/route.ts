import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const category = searchParams.get('category');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const whereClause: any = { userId };
    if (category) {
      whereClause.category = category;
    }

    const roadmaps = await prisma.careerRoadmap.findMany({
      where: whereClause,
      include: {
        milestones: {
          orderBy: { order: 'asc' }
        },
        courses: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(roadmaps);

  } catch (error) {
    console.error('Career Roadmap API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      title, 
      description, 
      category, 
      difficulty, 
      duration, 
      salary, 
      demand, 
      skills 
    } = body;

    if (!userId || !title || !category) {
      return NextResponse.json(
        { error: 'User ID, title, and category are required' },
        { status: 400 }
      );
    }

    const roadmap = await prisma.careerRoadmap.create({
      data: {
        userId,
        title,
        description: description || '',
        category,
        difficulty: difficulty || 'beginner',
        duration: duration || '6-12 months',
        salary: salary || '₺25,000 - ₺45,000',
        demand: demand || 'medium',
        skills: skills ? JSON.stringify(skills) : '[]'
      }
    });

    return NextResponse.json(roadmap);

  } catch (error) {
    console.error('Create Career Roadmap API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadmapId, updates } = body;

    if (!roadmapId || !updates) {
      return NextResponse.json(
        { error: 'Roadmap ID and updates are required' },
        { status: 400 }
      );
    }

    const roadmap = await prisma.careerRoadmap.update({
      where: { id: roadmapId },
      data: updates
    });

    return NextResponse.json(roadmap);

  } catch (error) {
    console.error('Update Career Roadmap API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roadmapId = searchParams.get('id');

    if (!roadmapId) {
      return NextResponse.json(
        { error: 'Roadmap ID is required' },
        { status: 400 }
      );
    }

    await prisma.careerRoadmap.delete({
      where: { id: roadmapId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete Career Roadmap API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 