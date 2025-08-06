import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const comments = await prisma.forumComment.findMany({
      where: { 
        postId: id,
        parentId: null // Sadece ana yorumları getir, cevaplar ayrı olarak yüklenecek
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            commentLikes: true,
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Likes sayısını _count'tan al
    const formattedComments = comments.map(comment => ({
      ...comment,
      likes: comment._count.commentLikes
    }));

    return NextResponse.json({ success: true, comments: formattedComments });
  } catch (error) {
    console.error('Yorumları yükleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content, authorId, parentId } = await request.json();

    if (!content || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const newComment = await prisma.forumComment.create({
      data: {
        content,
        authorId,
        postId: id,
        parentId: parentId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        _count: {
          select: {
            commentLikes: true,
            replies: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      comment: {
        ...newComment,
        likes: newComment._count.commentLikes
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Yorum oluşturma hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}