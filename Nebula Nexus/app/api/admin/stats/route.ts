import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';
import { isAdminSession } from '../../../../lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    // Get total users
    const totalUsers = await prisma.user.count();

    // Get users who completed tests
    const usersWithTests = await prisma.user.count({
      where: {
        oceanResults: {
          some: {}
        }
      }
    });

    // Get users who selected fields
    const usersWithFields = await prisma.user.count({
      where: {
        selectedField: {
          not: null
        }
      }
    });

    // Get total chat sessions
    const totalChatSessions = await prisma.chatSession.count();

    // Get total courses in progress (placeholder - courseProgress model removed)
    const totalCoursesInProgress = 0;

    // Get completed courses (placeholder - courseProgress model removed)
    const completedCourses = 0;

    // Get field distribution
    const fieldStats = await prisma.user.groupBy({
      by: ['selectedField'],
      where: {
        selectedField: {
          not: null
        }
      },
      _count: {
        selectedField: true
      }
    });

    // Get recent registrations (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);

    const recentRegistrations = await prisma.user.count({
      where: {
        createdAt: {
          gte: lastWeek
        }
      }
    });

    // Get active users (users with activity in last 30 days)
    const lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() - 30);

    const activeUsers = await prisma.user.count({
      where: {
        OR: [
          {
                                                  oceanResults: {
               some: {
                 testDate: {
                   gte: lastMonth
                 }
               }
             }
          },
          {
            chatSessions: {
              some: {
                createdAt: {
                  gte: lastMonth
                }
              }
            }
          },
          // courseProgress model removed from schema
        ]
      }
    });

    // Calculate completion rates
    const testCompletionRate = totalUsers > 0 ? (usersWithTests / totalUsers) * 100 : 0;
    const fieldSelectionRate = totalUsers > 0 ? (usersWithFields / totalUsers) * 100 : 0;
    const courseCompletionRate = totalCoursesInProgress + completedCourses > 0 
      ? (completedCourses / (totalCoursesInProgress + completedCourses)) * 100 
      : 0;

    const stats = {
      totalUsers,
      usersWithTests,
      usersWithFields,
      totalChatSessions,
      totalCoursesInProgress,
      completedCourses,
      recentRegistrations,
      activeUsers,
      testCompletionRate: Math.round(testCompletionRate * 100) / 100,
      fieldSelectionRate: Math.round(fieldSelectionRate * 100) / 100,
      courseCompletionRate: Math.round(courseCompletionRate * 100) / 100,
      fieldDistribution: fieldStats.map(stat => ({
        field: stat.selectedField,
        count: stat._count.selectedField
      }))
    };

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Admin Stats API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 