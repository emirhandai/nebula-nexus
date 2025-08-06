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

    // Calculate date range
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

    // Get current field distribution
    const currentFieldStats = await prisma.user.groupBy({
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

    // Get previous period field distribution for growth calculation
    const previousStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    
    const previousFieldStats = await prisma.user.groupBy({
      by: ['selectedField'],
      where: {
        selectedField: {
          not: null
        },
        createdAt: {
          gte: previousStartDate,
          lt: startDate
        }
      },
      _count: {
        selectedField: true
      }
    });

    // Calculate total users
    const totalUsers = currentFieldStats.reduce((sum, stat) => sum + stat._count.selectedField, 0);
    const previousTotalUsers = previousFieldStats.reduce((sum, stat) => sum + stat._count.selectedField, 0);

    // Create field statistics with growth calculation
    const fieldStats = currentFieldStats.map(currentStat => {
      const field = currentStat.selectedField || 'Belirtilmemiş';
      const currentCount = currentStat._count.selectedField;
      const percentage = totalUsers > 0 ? Math.round((currentCount / totalUsers) * 100 * 10) / 10 : 0;
      
      // Find previous count for growth calculation
      const previousStat = previousFieldStats.find(stat => stat.selectedField === field);
      const previousCount = previousStat ? previousStat._count.selectedField : 0;
      
      // Calculate growth percentage
      let growth = 0;
      if (previousCount > 0) {
        growth = Math.round(((currentCount - previousCount) / previousCount) * 100 * 10) / 10;
      } else if (currentCount > 0) {
        growth = 100; // New field
      }

      return {
        field,
        users: currentCount,
        percentage,
        growth
      };
    });

    // Sort by percentage (descending)
    fieldStats.sort((a, b) => b.percentage - a.percentage);

    // Add "Other" category for fields with less than 5% share
    const otherFields = fieldStats.filter(stat => stat.percentage < 5);
    const mainFields = fieldStats.filter(stat => stat.percentage >= 5);

    if (otherFields.length > 0) {
      const otherStats = {
        field: 'Diğer',
        users: otherFields.reduce((sum, stat) => sum + stat.users, 0),
        percentage: Math.round(otherFields.reduce((sum, stat) => sum + stat.percentage, 0) * 10) / 10,
        growth: Math.round(otherFields.reduce((sum, stat) => sum + stat.growth, 0) / otherFields.length * 10) / 10
      };
      
      mainFields.push(otherStats);
    }

    return NextResponse.json({
      success: true,
      fieldStats: mainFields,
      totalUsers,
      timeRange,
      period: {
        current: { start: startDate.toISOString(), end: now.toISOString() },
        previous: { start: previousStartDate.toISOString(), end: startDate.toISOString() }
      }
    });

  } catch (error) {
    console.error('Field stats API error:', error);
    return NextResponse.json(
      { error: 'Alan istatistikleri alınırken hata oluştu' },
      { status: 500 }
    );
  }
} 