import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
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
        },
        jobPostings: {
          include: {
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
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await prisma.project.update({
      where: { id: projectId },
      data: { views: { increment: 1 } }
    });

    // Transform job postings to include application count
    const transformedProject = {
      ...project,
      jobPostings: project.jobPostings.map(job => ({
        ...job,
        applications: job.applications.length
      }))
    };

    return NextResponse.json(transformedProject);

  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 