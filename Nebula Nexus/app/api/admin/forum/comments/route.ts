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
      whereClause.content = { contains: search, mode: 'insensitive' };
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

    const [comments, total] = await Promise.all([
      prisma.forumComment.findMany({
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
          post: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.forumComment.count({ where: whereClause })
    ]);

    const formattedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      isApproved: comment.isApproved,
      isDeleted: comment.isDeleted,
      createdAt: comment.createdAt.toISOString(),
      author: comment.author,
      post: comment.post
    }));

    return NextResponse.json({
      success: true,
      comments: formattedComments,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin forum comments API error:', error);
    return NextResponse.json(
      { error: 'Forum yorumları alınırken hata oluştu' },
      { status: 500 }
    );
  }
} 