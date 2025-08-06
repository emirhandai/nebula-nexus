import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      jobPostingId,
      applicantId,
      coverLetter,
      portfolio,
      experience
    } = body;

    if (!jobPostingId || !applicantId) {
      return NextResponse.json(
        { error: 'Job posting ID and applicant ID are required' },
        { status: 400 }
      );
    }

    // Check if user already applied
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        jobPostingId_applicantId: {
          jobPostingId,
          applicantId
        }
      }
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: 'You have already applied for this position' },
        { status: 400 }
      );
    }

    // Create application
    const application = await prisma.jobApplication.create({
      data: {
        jobPostingId,
        applicantId,
        coverLetter: coverLetter || '',
        portfolio: portfolio || '',
        experience: experience || '',
        status: 'pending'
      },
      include: {
        jobPosting: {
          include: {
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        },
        applicant: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create activity log for applicant
    try {
      await prisma.activityLog.create({
        data: {
          userId: applicantId,
          type: 'job_application_submitted',
          title: 'İş Başvurusu Gönderildi',
          description: `${application.jobPosting.role} pozisyonuna başvuru gönderdiniz.`,
          data: JSON.stringify({
            jobPostingId,
            role: application.jobPosting.role,
            projectTitle: application.jobPosting.project.title
          })
        }
      });
    } catch (activityError) {
      console.error('Error creating activity log for application:', activityError);
    }

    return NextResponse.json({
      success: true,
      application
    });

  } catch (error) {
    console.error('Error creating job application:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 