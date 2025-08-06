import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const activities: any[] = [];

    // Get recent user registrations
    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(limit / 4)
    });

    recentUsers.forEach(user => {
      activities.push({
        id: `user_${user.id}`,
        type: 'user_registration',
        title: 'Yeni Kullanıcı Kaydı',
        description: `${user.name || user.email} sisteme kayıt oldu`,
        timestamp: user.createdAt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        severity: 'info'
      });
    });

    // Get recent test completions
    const recentTests = await prisma.oceanResult.findMany({
      select: {
        id: true,
        completedAt: true,
        userId: true
      },
      orderBy: { completedAt: 'desc' },
      take: Math.floor(limit / 4)
    });

    // Get user details for tests
    const testUsers = await prisma.user.findMany({
      where: {
        id: { in: recentTests.map(test => test.userId) }
      },
      select: {
        id: true,
        name: true,
        email: true
      }
    });

    const userMap = new Map(testUsers.map(user => [user.id, user]));

    recentTests.forEach(test => {
      const user = userMap.get(test.userId);
      if (user) {
        activities.push({
          id: `test_${test.id}`,
          type: 'test_completion',
          title: 'OCEAN Testi Tamamlandı',
          description: `${user.name || user.email} kişilik testini tamamladı`,
          timestamp: test.completedAt,
          user: user,
          severity: 'success'
        });
      }
    });

    // Get recent chat sessions
    const recentChats = await prisma.chatSession.findMany({
      select: {
        id: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: Math.floor(limit / 4)
    });

    recentChats.forEach(chat => {
      activities.push({
        id: `chat_${chat.id}`,
        type: 'chat_session',
        title: 'AI Chat Oturumu',
        description: `${chat.user.name || chat.user.email} AI ile konuştu`,
        timestamp: chat.createdAt,
        user: chat.user,
        severity: 'info'
      });
    });

    // Sort all activities by timestamp
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Return limited results
    return NextResponse.json(activities.slice(0, limit));

  } catch (error) {
    console.error('Recent Activity API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 