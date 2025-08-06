import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { isAdminSession } from '@/lib/security';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const postId = params.id;

    const updatedPost = await prisma.forumPost.update({
      where: { id: postId },
      data: { isApproved: true },
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
    console.error('Post approval error:', error);
    return NextResponse.json(
      { error: 'Post onaylanırken hata oluştu' },
      { status: 500 }
    );
  }
} 