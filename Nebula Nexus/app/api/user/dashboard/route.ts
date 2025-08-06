import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Get user data
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 5
        },
        chatSessions: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            messages: {
              take: 1,
              orderBy: { timestamp: 'desc' }
            }
          }
        },
        careerRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        preferences: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const testsCompleted = user.oceanResults.length;
    const aiChats = user.chatSessions.length;
    
    // Calculate total time spent (simulated based on test count and chat sessions)
    const totalMinutes = (testsCompleted * 15) + (aiChats * 8); // 15 min per test, 8 min per chat
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const totalTime = `${hours}h ${minutes}m`;
    
    // Calculate accuracy based on test completion rate
    const accuracy = testsCompleted > 0 ? Math.min(95, 70 + (testsCompleted * 5)) : 0;

    // Get recent activities
    const recentActivities = [
      ...user.oceanResults.map(result => ({
        id: result.id,
        type: 'test' as const,
        title: 'OCEAN Testi Tamamlandı',
        description: `Test skorunuz: Açıklık ${result.openness}, Sorumluluk ${result.conscientiousness}`,
        timestamp: result.testDate,
        icon: 'Brain'
      })),
      ...user.chatSessions.map(session => ({
        id: session.id,
        type: 'chat' as const,
        title: 'AI Sohbet',
        description: session.title || 'AI ile sohbet başlatıldı',
        timestamp: session.createdAt,
        icon: 'MessageSquare'
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10)
    .map(activity => ({
      ...activity,
      timestamp: formatTimeAgo(new Date(activity.timestamp))
    }));

    // Get career recommendations
    const careerRecommendations = user.careerRecommendations.map(rec => ({
      id: rec.id,
      field: rec.field,
      confidence: rec.confidence,
      reasoning: rec.reasoning,
      createdAt: formatTimeAgo(rec.createdAt)
    }));

    // Enhanced stats calculation
    const averageScore = user.oceanResults.length > 0 
      ? user.oceanResults.reduce((sum, result) => 
          sum + (result.openness + result.conscientiousness + result.extraversion + result.agreeableness + result.neuroticism) / 5, 0) / user.oceanResults.length
      : 0;

    const totalMessages = user.chatSessions.reduce((sum, session) => sum + (session.messages?.length || 0), 0);
    const activeDays = new Set(user.oceanResults.map(r => r.testDate.toDateString())).size;
    const completionRate = user.oceanResults.length > 0 ? Math.round((user.oceanResults.filter(r => r.questionsAnswered >= 40).length / user.oceanResults.length) * 100) : 0;

    const stats = {
      testsCompleted,
      aiChats,
      totalTime,
      accuracy,
      averageScore: Math.round(averageScore * 10) / 10,
      totalMessages,
      activeDays,
      completionRate,
      totalPoints: testsCompleted * 100 + aiChats * 50,
      level: Math.floor((testsCompleted + aiChats) / 5) + 1
    };

    const userData = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.image,
        joinDate: formatTimeAgo(user.createdAt),
        lastActive: formatTimeAgo(user.updatedAt)
      },
      preferences: user.preferences || {
        theme: 'light',
        language: 'tr',
        emailNotifications: true,
        pushNotifications: true,
        shareResults: false
      },
      recentActivities,
      careerRecommendations
    };

    return NextResponse.json({
      stats,
      userData
    });
  } catch (error) {
    console.error('Error fetching user dashboard data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user dashboard data' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Az önce';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} dakika önce`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} saat önce`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} gün önce`;
  }
} 