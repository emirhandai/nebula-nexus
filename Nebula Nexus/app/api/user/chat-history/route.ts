import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's chat sessions with messages
    const chatSessions = await prisma.chatSession.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalSessions = await prisma.chatSession.count({
      where: { userId }
    });

    const response = {
      sessions: chatSessions.map(session => ({
        id: session.id,
        title: session.title || `Chat ${session.id.slice(-8)}`,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
        messageCount: session.messages.length,
        messages: session.messages.map(message => ({
          id: message.id,
          role: message.role,
          content: message.content,
          timestamp: message.timestamp,
          modelUsed: message.modelUsed,
          tokensUsed: message.tokensUsed
        }))
      })),
      pagination: {
        total: totalSessions,
        limit,
        offset,
        hasMore: offset + limit < totalSessions
      }
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      // Delete specific session
      await prisma.chatSession.deleteMany({
        where: {
          id: sessionId,
          userId
        }
      });
    } else {
      // Delete all sessions for user
      await prisma.chatSession.deleteMany({
        where: { userId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 