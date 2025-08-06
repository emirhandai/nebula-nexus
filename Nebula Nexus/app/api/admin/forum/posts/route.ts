import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { isAdminSession } from '@/lib/security';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (status === 'pending') {
      whereClause.isApproved = false;
      whereClause.isDeleted = false;
    } else if (status === 'approved') {
      whereClause.isApproved = true;
      whereClause.isDeleted = false;
    } else if (status === 'deleted') {
      whereClause.isDeleted = true;
    }

    const [posts, total] = await Promise.all([
      prisma.forumPost.findMany({
        where: whereClause,
        skip,
        take: limit,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          category: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              comments: true,
              postLikes: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.forumPost.count({ where: whereClause })
    ]);

    const formattedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      isApproved: post.isApproved,
      isDeleted: post.isDeleted,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
      viewCount: post.viewCount,
      likeCount: post._count.postLikes,
      commentCount: post._count.comments,
      author: post.author,
      category: post.category,
      tags: post.tags ? JSON.parse(post.tags) : []
    }));

    return NextResponse.json({
      success: true,
      posts: formattedPosts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin forum posts API error:', error);
    return NextResponse.json(
      { error: 'Forum gönderileri alınırken hata oluştu' },
      { status: 500 }
    );
  }
} 