import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');

    let whereClause: any = { isActive: true };

    if (category && category !== 'all') {
      whereClause.category = category;
    }

    if (difficulty && difficulty !== 'all') {
      whereClause.difficulty = difficulty;
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ];
    }

    const projects = await prisma.project.findMany({
      where: whereClause,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(projects);

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      category,
      difficulty,
      teamSize,
      lookingFor,
      tags,
      location,
      duration,
      userId
    } = body;

    if (!userId || !title || !description || !category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        category,
        difficulty: difficulty || 'beginner',
        teamSize: teamSize || 1,
        currentMembers: 1, // Creator is the first member
        lookingFor: JSON.stringify(lookingFor || []),
        tags: JSON.stringify(tags || []),
        location: location || 'Remote',
        duration: duration || 'Flexible',
        createdBy: {
          connect: { id: userId }
        },
        members: {
          create: {
            userId,
            role: 'Creator',
            joinedAt: new Date()
          }
        }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    // Create activity log
    try {
      await prisma.activityLog.create({
        data: {
          userId,
          type: 'project_created',
          title: 'Proje Oluşturuldu',
          description: `${title} projesini oluşturdunuz.`,
          data: JSON.stringify({
            projectId: project.id,
            title,
            category
          })
        }
      });
    } catch (activityError) {
      console.error('Error creating activity log:', activityError);
    }

    return NextResponse.json(project);

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 