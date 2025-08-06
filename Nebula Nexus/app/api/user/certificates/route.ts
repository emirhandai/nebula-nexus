import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    console.log('🎓 Fetching certificates for user:', userId);

    // Get user's activity logs and progress
    const activityLogs = await prisma.activityLog.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10
    });

    // Generate certificate data based on user activity
    const certificates = [];
    
    // JavaScript Fundamentals - completed if user has any activity
    if (activityLogs.length > 0) {
      certificates.push({
        id: 'js-fundamentals',
        name: 'JavaScript Fundamentals',
        status: 'completed',
        date: '15 Mart 2024',
        issuer: 'BTK Akademi',
        verificationId: 'BTK-JS-2024-001'
      });
    }

    // React Developer - in progress based on activity count
    const testActivity = activityLogs.filter(a => 
      a.activityType === 'test_completion' || 
      a.activityType === 'career_selection'
    );
    
    if (testActivity.length > 0) {
      const progress = Math.min(65, testActivity.length * 25);
      certificates.push({
        id: 'react-developer',
        name: 'React Developer',
        status: 'in-progress',
        progress: progress,
        estimatedCompletion: '3 hafta',
        nextMilestone: 'Component State Yönetimi'
      });
    }

    // Full Stack Certificate - upcoming if user has selected a field
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { selectedField: true }
    });

    if (user?.selectedField) {
      certificates.push({
        id: 'fullstack-cert',
        name: 'Full Stack Certificate',
        status: 'upcoming',
        requirement: 'React ve Backend kurslarını bitirin',
        prerequisites: ['JavaScript Fundamentals', 'React Developer'],
        estimatedDuration: '3 ay'
      });
    }

    // AI & Machine Learning Certificate (if selected field is AI)
    if (user?.selectedField?.includes('AI') || user?.selectedField?.includes('Machine Learning')) {
      certificates.push({
        id: 'ai-ml-cert',
        name: 'AI & Machine Learning Specialist',
        status: 'upcoming',
        requirement: 'Python ve ML temellerini tamamlayın',
        prerequisites: ['Python Fundamentals', 'Data Science Basics'],
        estimatedDuration: '4 ay'
      });
    }

    console.log('📜 Generated certificates:', certificates.length);

    return NextResponse.json({
      certificates,
      totalCertificates: certificates.length,
      completedCertificates: certificates.filter(c => c.status === 'completed').length,
      inProgressCertificates: certificates.filter(c => c.status === 'in-progress').length
    });

  } catch (error) {
    console.error('❌ Error fetching certificates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch certificates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, certificateId, action } = body;

    if (!userId || !certificateId || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('🎯 Certificate action:', { userId, certificateId, action });

    // Handle certificate actions (enroll, complete, etc.)
    switch (action) {
      case 'enroll':
        // Create progress tracking entry for certificate course
        await prisma.progressTracking.create({
          data: {
            userId,
            courseTitle: `Certificate: ${certificateId}`,
            skillName: 'Certificate Program',
            progress: 0,
            level: 'beginner',
            pointsEarned: 0
          }
        });
        break;

      case 'complete':
        // Mark certificate as completed
        await prisma.progressTracking.upsert({
          where: {
            userId_courseTitle: {
              userId,
              courseTitle: `Certificate: ${certificateId}`
            }
          },
          update: {
            progress: 100,
            pointsEarned: 500,
            updatedAt: new Date()
          },
          create: {
            userId,
            courseTitle: `Certificate: ${certificateId}`,
            skillName: 'Certificate Program',
            progress: 100,
            level: 'advanced',
            pointsEarned: 500
          }
        });
        break;

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Certificate action completed' });

  } catch (error) {
    console.error('❌ Error processing certificate action:', error);
    return NextResponse.json(
      { error: 'Failed to process certificate action' },
      { status: 500 }
    );
  }
}