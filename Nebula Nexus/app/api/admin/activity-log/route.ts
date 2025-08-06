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
    const limit = parseInt(searchParams.get('limit') || '20');
    const action = searchParams.get('action') || '';

    const skip = (page - 1) * limit;

    const whereClause: any = {
      type: 'admin_action'
    };

    if (action) {
      whereClause.action = { contains: action, mode: 'insensitive' };
    }

    const [logs, total] = await Promise.all([
      prisma.activityLog.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          user: {
            select: {
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.activityLog.count({ where: whereClause })
    ]);

    return NextResponse.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin activity log API error:', error);
    return NextResponse.json(
      { error: 'Admin aktivite logları alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { action, details, targetId, targetType } = body;

    if (!action) {
      return NextResponse.json({ error: 'Aksiyon gerekli' }, { status: 400 });
    }

    // Get admin user ID
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nebulanexus.com' }
    });

    if (!adminUser) {
      return NextResponse.json({ error: 'Admin kullanıcı bulunamadı' }, { status: 404 });
    }

    // Create activity log
    const activityLog = await prisma.activityLog.create({
      data: {
        userId: adminUser.id,
        type: 'admin_action',
        action,
        details: details || '',
        metadata: {
          targetId,
          targetType,
          ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
          userAgent: request.headers.get('user-agent') || 'unknown'
        }
      }
    });

    return NextResponse.json({
      success: true,
      log: activityLog
    });

  } catch (error) {
    console.error('Admin activity log creation error:', error);
    return NextResponse.json(
      { error: 'Admin aktivite logu oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 