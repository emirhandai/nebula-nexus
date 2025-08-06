import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pathId, courseId, userId } = body;

    if (!pathId || !courseId || !userId) {
      return NextResponse.json(
        { error: 'Path ID, Course ID, and User ID are required' },
        { status: 400 }
      );
    }

    // Get current course status
    const course = await prisma.course.findFirst({
      where: { 
        id: courseId,
        roadmap: { userId, id: pathId }
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    // Toggle course completion status
    const updatedCourse = await prisma.course.update({
      where: { id: courseId },
      data: { isCompleted: !course.isCompleted }
    });

    return NextResponse.json({
      success: true,
      course: updatedCourse
    });

  } catch (error: any) {
    console.error('Error toggling course:', error);
    return NextResponse.json(
      { error: 'Failed to toggle course', details: error?.message },
      { status: 500 }
    );
  }
} 