import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '../../../../lib/prisma';
import { isAdminSession } from '../../../../lib/security';

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

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
          isPublic: true,
          isActive: true,
          isBanned: true,
          _count: {
            select: {
              oceanResults: true,
              chatSessions: true,
              careerRecommendations: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin users API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, updates } = body;

    if (!userId || !updates) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    const allowedUpdates = ['name', 'email', 'isPublic', 'showEmail', 'showPhone', 'showLocation', 'isActive', 'isBanned'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: filteredUpdates,
      select: {
        id: true,
        name: true,
        email: true,
        isPublic: true,
        isActive: true,
        isBanned: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin user update error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { userId, action } = body;

    if (!userId || !action) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    let updateData: any = {};

    if (action === 'ban') {
      updateData.isBanned = true;
      updateData.isActive = false;
    } else if (action === 'unban') {
      updateData.isBanned = false;
      updateData.isActive = true;
    } else {
      return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        isPublic: true,
        isActive: true,
        isBanned: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error('Admin user ban/unban error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Kullanıcı ID gerekli' }, { status: 400 });
    }

    // Kullanıcının tüm verilerini sil
    await prisma.$transaction([
      prisma.oceanResult.deleteMany({ where: { userId } }),
      prisma.chatSession.deleteMany({ where: { userId } }),
      prisma.careerRecommendation.deleteMany({ where: { userId } }),
      prisma.user.delete({ where: { id: userId } })
    ]);

    return NextResponse.json({ message: 'Kullanıcı başarıyla silindi' });
  } catch (error) {
    console.error('Admin user delete error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 