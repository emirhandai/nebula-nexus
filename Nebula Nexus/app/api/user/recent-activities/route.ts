import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Kullanıcının aktivite loglarını getir
    const activities = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Aktivite logları yoksa, boş array döndür (fake aktivite oluşturma)
    if (activities.length === 0) {
      return NextResponse.json([]);
    }

    // Mevcut aktivite loglarını formatla
    const formattedActivities = activities.map(activity => ({
      id: activity.id,
      type: activity.type,
      title: activity.title,
      description: activity.description,
      icon: getActivityIcon(activity.type),
      color: getActivityColor(activity.type),
      timestamp: activity.createdAt
    }));

    return NextResponse.json(formattedActivities);

  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getActivityIcon(type: string): string {
  switch (type) {
    case 'test_completed':
      return 'TestTube';
    case 'field_selected':
      return 'Target';
    case 'course_completed':
      return 'BookOpen';
    case 'chat_session':
      return 'MessageSquare';
    case 'achievement_earned':
      return 'Trophy';
    default:
      return 'Activity';
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'test_completed':
      return 'text-green-400';
    case 'field_selected':
      return 'text-blue-400';
    case 'course_completed':
      return 'text-yellow-400';
    case 'chat_session':
      return 'text-purple-400';
    case 'achievement_earned':
      return 'text-orange-400';
    default:
      return 'text-gray-400';
  }
} 