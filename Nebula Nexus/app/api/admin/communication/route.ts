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
    const type = searchParams.get('type') || '';
    const isRead = searchParams.get('isRead') || '';

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (type) {
      whereClause.type = type;
    }
    if (isRead !== '') {
      whereClause.isRead = isRead === 'true';
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
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
        orderBy: { createdAt: 'desc' }
      }),
      prisma.notification.count({ where: whereClause })
    ]);

    // Bildirim istatistikleri
    const stats = await prisma.notification.groupBy({
      by: ['type', 'isRead'],
      _count: true
    });

    // Okunmamış bildirim sayısı
    const unreadCount = await prisma.notification.count({
      where: { isRead: false }
    });

    return NextResponse.json({
      notifications,
      stats,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin communication API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { type, title, message, userIds, data } = body;

    if (!type || !title || !message) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    let notifications: any[] = [];

    if (userIds && userIds.length > 0) {
      // Belirli kullanıcılara bildirim gönder
      notifications = await Promise.all(
        userIds.map((userId: string) =>
          prisma.notification.create({
            data: {
              userId,
              type,
              title,
              message,
              data: data ? JSON.stringify(data) : null
            }
          })
        )
      );
    } else {
      // Tüm kullanıcılara bildirim gönder
      const users = await prisma.user.findMany({
        select: { id: true }
      });

      notifications = await Promise.all(
        users.map(user =>
          prisma.notification.create({
            data: {
              userId: user.id,
              type,
              title,
              message,
              data: data ? JSON.stringify(data) : null
            }
          })
        )
      );
    }

    return NextResponse.json({ 
      message: `${notifications.length} bildirim gönderildi`,
      notifications 
    });
  } catch (error) {
    console.error('Admin notification create error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, updates } = body;

    if (!notificationId || !updates) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    const allowedUpdates = ['title', 'message', 'isRead', 'data'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'data') {
          filteredUpdates[key] = JSON.stringify(updates[key]);
        } else {
          filteredUpdates[key] = updates[key];
        }
      }
    });

    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: filteredUpdates,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ notification: updatedNotification });
  } catch (error) {
    console.error('Admin notification update error:', error);
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
    const notificationId = searchParams.get('notificationId');

    if (!notificationId) {
      return NextResponse.json({ error: 'Bildirim ID gerekli' }, { status: 400 });
    }

    await prisma.notification.delete({
      where: { id: notificationId }
    });

    return NextResponse.json({ message: 'Bildirim başarıyla silindi' });
  } catch (error) {
    console.error('Admin notification delete error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 