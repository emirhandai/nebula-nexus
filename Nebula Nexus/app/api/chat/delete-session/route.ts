import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId, userId } = body;

    if (!sessionId || !userId) {
      return NextResponse.json(
        { error: 'Session ID and User ID are required' },
        { status: 400 }
      );
    }

    console.log('=== Delete Chat Session API called ===');
    console.log('Session ID:', sessionId);
    console.log('User ID:', userId);

    // Session'ın bu user'a ait olup olmadığını kontrol et
    const session = await prisma.chatSession.findFirst({
      where: { 
        id: sessionId,
        userId: userId
      }
    });

    if (!session) {
      console.log('❌ Session not found or not owned by user');
      return NextResponse.json(
        { error: 'Session not found or access denied' },
        { status: 404 }
      );
    }

    console.log('✅ Session found and authorized');

    // Önce session'daki tüm mesajları sil
    console.log('🗑️ Deleting session messages...');
    await prisma.chatMessage.deleteMany({
      where: { sessionId }
    });

    // Sonra session'ı sil
    console.log('🗑️ Deleting session...');
    await prisma.chatSession.delete({
      where: { id: sessionId }
    });

    console.log('✅ Session deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error: any) {
    console.error('❌ Delete session error:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { error: 'Failed to delete session', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
} 