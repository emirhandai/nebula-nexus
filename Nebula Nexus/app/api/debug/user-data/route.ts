import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    console.log('=== DEBUG USER DATA ===');
    console.log('Session:', session);
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'No session found',
        session: null 
      });
    }

    console.log('User from session:', session.user);
    
    // Try to get user by email
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 1
        }
      }
    });

    console.log('User from database:', user);
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found in database',
        session: session.user,
        user: null
      });
    }

    // Get all OCEAN results
    const allOceanResults = await prisma.oceanResult.findMany({
      where: { userId: user.id },
      orderBy: { testDate: 'desc' }
    });

    console.log('All OCEAN results:', allOceanResults);

    return NextResponse.json({
      session: session.user,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        selectedField: user.selectedField,
        oceanResults: allOceanResults
      }
    });

  } catch (error) {
    console.error('Debug API Error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 