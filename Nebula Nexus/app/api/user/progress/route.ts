import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Kullanıcıyı ve ilgili verileri getir
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 1
        },
        chatSessions: true,
        progressTracking: true, // courseProgress yerine progressTracking
        achievements: true,
        careerRoadmaps: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('Progress API - User found:', user.email);
    console.log('Progress API - oceanResults:', user.oceanResults.length);
    console.log('Progress API - chatSessions:', user.chatSessions.length);
    console.log('Progress API - progressTracking:', user.progressTracking.length);
    console.log('Progress API - achievements:', user.achievements.length);

    // Test tamamlanma durumu
    const testCompleted = user.oceanResults.length > 0;

    // Alan seçimi durumu
    const fieldSelected = !!user.selectedField;

    // Kurs ilerlemesi - progressTracking'den completed olanları say
    const coursesCompleted = user.progressTracking.filter(progress => progress.isCompleted).length;
    const totalCourses = user.progressTracking.length;

    // Chat oturumları
    const chatSessions = user.chatSessions.length;

    // Başarı puanları
    const achievementPoints = user.achievements.length * 10; // Her başarı 10 puan

    // Seviye hesaplama
    const totalPoints = achievementPoints + (coursesCompleted * 5) + (testCompleted ? 20 : 0) + (fieldSelected ? 10 : 0);
    const level = Math.floor(totalPoints / 100) + 1;
    const currentLevelPoints = totalPoints % 100;
    const nextLevelPoints = 100;

    // Kariyer yolu ilerlemesi
    const careerRoadmapProgress = user.careerRoadmaps.length > 0 
      ? user.careerRoadmaps[0].currentLevel || 0 
      : 0;

    return NextResponse.json({
      testCompleted,
      fieldSelected,
      coursesCompleted,
      totalCourses,
      chatSessions,
      achievementPoints,
      level,
      nextLevelPoints,
      currentLevelPoints,
      careerRoadmapProgress,
      totalPoints
    });

  } catch (error) {
    console.error('Error fetching user progress:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      data 
    } = body;

    if (!userId || !type) {
      return NextResponse.json(
        { error: 'User ID and type are required' },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'chat_session':
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        const session = await prisma.chatSession.create({
          data: {
            userId: user.id,
            title: data.title || 'Yeni Sohbet',
            // messageCount field removed as it's not in the schema
          },
        });
        result = session;
        break;

      case 'achievement_earned':
        const userAchievement = await prisma.user.findUnique({ where: { id: userId } });
        if (!userAchievement) {
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        result = await prisma.userAchievement.upsert({
          where: {
            userId_achievementId: {
              userId: userAchievement.id,
              achievementId: data.achievementId
            }
          },
          update: {
            earnedAt: new Date()
          },
          create: {
            userId: userAchievement.id,
            achievementId: data.achievementId,
            type: data.type || 'general', // type alanı zorunlu
            title: data.title || 'Başarı',
            description: data.description || 'Yeni başarı kazandınız!',
            earnedAt: new Date(),
          },
        });
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid type' },
          { status: 400 }
        );
    }

    return NextResponse.json({ success: true, data: result });

  } catch (error) {
    console.error('Progress Update API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}