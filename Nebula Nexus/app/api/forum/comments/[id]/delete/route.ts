import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: commentId } = await params;
    const { userId } = await request.json();

    if (!userId || !commentId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    const comment = await prisma.forumComment.findUnique({
      where: { id: commentId },
      select: { authorId: true }
    });

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Yorum bulunamadı' },
        { status: 404 }
      );
    }

    if (comment.authorId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      );
    }

    await prisma.forumComment.delete({
      where: { id: commentId }
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Comment delete error:', error);
    return NextResponse.json(
      { success: false, error: 'Yorum silinemedi' },
      { status: 500 }
    );
  }
} 