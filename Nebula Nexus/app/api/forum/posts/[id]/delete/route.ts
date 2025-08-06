import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: postId } = await params;
    const { userId } = await request.json();

    if (!userId || !postId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    // Post'un sahibi olup olmadığını kontrol et
    const post = await prisma.forumPost.findUnique({
      where: { id: postId },
      select: { authorId: true }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post bulunamadı' },
        { status: 404 }
      );
    }

    if (post.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    // Post'u sil (cascade ile like'lar ve yorumlar da silinecek)
    await prisma.forumPost.delete({
      where: { id: postId }
    });

    console.log('✅ Post deleted:', postId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Post delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Post silinemedi' },
      { status: 500 }
    );
  }
} 