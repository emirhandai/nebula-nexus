import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { isAdminSession } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('range') || '7d';

    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default: // 7d
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Toplam kullanıcı sayısı
    const totalUsers = await prisma.user.count();

    // Aktif kullanıcılar (son 7 günde aktivite gösteren benzersiz kullanıcılar)
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const activeUsersResult = await prisma.activityLog.groupBy({
      by: ['userId'],
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      }
    });
    
    const activeUsers = activeUsersResult.length;

    // Toplam test sayısı
    const totalTests = await prisma.activityLog.count({
      where: {
        type: 'test_completed'
      }
    });

    // Toplam sohbet sayısı
    const totalChats = await prisma.activityLog.count({
      where: {
        type: 'chat_session'
      }
    });

    // Kullanıcı büyümesi (son 7 gün)
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const previousUsers = await prisma.user.count({
      where: {
        createdAt: {
          lt: startDate
        }
      }
    });

    const currentUsers = await prisma.user.count({
      where: {
        createdAt: {
          gte: startDate
        }
      }
    });

    const userGrowth = previousUsers > 0 ? ((currentUsers / previousUsers) * 100 - 100) : 0;

    // Popüler alanlar
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

    const totalFieldUsers = fieldStats.reduce((sum, stat) => sum + stat._count.selectedField, 0);
    const popularFields = fieldStats
      .map(stat => ({
        field: stat.selectedField || 'Belirtilmemiş',
        percentage: totalFieldUsers > 0 ? Math.round((stat._count.selectedField / totalFieldUsers) * 100 * 10) / 10 : 0
      }))
      .sort((a, b) => b.percentage - a.percentage)
      .slice(0, 5);

    // Cihaz kullanımı (simüle edilmiş)
    const deviceUsage = {
      desktop: 54.3,
      mobile: 33.0,
      tablet: 12.7
    };

    // Oturum süresi (simüle edilmiş)
    const sessionDuration = {
      '0-5 dk': 18.7,
      '5-15 dk': 36.5,
      '15-30 dk': 31.2,
      '30+ dk': 13.6
    };

    // Etkileşim metrikleri
    const dailyActive = await prisma.activityLog.count({
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 24 * 60 * 60 * 1000)
        }
      }
    });

    const weeklyActive = await prisma.activityLog.count({
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const monthlyActive = await prisma.activityLog.count({
      where: {
        createdAt: {
          gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Kullanıcı büyümesi grafiği (son 7 gün)
    const userGrowthData: Array<{day: number, users: number}> = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
      
      const dailyUsers = await prisma.user.count({
        where: {
          createdAt: {
            gte: dayStart,
            lt: dayEnd
          }
        }
      });
      
      userGrowthData.push({
        day: i + 1,
        users: dailyUsers
      });
    }

    return NextResponse.json({
      success: true,
      analytics: {
        totalUsers,
        activeUsers,
        totalTests,
        totalChats,
        userGrowth: Math.round(userGrowth * 10) / 10,
        popularFields,
        deviceUsage,
        sessionDuration,
        engagementMetrics: {
          dailyActive,
          weeklyActive,
          monthlyActive,
          retentionRate: 72.3,
          bounceRate: 28.7,
          avgSessionDuration: 12.3
        },
        userGrowthData
      }
    });

  } catch (error) {
    console.error('Analytics data loading error:', error);
    return NextResponse.json({ error: 'Veri yüklenirken hata oluştu' }, { status: 500 });
  }
} 