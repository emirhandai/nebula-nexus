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
      return NextResponse.json({ error: 'Gönderi ID gerekli' }, { status: 400 });
    }

    const updatedPost = await prisma.forumPost.update({
      where: { id },
      data: { isDeleted: true },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      post: updatedPost 
    });

  } catch (error) {
    console.error('Post deletion error:', error);
    return NextResponse.json(
      { error: 'Gönderi silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 