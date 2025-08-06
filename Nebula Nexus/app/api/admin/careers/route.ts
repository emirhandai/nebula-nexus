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
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    const skip = (page - 1) * limit;

    const whereClause: any = {};
    if (category) {
      whereClause.category = category;
    }
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [fields, total] = await Promise.all([
      prisma.softwareField.findMany({
        where: whereClause,
        skip,
        take: limit,
        orderBy: { name: 'asc' }
      }),
      prisma.softwareField.count({ where: whereClause })
    ]);

    // Kategori istatistikleri
    const categoryStats = await prisma.softwareField.groupBy({
      by: ['category'],
      _count: true
    });

    // Popüler alanlar (en çok önerilen)
    const popularFields = await prisma.careerRecommendation.groupBy({
      by: ['field'],
      _count: true,
      orderBy: {
        _count: {
          field: 'desc'
        }
      },
      take: 10
    });

    return NextResponse.json({
      fields,
      categoryStats,
      popularFields,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Admin careers API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!isAdminSession(session)) {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, requiredSkills, personalityTraits, averageSalary, jobGrowth, demandLevel, learningPath } = body;

    if (!name || !description || !category) {
      return NextResponse.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }

    const newField = await prisma.softwareField.create({
      data: {
        name,
        description,
        category,
        requiredSkills: JSON.stringify(requiredSkills || []),
        personalityTraits: JSON.stringify(personalityTraits || []),
        averageSalary: averageSalary ? parseFloat(averageSalary) : null,
        jobGrowth: jobGrowth ? parseFloat(jobGrowth) : null,
        demandLevel,
        learningPath: JSON.stringify(learningPath || [])
      }
    });

    return NextResponse.json({ field: newField });
  } catch (error) {
    console.error('Admin career create error:', error);
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
    const { fieldId, updates } = body;

    if (!fieldId || !updates) {
      return NextResponse.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    const allowedUpdates = ['name', 'description', 'category', 'requiredSkills', 'personalityTraits', 'averageSalary', 'jobGrowth', 'demandLevel', 'learningPath'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        if (key === 'requiredSkills' || key === 'personalityTraits' || key === 'learningPath') {
          filteredUpdates[key] = JSON.stringify(updates[key]);
        } else if (key === 'averageSalary' || key === 'jobGrowth') {
          filteredUpdates[key] = updates[key] ? parseFloat(updates[key]) : null;
        } else {
          filteredUpdates[key] = updates[key];
        }
      }
    });

    const updatedField = await prisma.softwareField.update({
      where: { id: fieldId },
      data: filteredUpdates
    });

    return NextResponse.json({ field: updatedField });
  } catch (error) {
    console.error('Admin career update error:', error);
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
    const fieldId = searchParams.get('fieldId');

    if (!fieldId) {
      return NextResponse.json({ error: 'Alan ID gerekli' }, { status: 400 });
    }

    await prisma.softwareField.delete({
      where: { id: fieldId }
    });

    return NextResponse.json({ message: 'Kariyer alanı başarıyla silindi' });
  } catch (error) {
    console.error('Admin career delete error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
} 