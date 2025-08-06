import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('=== Chat Create Session API called ===');
    
    const body = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    
    const { userId, title } = body;

    if (!userId) {
      console.log('❌ User ID is missing');
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('✅ User ID validated:', userId);

    // Chat session oluştur
    console.log('💾 Creating chat session...');
    const chatSession = await prisma.chatSession.create({
      data: {
        userId,
        title: title || 'Yeni Sohbet',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });
    console.log('✅ Chat session created with ID:', chatSession.id);

    // Activity log oluştur
    console.log('📝 Creating activity log for chat session...');
    try {
      await prisma.activityLog.create({
        data: {
          userId,
          type: 'chat_session',
          action: 'create_session',
          title: 'AI Chat Oturumu Başlatıldı',
          description: 'AI ile yeni bir sohbet oturumu başlattınız.',
          data: JSON.stringify({
            sessionId: chatSession.id,
            title: chatSession.title
          })
        }
      });
      console.log('✅ Activity log created for chat session');
    } catch (activityError) {
      console.error('❌ Error creating activity log:', activityError);
    }

    return NextResponse.json({
      success: true,
      sessionId: chatSession.id,
      title: chatSession.title
    });
  } catch (error: any) {
    console.error('❌ Error creating chat session:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { error: 'Failed to create chat session', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 