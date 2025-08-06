import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit
    });

    return NextResponse.json(notifications);

  } catch (error) {
    console.error('Notifications API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, type, title, message, data } = body;

    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'User ID, type, title, and message are required' },
        { status: 400 }
      );
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data: data ? JSON.stringify(data) : null
      }
    });

    return NextResponse.json(notification);

  } catch (error) {
    console.error('Create Notification API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, action } = body;

    if (!notificationId || !action) {
      return NextResponse.json(
        { error: 'Notification ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'mark_read':
        result = await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: true }
        });
        break;

      case 'mark_unread':
        result = await prisma.notification.update({
          where: { id: notificationId },
          data: { isRead: false }
        });
        break;

      case 'delete':
        result = await prisma.notification.delete({
          where: { id: notificationId }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Update Notification API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Bulk actions
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, action, notificationIds } = body;

    if (!userId || !action) {
      return NextResponse.json(
        { error: 'User ID and action are required' },
        { status: 400 }
      );
    }

    let result;

    switch (action) {
      case 'mark_all_read':
        result = await prisma.notification.updateMany({
          where: { 
            userId,
            isRead: false
          },
          data: { isRead: true }
        });
        break;

      case 'delete_multiple':
        if (!notificationIds || !Array.isArray(notificationIds)) {
          return NextResponse.json(
            { error: 'Notification IDs array is required' },
            { status: 400 }
          );
        }
        result = await prisma.notification.deleteMany({
          where: { 
            id: { in: notificationIds },
            userId
          }
        });
        break;

      case 'clear_all':
        result = await prisma.notification.deleteMany({
          where: { userId }
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Bulk Notification API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 