import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, userId, title, message, type, data } = body;

    switch (action) {
      case 'send-notification':
        return await sendNotification(userId, title, message, type, data);
      case 'send-bulk-notification':
        return await sendBulkNotification(title, message, type, data);
      case 'schedule-notification':
        return await scheduleNotification(userId, title, message, type, data, body.scheduledAt);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function sendNotification(userId: string, title: string, message: string, type: string, data?: any) {
  try {
    // Bildirimi veritabanına kaydet
    const notification = await prisma.notification.create({
      data: {
        userId,
        title,
        message,
        type,
        data: data ? JSON.stringify(data) : null,
        isRead: false,
        sentAt: new Date()
      }
    });

    // Burada gerçek push notification servisi entegrasyonu yapılabilir
    // Örneğin: Firebase Cloud Messaging, OneSignal, vb.
    
    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification sent successfully'
    });

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

async function sendBulkNotification(title: string, message: string, type: string, data?: any) {
  try {
    // Tüm aktif kullanıcıları al
    const users = await prisma.user.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true
      }
    });

    // Toplu bildirim oluştur
    const notifications = await Promise.all(
      users.map(user => 
        prisma.notification.create({
          data: {
            userId: user.id,
            title,
            message,
            type,
            data: data ? JSON.stringify(data) : null,
            isRead: false,
            sentAt: new Date()
          }
        })
      )
    );

    return NextResponse.json({
      success: true,
      sentCount: notifications.length,
      message: `Bulk notification sent to ${notifications.length} users`
    });

  } catch (error) {
    console.error('Error sending bulk notification:', error);
    return NextResponse.json({ error: 'Failed to send bulk notification' }, { status: 500 });
  }
}

async function scheduleNotification(userId: string, title: string, message: string, type: string, data?: any, scheduledAt?: string) {
  try {
    if (!scheduledAt) {
      return NextResponse.json({ error: 'Scheduled time is required' }, { status: 400 });
    }

    const scheduledDate = new Date(scheduledAt);
    if (scheduledDate <= new Date()) {
      return NextResponse.json({ error: 'Scheduled time must be in the future' }, { status: 400 });
    }

    // Zamanlanmış bildirimi kaydet
    const notification = await prisma.scheduledNotification.create({
      data: {
        userId,
        title,
        message,
        type,
        data: data ? JSON.stringify(data) : null,
        scheduledAt: scheduledDate,
        isSent: false
      }
    });

    return NextResponse.json({
      success: true,
      notification,
      message: 'Notification scheduled successfully'
    });

  } catch (error) {
    console.error('Error scheduling notification:', error);
    return NextResponse.json({ error: 'Failed to schedule notification' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('userId');

    switch (action) {
      case 'get-user-notifications':
        return await getUserNotifications(userId || session.user.id);
      case 'get-notification-stats':
        return await getNotificationStats();
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function getUserNotifications(userId: string) {
  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        isRead: false
      },
      orderBy: {
        sentAt: 'desc'
      },
      take: 50
    });

    return NextResponse.json({
      success: true,
      notifications
    });

  } catch (error) {
    console.error('Error getting user notifications:', error);
    return NextResponse.json({ error: 'Failed to get notifications' }, { status: 500 });
  }
}

async function getNotificationStats() {
  try {
    const stats = await prisma.notification.groupBy({
      by: ['type'],
      _count: {
        id: true
      },
      where: {
        sentAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Son 30 gün
        }
      }
    });

    const totalNotifications = await prisma.notification.count({
      where: {
        sentAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const readNotifications = await prisma.notification.count({
      where: {
        isRead: true,
        sentAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        byType: stats,
        total: totalNotifications,
        read: readNotifications,
        unread: totalNotifications - readNotifications,
        readRate: totalNotifications > 0 ? (readNotifications / totalNotifications * 100).toFixed(1) : 0
      }
    });

  } catch (error) {
    console.error('Error getting notification stats:', error);
    return NextResponse.json({ error: 'Failed to get notification stats' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, notificationId, action } = body;

    if (!userId || !notificationId || !action) {
      return NextResponse.json(
        { error: 'User ID, notification ID and action are required' },
        { status: 400 }
      );
    }

    console.log('=== Update Notification API called ===');
    console.log('User ID:', userId);
    console.log('Notification ID:', notificationId);
    console.log('Action:', action);

    // User'ın var olup olmadığını kontrol et
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let updatedNotification;

    switch (action) {
      case 'mark_as_read':
        updatedNotification = await prisma.notification.update({
          where: { 
            id: notificationId,
            userId // Güvenlik için user ID kontrolü
          },
          data: { isRead: true }
        });
        break;

      case 'mark_all_as_read':
        await prisma.notification.updateMany({
          where: { userId },
          data: { isRead: true }
        });
        updatedNotification = { success: true };
        break;

      case 'delete':
        await prisma.notification.delete({
          where: { 
            id: notificationId,
            userId // Güvenlik için user ID kontrolü
          }
        });
        updatedNotification = { success: true };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    console.log('✅ Notification updated successfully');

    return NextResponse.json({
      success: true,
      notification: updatedNotification
    });
  } catch (error: any) {
    console.error('❌ Update notification error:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { error: 'Failed to update notification', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 