import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, description, data } = body;

    if (!userId || !type || !title || !description) {
      return NextResponse.json(
        { error: 'User ID, type, title, and description are required' },
        { status: 400 }
      );
    }

    // Activity log oluştur
    const activityLog = await prisma.activityLog.create({
      data: {
        userId,
        type,
        title,
        description,
        data: data ? JSON.stringify(data) : null
      }
    });

    return NextResponse.json({
      success: true,
      activityLog
    });

  } catch (error) {
    console.error('Error creating activity log:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const activityLogs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(activityLogs);

  } catch (error) {
    console.error('Error fetching activity logs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 