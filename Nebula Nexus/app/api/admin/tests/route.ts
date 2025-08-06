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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId') || '';
    const dateFrom = searchParams.get('dateFrom') || '';
    const dateTo = searchParams.get('dateTo') || '';

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (userId) {
      whereClause.userId = userId;
    }
    if (dateFrom || dateTo) {
      whereClause.testDate = {};
      if (dateFrom) {
        whereClause.testDate.gte = new Date(dateFrom);
      }
      if (dateTo) {
        whereClause.testDate.lte = new Date(dateTo);
      }
    }

    const [results, total] = await Promise.all([
      prisma.oceanResult.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { testDate: 'desc' }
      }),
      prisma.oceanResult.count({ where: whereClause })
    ]);

    // İstatistikler
    const stats = await prisma.oceanResult.aggregate({
      where: whereClause,
      _avg: {
        openness: true,
        conscientiousness: true,
        extraversion: true,
        agreeableness: true,
        neuroticism: true
      },
      _count: true
    });

    return NextResponse.json({
      results,
      stats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin tests API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const resultId = searchParams.get('resultId');

    if (!resultId) {
      return NextResponse.json({ error: 'Test sonucu ID gerekli' }, { status: 400 });
    }

    await prisma.oceanResult.delete({
      where: { id: resultId }
    });

    return NextResponse.json({ message: 'Test sonucu başarıyla silindi' });
  } catch (error) {
    console.error('Admin test delete error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 