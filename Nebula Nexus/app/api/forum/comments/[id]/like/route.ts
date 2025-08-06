import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: commentId } = await params;
    const { userId } = await request.json();

    if (!userId || !commentId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Mevcut like'ı kontrol et
    const existingLike = await prisma.forumCommentLike.findUnique({
      where: {
        userId_commentId: {
          userId,
          commentId
        }
      }
    });

    if (existingLike) {
      // Like varsa kaldır
      await prisma.forumCommentLike.delete({
        where: {
          userId_commentId: {
            userId,
            commentId
          }
        }
      });

      console.log('✅ Comment like removed');
      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like yoksa ekle
      await prisma.forumCommentLike.create({
        data: {
          userId,
          commentId
        }
      });

      console.log('✅ Comment liked');
      return NextResponse.json({ success: true, liked: true });
    }

  } catch (error) {
    console.error('❌ Comment like error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem başarısız' },
      { status: 500 }
    );
  }
} 