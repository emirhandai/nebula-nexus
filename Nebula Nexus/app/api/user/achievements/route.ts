import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    console.log('🏆 Achievements API called');
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    console.log('🏆 User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Kullanıcının başarılarını getir
    console.log('🏆 Fetching user achievements...');
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId }
    });
    console.log('🏆 User achievements found:', userAchievements.length);

    // Kullanıcının mevcut durumunu kontrol et
    console.log('🏆 Fetching user data...');
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oceanResults: true,
        chatSessions: true,
        progressTracking: true,
        careerRoadmaps: true
      }
    });
    console.log('🏆 User found:', !!user);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Tüm olası başarıları tanımla
    const allAchievements = [
      {
        id: 'first_test',
        title: 'İlk Test',
        description: 'OCEAN kişilik testini tamamlayın',
        icon: 'TestTube',
        color: 'text-green-400',
        condition: () => user.oceanResults.length > 0,
        progress: user.oceanResults.length > 0 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'field_selection',
        title: 'Alan Seçimi',
        description: 'Kariyer alanınızı belirleyin',
        icon: 'Target',
        color: 'text-blue-400',
        condition: () => !!user.selectedField,
        progress: user.selectedField ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'first_chat',
        title: 'AI Danışman',
        description: 'AI ile ilk konuşmanızı yapın',
        icon: 'MessageSquare',
        color: 'text-purple-400',
        condition: () => user.chatSessions.length > 0,
        progress: user.chatSessions.length > 0 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'course_completion',
        title: 'Öğrenci',
        description: 'İlk kursunuzu tamamlayın',
        icon: 'BookOpen',
        color: 'text-yellow-400',
        condition: () => user.progressTracking.some(cp => cp.isCompleted),
        progress: user.progressTracking.filter(cp => cp.isCompleted).length,
        maxProgress: 1
      },
      {
        id: 'career_roadmap',
        title: 'Yol Haritası',
        description: 'Kariyer yol haritanızı oluşturun',
        icon: 'Map',
        color: 'text-cyan-400',
        condition: () => user.careerRoadmaps.length > 0,
        progress: user.careerRoadmaps.length > 0 ? 1 : 0,
        maxProgress: 1
      },
      {
        id: 'chat_master',
        title: 'Sohbet Ustası',
        description: '10 AI chat oturumu yapın',
        icon: 'MessageSquare',
        color: 'text-purple-400',
        condition: () => user.chatSessions.length >= 10,
        progress: Math.min(user.chatSessions.length, 10),
        maxProgress: 10
      },
      {
        id: 'course_master',
        title: 'Kurs Ustası',
        description: '5 kurs tamamlayın',
        icon: 'BookOpen',
        color: 'text-yellow-400',
        condition: () => user.progressTracking.filter(cp => cp.isCompleted).length >= 5,
        progress: user.progressTracking.filter(cp => cp.isCompleted).length,
        maxProgress: 5
      },
      {
        id: 'early_bird',
        title: 'Erken Kuş',
        description: 'Hesabınızı oluşturduktan sonraki ilk 24 saatte test tamamlayın',
        icon: 'Clock',
        color: 'text-orange-400',
        condition: () => {
          if (user.oceanResults.length === 0) return false;
          const testDate = new Date(user.oceanResults[0].testDate);
          const joinDate = new Date(user.createdAt);
          const diffHours = (testDate.getTime() - joinDate.getTime()) / (1000 * 60 * 60);
          return diffHours <= 24;
        },
        progress: 0,
        maxProgress: 1
      }
    ];

    // Başarıları formatla
    const formattedAchievements = allAchievements.map(achievement => {
      const conditionMet = achievement.condition();
      const userAchievement = userAchievements.find(ua => ua.achievementId === achievement.id);
      
      // Başarı sadece veritabanında kayıtlıysa kazanılmış sayılır
      const earned = !!userAchievement;
      
      return {
        id: achievement.id,
        title: achievement.title,
        description: achievement.description,
        icon: achievement.icon,
        color: achievement.color,
        earned: earned,
        progress: conditionMet ? achievement.progress : 0,
        maxProgress: achievement.maxProgress,
        earnedAt: userAchievement?.earnedAt || null
      };
    });

    return NextResponse.json(formattedAchievements);

  } catch (error) {
    console.error('Error fetching achievements:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, achievementId, title, description } = body;

    if (!userId || !achievementId) {
      return NextResponse.json(
        { error: 'User ID and achievement ID are required' },
        { status: 400 }
      );
    }

    // Achievement kaydet
    const userAchievement = await prisma.userAchievement.upsert({
      where: {
        userId_achievementId: {
          userId,
          achievementId
        }
      },
      update: {
        earnedAt: new Date()
      },
      create: {
        userId,
        achievementId,
        title: title || 'Başarı',
        description: description || 'Yeni başarı kazandınız!',
        earnedAt: new Date()
      }
    });

    // Activity log oluştur
    try {
      await prisma.activityLog.create({
        data: {
          userId,
          type: 'achievement_earned',
          title: 'Başarı Kazanıldı',
          description: `${title || 'Yeni bir başarı'} kazandınız!`,
          data: JSON.stringify({
            achievementId,
            title,
            description
          })
        }
      });
    } catch (activityError) {
      console.error('Error creating activity log for achievement:', activityError);
    }

    return NextResponse.json({
      success: true,
      userAchievement
    });

  } catch (error) {
    console.error('Error creating achievement:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 