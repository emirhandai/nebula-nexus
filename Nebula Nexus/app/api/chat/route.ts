import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { chatWithAI } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, sessionId, context } = body

    if (!message) {
      return NextResponse.json(
        { error: 'Mesaj gerekli' },
        { status: 400 }
      )
    }

    // Get or create chat session
    let session
    if (sessionId && sessionId !== 'current-session') {
      session = await prisma.chatSession.findUnique({
        where: { id: sessionId }
      })
    }

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          userId: 'temp-user-id', // Will be replaced with real user ID
          title: message.substring(0, 50) + '...'
        }
      })
    }

    // Save user message
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'user',
        content: message
      }
    })

    // Get AI response with context
    const aiResponse = await chatWithAI(message, context)

    // Save AI response
    await prisma.chatMessage.create({
      data: {
        sessionId: session.id,
        role: 'assistant',
        content: aiResponse,
        modelUsed: 'gemini-pro'
      }
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      response: aiResponse
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    )
  }
} 