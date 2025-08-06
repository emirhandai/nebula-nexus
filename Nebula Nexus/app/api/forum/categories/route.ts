import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('📂 Fetching forum categories...');

    const categories = await prisma.forumCategory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
      include: {
        posts: {
          include: {
            author: { select: { name: true } },
            _count: { select: { comments: true } }
          },
          orderBy: { updatedAt: 'desc' },
          take: 1
        },
        _count: { select: { posts: true } }
      }
    });

    const enrichedCategories = categories.map(category => ({
      id: category.id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      postCount: category._count.posts,
      lastPost: category.posts[0] ? {
        title: category.posts[0].title,
        author: category.posts[0].author.name || 'Anonim',
        date: category.posts[0].updatedAt.toISOString()
      } : null
    }));

    console.log(`✅ ${enrichedCategories.length} kategori bulundu`);

    return NextResponse.json({
      success: true,
      categories: enrichedCategories
    });

  } catch (error) {
    console.error('❌ Categories fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategoriler yüklenemedi' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description, icon, color } = await request.json();

    console.log('📂 Creating new category:', { name, description });

    const category = await prisma.forumCategory.create({
      data: {
        name,
        description,
        icon,
        color,
        order: await prisma.forumCategory.count()
      }
    });

    console.log('✅ Category created:', category.id);

    return NextResponse.json({
      success: true,
      category
    });

  } catch (error) {
    console.error('❌ Category creation error:', error);
    return NextResponse.json(
      { success: false, error: 'Kategori oluşturulamadı' },
      { status: 500 }
    );
  }
}