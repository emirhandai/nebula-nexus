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

    const courses = await prisma.course.findMany({
      where: { roadmapId },
      orderBy: { order: 'asc' }
    });

    return NextResponse.json(courses);

  } catch (error) {
    console.error('Courses API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { roadmapId, title, platform, duration, price, rating, url, order } = body;

    if (!roadmapId || !title || !platform) {
      return NextResponse.json(
        { error: 'Roadmap ID, title, and platform are required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        roadmapId,
        title,
        platform,
        duration: duration || 'Unknown',
        price: price || 'Free',
        rating: rating || 0,
        url: url || null,
        order: order || 0
      }
    });

    return NextResponse.json(course);

  } catch (error) {
    console.error('Create Course API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { courseId, updates } = body;

    if (!courseId || !updates) {
      return NextResponse.json(
        { error: 'Course ID and updates are required' },
        { status: 400 }
      );
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: updates
    });

    return NextResponse.json(course);

  } catch (error) {
    console.error('Update Course API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('id');

    if (!courseId) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      );
    }

    await prisma.course.delete({
      where: { id: courseId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete Course API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 