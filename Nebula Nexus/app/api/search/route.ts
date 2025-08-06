import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Oturum gerekli' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'all'; // all, users, tests, careers
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!query.trim()) {
      return NextResponse.json({ 
        results: [],
        pagination: { page, limit, total: 0, pages: 0 }
      });
    }

    const skip = (page - 1) * limit;
    const searchTerm = query.trim();

    let results: any[] = [];
    let total = 0;

    switch (type) {
      case 'users':
        // Kullanıcı arama
        const [users, userCount] = await Promise.all([
          prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { email: { contains: searchTerm } },
                { location: { contains: searchTerm } }
              ]
            },
            skip,
            take: limit,
            select: {
              id: true,
              name: true,
              email: true,
              location: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }),
          prisma.user.count({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { email: { contains: searchTerm } },
                { location: { contains: searchTerm } }
              ]
            }
          })
        ]);

        results = users.map(user => ({
          type: 'user',
          id: user.id,
          title: user.name || 'İsimsiz Kullanıcı',
          subtitle: user.email,
          description: user.location || 'Konum belirtilmemiş',
          metadata: {
            joinDate: user.createdAt.toISOString().split('T')[0]
          }
        }));
        total = userCount;
        break;

      case 'tests':
        // Test sonuçları arama
        const [tests, testCount] = await Promise.all([
          prisma.oceanResult.findMany({
            where: {
              OR: [
                {
                  user: {
                    name: { contains: searchTerm }
                  }
                },
                {
                  user: {
                    email: { contains: searchTerm }
                  }
                },
                {
                  recommendedFields: { contains: searchTerm }
                }
              ]
            },
            skip,
            take: limit,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: { testDate: 'desc' }
          }),
          prisma.oceanResult.count({
            where: {
              OR: [
                {
                  user: {
                    name: { contains: searchTerm }
                  }
                },
                {
                  user: {
                    email: { contains: searchTerm }
                  }
                },
                {
                  recommendedFields: { contains: searchTerm }
                }
              ]
            }
          })
        ]);

        results = tests.map(test => ({
          type: 'test',
          id: test.id,
          title: `${test.user.name || test.user.email} - OCEAN Test`,
          subtitle: test.testDate.toISOString().split('T')[0],
          description: `Önerilen alanlar: ${test.recommendedFields}`,
          metadata: {
            openness: test.openness,
            conscientiousness: test.conscientiousness,
            extraversion: test.extraversion,
            agreeableness: test.agreeableness,
            neuroticism: test.neuroticism,
            duration: test.testDuration
          }
        }));
        total = testCount;
        break;

      case 'careers':
        // Kariyer alanları arama
        const [careers, careerCount] = await Promise.all([
          prisma.softwareField.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { category: { contains: searchTerm } }
              ]
            },
            skip,
            take: limit,
            orderBy: { name: 'asc' }
          }),
          prisma.softwareField.count({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } },
                { category: { contains: searchTerm } }
              ]
            }
          })
        ]);

        results = careers.map(career => ({
          type: 'career',
          id: career.id,
          title: career.name,
          subtitle: career.category,
          description: career.description,
          metadata: {
            averageSalary: career.averageSalary,
            jobGrowth: career.jobGrowth,
            demandLevel: career.demandLevel
          }
        }));
        total = careerCount;
        break;

      default:
        // Tüm türlerde arama
        const [allUsers, allTests, allCareers] = await Promise.all([
          prisma.user.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { email: { contains: searchTerm } }
              ]
            },
            take: 3,
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true
            }
          }),
          prisma.oceanResult.findMany({
            where: {
              OR: [
                {
                  user: {
                    name: { contains: searchTerm }
                  }
                },
                {
                  recommendedFields: { contains: searchTerm }
                }
              ]
            },
            take: 3,
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            },
            orderBy: { testDate: 'desc' }
          }),
          prisma.softwareField.findMany({
            where: {
              OR: [
                { name: { contains: searchTerm } },
                { description: { contains: searchTerm } }
              ]
            },
            take: 4,
            orderBy: { name: 'asc' }
          })
        ]);

        results = [
          ...allUsers.map(user => ({
            type: 'user',
            id: user.id,
            title: user.name || 'İsimsiz Kullanıcı',
            subtitle: user.email,
            description: 'Kullanıcı',
            metadata: {
              joinDate: user.createdAt.toISOString().split('T')[0]
            }
          })),
          ...allTests.map(test => ({
            type: 'test',
            id: test.id,
            title: `${test.user.name || test.user.email} - Test`,
            subtitle: test.testDate.toISOString().split('T')[0],
            description: 'OCEAN Test Sonucu',
            metadata: {
              recommendedFields: test.recommendedFields
            }
          })),
          ...allCareers.map(career => ({
            type: 'career',
            id: career.id,
            title: career.name,
            subtitle: career.category,
            description: career.description,
            metadata: {
              demandLevel: career.demandLevel
            }
          }))
        ];

        total = results.length;
        break;
    }

    return NextResponse.json({
      results,
      query: searchTerm,
      type,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

// Save search history
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query, category } = body;

    if (!userId || !query) {
      return NextResponse.json(
        { error: 'User ID and query are required' },
        { status: 400 }
      );
    }

    // For now, we'll just return success
    // In a real implementation, you'd save to a search_history table
    return NextResponse.json({ 
      success: true, 
      message: 'Search history saved' 
    });

  } catch (error) {
    console.error('Save Search History API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 