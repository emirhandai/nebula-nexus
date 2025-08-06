import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's OCEAN test results
    const testResults = await prisma.oceanResult.findMany({
      where: { userId },
      orderBy: { testDate: 'desc' },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalTests = await prisma.oceanResult.count({
      where: { userId }
    });

    // Calculate average scores over time
    const averageScores = testResults.map(result => ({
      testDate: result.testDate,
      averageScore: (result.openness + result.conscientiousness + result.extraversion + result.agreeableness + result.neuroticism) / 5,
      scores: {
        openness: result.openness,
        conscientiousness: result.conscientiousness,
        extraversion: result.extraversion,
        agreeableness: result.agreeableness,
        neuroticism: result.neuroticism
      }
    }));

    const response = {
      tests: testResults.map(result => ({
        id: result.id,
        testDate: result.testDate,
        testDuration: result.testDuration,
        questionsAnswered: result.questionsAnswered,
        scores: {
          openness: result.openness,
          conscientiousness: result.conscientiousness,
          extraversion: result.extraversion,
          agreeableness: result.agreeableness,
          neuroticism: result.neuroticism
        },
        averageScore: (result.openness + result.conscientiousness + result.extraversion + result.agreeableness + result.neuroticism) / 5,
        recommendedFields: result.recommendedFields ? JSON.parse(result.recommendedFields) : []
      })),
      averageScores,
      pagination: {
        total: totalTests,
        limit,
        offset,
        hasMore: offset + limit < totalTests
      },
      summary: {
        totalTests,
        averageDuration: testResults.length > 0 
          ? testResults.reduce((sum, test) => sum + test.testDuration, 0) / testResults.length 
          : 0,
        lastTestDate: testResults[0]?.testDate || null,
        improvement: testResults.length >= 2 
          ? averageScores[0].averageScore - averageScores[averageScores.length - 1].averageScore 
          : 0
      }
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching test history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');

    if (testId) {
      // Delete specific test
      await prisma.oceanResult.deleteMany({
        where: {
          id: testId,
          userId
        }
      });
    } else {
      // Delete all tests for user
      await prisma.oceanResult.deleteMany({
        where: { userId }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting test history:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 