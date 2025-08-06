import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const type = searchParams.get('type') || 'received'; // 'sent' or 'received'
    const isRead = searchParams.get('isRead');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const whereClause: any = {
      isDeleted: false
    };

    if (type === 'sent') {
      whereClause.senderId = userId;
    } else {
      whereClause.receiverId = userId;
    }

    if (isRead !== null && isRead !== undefined) {
      whereClause.isRead = isRead === 'true';
    }

    const [messages, total] = await Promise.all([
      prisma.message.findMany({
        where: whereClause,
        include: {
          sender: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          receiver: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          project: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.message.count({ where: whereClause })
    ]);

    // Get unread count
    const unreadCount = await prisma.message.count({
      where: {
        receiverId: userId,
        isRead: false,
        isDeleted: false
      }
    });

    return NextResponse.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      unreadCount
    });
  } catch (error) {
    console.error('Messages API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, subject, content, projectId } = body;

    if (!senderId || !receiverId || !subject || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    });

    if (!receiver) {
      return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        subject,
        content,
        projectId: projectId || null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        receiver: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        project: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'chat_message',
        title: 'Yeni Mesaj',
        message: `${message.sender.name} size mesaj gönderdi: ${subject}`,
        data: JSON.stringify({
          messageId: message.id,
          senderId: senderId,
          projectId: projectId
        })
      }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 