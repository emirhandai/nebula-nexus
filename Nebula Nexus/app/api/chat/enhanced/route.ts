import { NextRequest, NextResponse } from 'next/server';
import { chatWithAI } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';
import { chatMessageSchema, sanitizers, handleValidationError } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Input validation
    console.log('Received body:', body);
    const validationResult = chatMessageSchema.safeParse(body);
    if (!validationResult.success) {
      console.error('Validation error:', validationResult.error);
      return NextResponse.json(
        { error: handleValidationError(validationResult.error) },
        { status: 400 }
      );
    }

    const { message, userId, sessionId, selectedField, category } = validationResult.data;

    // Additional sanitization
    const sanitizedMessage = sanitizers.message(message);
    const sanitizedUserId = sanitizers.name(userId);

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { id: sanitizedUserId },
      select: { 
        id: true, 
        selectedField: true, 
        isActive: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: 'Hesabınız aktif değil' },
        { status: 403 }
      );
    }

    // Check if user has selected a field
    if (!user.selectedField && !selectedField) {
      return NextResponse.json(
        { error: 'Kullanıcı bir kariyer alanı seçmeli' },
        { status: 403 }
      );
    }

    // Get or create chat session
    let currentSessionId = sessionId;
    if (!currentSessionId) {
      const newSession = await prisma.chatSession.create({
        data: {
          userId: sanitizedUserId,
          title: sanitizedMessage.substring(0, 50) + '...',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
      currentSessionId = newSession.id;
    }

    // Save user message
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        content: sanitizedMessage,
        role: 'user',
        timestamp: new Date()
      }
    });

    // Enhanced context with test results and field information
    const enhancedContext = {
      selectedField: selectedField || user.selectedField || undefined,
      category: category || 'casual',
      userType: 'software_developer',
      focus: 'career_guidance',
      messageType: 'general',
      field: selectedField || user.selectedField || undefined
    };

    // Get AI response
    const aiResponse = await chatWithAI(sanitizedMessage, enhancedContext);

    // Save AI response
    const aiMessage = await prisma.chatMessage.create({
      data: {
        sessionId: currentSessionId,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }
    });

    // Update session
    await prisma.chatSession.update({
      where: { id: currentSessionId },
      data: { updatedAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      sessionId: currentSessionId,
      messages: [userMessage, aiMessage],
      context: enhancedContext
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Mesaj gönderilirken hata oluştu' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const sessionId = searchParams.get('sessionId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // If sessionId is provided, get messages for that session
    if (sessionId) {
      const messages = await prisma.chatMessage.findMany({
        where: { sessionId: sessionId },
        orderBy: { timestamp: 'asc' },
        select: {
          id: true,
          content: true,
          role: true,
          timestamp: true
        }
      });

      return NextResponse.json({
        messages: messages.map(msg => ({
          id: msg.id,
          content: msg.content,
          sender: msg.role === 'user' ? 'user' : 'ai',
          timestamp: msg.timestamp,
          type: 'general'
        }))
      });
    }

    // Otherwise, get all sessions for the user
    const sessions = await prisma.chatSession.findMany({
      where: { userId: userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        messages: {
          orderBy: { timestamp: 'desc' },
          take: 1,
          select: { content: true }
        },
        _count: {
          select: { messages: true }
        }
      }
    });

    return NextResponse.json({
      sessions: sessions.map(session => ({
        id: session.id,
        title: session.title,
        lastMessage: session.messages[0]?.content || 'No messages',
        updatedAt: session.updatedAt,
        messageCount: session._count.messages,
        createdAt: session.createdAt
      }))
    });

  } catch (error) {
    console.error('Chat API GET Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 