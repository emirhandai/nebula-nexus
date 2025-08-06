import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { isAdminSession } from '@/lib/security';

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Yorum ID gerekli' }, { status: 400 });
    }

    const updatedComment = await prisma.forumComment.update({
      where: { id },
      data: { isDeleted: true },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        post: {
          select: {
            title: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      comment: updatedComment 
    });

  } catch (error) {
    console.error('Comment deletion error:', error);
    return NextResponse.json(
      { error: 'Yorum silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 