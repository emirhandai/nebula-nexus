import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const role = searchParams.get('role');

    let whereClause: any = { isActive: true };

    if (search) {
      whereClause.OR = [
        { role: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { skills: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    const jobPostings = await prisma.jobPosting.findMany({
      where: whereClause,
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        },
        postedBy: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        applications: {
          include: {
            applicant: {
              select: {
                id: true,
                name: true,
                image: true
              }
            }
          }
        }
      },
      orderBy: { postedAt: 'desc' }
    });

    return NextResponse.json(jobPostings);

  } catch (error) {
    console.error('Error fetching job postings:', error);
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
      projectId,
      role,
      description,
      requirements,
      skills,
      commitment,
      duration,
      postedBy
    } = body;

    if (!projectId || !role || !description || !postedBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const jobPosting = await prisma.jobPosting.create({
      data: {
        projectId,
        role,
        description,
        requirements: JSON.stringify(requirements || []),
        skills: JSON.stringify(skills || []),
        commitment: commitment || 'flexible',
        duration: duration || 'Flexible',
        postedBy: {
          connect: { id: postedBy }
        }
      },
      include: {
        project: {
          select: {
            id: true,
            title: true
          }
        },
        postedBy: {
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
          userId: postedBy,
          type: 'job_posting_created',
          title: 'İş İlanı Verildi',
          description: `${role} pozisyonu için iş ilanı verdiniz.`,
          data: JSON.stringify({
            jobPostingId: jobPosting.id,
            role,
            projectId
          })
        }
      });
    } catch (activityError) {
      console.error('Error creating activity log:', activityError);
    }

    return NextResponse.json(jobPosting);

  } catch (error) {
    console.error('Error creating job posting:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 