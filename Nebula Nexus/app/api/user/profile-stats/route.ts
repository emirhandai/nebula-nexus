import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { authOptions } from '../../auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

              const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const targetUserId = searchParams.get('userId') || userId;

    // Get user profile with related data
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      include: {
        oceanResults: true,
        chatSessions: true,
        achievements: true,
        activityLogs: true,
        careerRecommendations: true,
        progressTracking: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Calculate statistics
    const totalTests = user.oceanResults.length;
    const totalChatSessions = user.chatSessions.length;
    const completedCourses = user.progressTracking.filter(cp => cp.isCompleted).length;
    const totalAchievements = user.achievements.length;
    
    // Calculate average test scores
    const averageTestScore = totalTests > 0 
      ? user.oceanResults.reduce((sum, test) => {
          const avgScore = (test.openness + test.conscientiousness + test.extraversion + test.agreeableness + test.neuroticism) / 5;
          return sum + avgScore;
        }, 0) / totalTests 
      : 0;

    // Get recent activity
    const recentActivity = user.activityLogs
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);

    // Calculate level and experience (mock calculation based on activities)
    const totalExperience = totalTests * 50 + totalChatSessions * 10 + completedCourses * 100 + totalAchievements * 25;
    const level = Math.floor(totalExperience / 100) + 1;
    const experienceToNextLevel = 100 - (totalExperience % 100);

    const stats = {
      testsCompleted: totalTests,
      totalChats: totalChatSessions,
      averageScore: Math.round(averageTestScore * 100) / 100,
      completionRate: totalTests > 0 ? Math.round((completedCourses / totalTests) * 100) : 0,
      activeDays: Math.ceil((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)),
      totalTime: `${Math.floor(totalExperience / 60)} saat`,
      achievements: totalAchievements,
      recommendations: user.careerRecommendations.length,
      level,
      experiencePoints: totalExperience,
      experienceToNextLevel,
      recentActivity: recentActivity.map(activity => ({
        id: activity.id,
        type: activity.type,
        description: activity.description,
        createdAt: activity.createdAt,
        data: activity.data ? JSON.parse(activity.data) : null
      })),
      lastActive: user.updatedAt,
      joinDate: user.createdAt
    };

    return NextResponse.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching user profile stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 