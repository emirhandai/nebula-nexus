import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    const { userId } = await request.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Mevcut like'ı kontrol et
    const existingLike = await prisma.forumPostLike.findUnique({
      where: {
        userId_postId: {
          userId,
          postId
        }
      }
    });

    if (existingLike) {
      // Like varsa kaldır
      await prisma.forumPostLike.delete({
        where: {
          userId_postId: {
            userId,
            postId
          }
        }
      });

      console.log('✅ Post like removed');
      return NextResponse.json({ success: true, liked: false });
    } else {
      // Like yoksa ekle
      await prisma.forumPostLike.create({
        data: {
          userId,
          postId
        }
      });

      console.log('✅ Post liked');
      return NextResponse.json({ success: true, liked: true });
    }

  } catch (error) {
    console.error('❌ Post like error:', error);
    return NextResponse.json(
      { success: false, error: 'İşlem başarısız' },
      { status: 500 }
    );
  }
} 