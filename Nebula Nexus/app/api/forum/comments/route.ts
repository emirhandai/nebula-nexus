import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { content, postId, authorId } = await request.json();

    if (!content || !postId || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    console.log('💬 Creating new comment:', { postId, authorId });

    const comment = await prisma.forumComment.create({
      data: {
        content,
        postId,
        authorId
      },
      include: {
        author: { 
          select: { 
            id: true, 
            name: true, 
            image: true 
          } 
        }
      }
    });

    // Activity log ekleme
    await prisma.activityLog.create({
      data: {
        userId: authorId,
        type: 'forum_comment',
        activityType: 'forum_comment',
        description: `Forum post'una yorum yapıldı`,
        metadata: JSON.stringify({ commentId: comment.id, postId })
      }
    });

    console.log('✅ Comment created:', comment.id);

    return NextResponse.json({
      success: true,
      comment: {
        id: comment.id,
        content: comment.content,
        author: comment.author,
        likes: 0,
        createdAt: comment.createdAt.toISOString(),
        updatedAt: comment.updatedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Comment creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Yorum oluşturulamadı' },
      { status: 500 }
    );
  }
} 