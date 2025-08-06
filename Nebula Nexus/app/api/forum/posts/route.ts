import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    console.log('📝 Fetching forum posts...', { categoryId, limit, offset });
    console.log('🔍 Prisma client exists:', !!prisma);
    console.log('🔍 Prisma forumPost exists:', !!prisma?.forumPost);
    
    if (!prisma) {
      throw new Error('Prisma client is not initialized');
    }

    const where = categoryId && categoryId !== 'all' ? { categoryId } : {};

    const posts = await prisma.forumPost.findMany({
      where,
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
      },
      orderBy: [
        { isPinned: 'desc' },
        { updatedAt: 'desc' }
      ],
      take: limit,
      skip: offset
    });

    const enrichedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      content: post.content,
      author: {
        id: post.author.id,
        name: post.author.name || 'Anonim',
        image: post.author.image
      },
      category: post.category,
      views: post.views,
      likes: post._count.postLikes,
      commentCount: post._count.comments,
      isPinned: post.isPinned,
      isLocked: post.isLocked,
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString()
    }));

    console.log(`✅ ${enrichedPosts.length} post bulundu`);

    return NextResponse.json({
      success: true,
      posts: enrichedPosts
    });

  } catch (error) {
    console.error('❌ Posts fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Postlar yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, content, categoryId, authorId } = await request.json();

    if (!title || !content || !categoryId || !authorId) {
      return NextResponse.json(
        { success: false, error: 'Gerekli alanlar eksik' },
        { status: 400 }
      );
    }

    console.log('📝 Creating new post:', { title, categoryId, authorId });

    const post = await prisma.forumPost.create({
      data: {
        title,
        content,
        categoryId,
        authorId
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

    // Activity log ekleme
    await prisma.activityLog.create({
      data: {
        userId: authorId,
        type: 'forum_post',
        activityType: 'forum_post',
        description: `"${title}" başlıklı post oluşturuldu`,
        metadata: JSON.stringify({ postId: post.id, categoryId })
      }
    });

    console.log('✅ Post created:', post.id);

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        category: post.category,
        views: post.views,
        likes: 0,
        commentCount: 0,
        isPinned: post.isPinned,
        isLocked: post.isLocked,
        createdAt: post.createdAt.toISOString(),
        updatedAt: post.updatedAt.toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Post creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Post oluşturulamadı' },
      { status: 500 }
    );
  }
}