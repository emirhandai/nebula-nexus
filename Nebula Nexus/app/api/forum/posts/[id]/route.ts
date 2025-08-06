import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { isAdminSession } from '@/lib/security';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.forumPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        },
        _count: {
          select: {
            comments: true,
            postLikes: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { success: false, error: 'Post bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error('Post yükleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { title, content, categoryId } = await request.json();

    const updatedPost = await prisma.forumPost.update({
      where: { id },
      data: {
        title,
        content,
        categoryId,
        updatedAt: new Date()
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        category: {
          select: {
            id: true,
            name: true,
            icon: true,
            color: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, post: updatedPost });
  } catch (error) {
    console.error('Post güncelleme hatası:', error);
    return NextResponse.json(
      { success: false, error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const postId = params.id;

    // Delete post and all related data
    await prisma.$transaction([
      prisma.forumComment.deleteMany({ where: { postId } }),
      prisma.forumPost.delete({ where: { id: postId } })
    ]);

    return NextResponse.json({ 
      success: true, 
      message: 'Post başarıyla silindi' 
    });

  } catch (error) {
    console.error('Post deletion error:', error);
    return NextResponse.json(
      { error: 'Post silinirken hata oluştu' },
      { status: 500 }
    );
  }
}