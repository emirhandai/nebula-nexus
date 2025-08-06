const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testDashboardAPIs() {
  try {
    console.log('=== Dashboard API Testleri ===\n');

    // Test kullanıcısını bul
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    });

    if (!testUser) {
      console.log('Test kullanıcısı bulunamadı!');
      return;
    }

    console.log(`Test Kullanıcısı: ${testUser.name} (${testUser.email})`);
    console.log(`User ID: ${testUser.id}\n`);

    // 1. Progress API Testi
    console.log('1. Progress API Testi:');
    const oceanResults = await prisma.oceanResult.findMany({
      where: { userId: testUser.id }
    });

    const chatSessions = await prisma.chatSession.findMany({
      where: { userId: testUser.id }
    });

    const courseProgress = await prisma.courseProgress.findMany({
      where: { userId: testUser.id }
    });

    const careerRecommendations = await prisma.careerRecommendation.findMany({
      where: { userId: testUser.id }
    });

    console.log(`- OCEAN Testleri: ${oceanResults.length}`);
    console.log(`- Chat Oturumları: ${chatSessions.length}`);
    console.log(`- Kurs İlerlemeleri: ${courseProgress.length}`);
    console.log(`- Kariyer Önerileri: ${careerRecommendations.length}`);
    console.log(`- Seçilen Alan: ${testUser.selectedField || 'Yok'}`);

    // Achievement points hesapla
    let achievementPoints = 0;
    if (oceanResults.length > 0) achievementPoints += 50;
    if (testUser.selectedField) achievementPoints += 30;
    achievementPoints += chatSessions.length * 5;
    achievementPoints += courseProgress.filter(cp => cp.completed).length * 20;

    const level = Math.floor(achievementPoints / 100) + 1;
    console.log(`- Achievement Points: ${achievementPoints}`);
    console.log(`- Level: ${level}\n`);

    // 2. Recent Activities Testi
    console.log('2. Recent Activities Testi:');
    const activities = [];

    if (oceanResults.length > 0) {
      activities.push({
        type: 'test_completed',
        title: 'OCEAN Testi Tamamlandı',
        timestamp: oceanResults[0].testDate
      });
    }

    if (testUser.selectedField) {
      activities.push({
        type: 'field_selected',
        title: 'Kariyer Alanı Seçildi',
        timestamp: testUser.updatedAt
      });
    }

    if (chatSessions.length > 0) {
      activities.push({
        type: 'chat_session',
        title: 'AI Chat Kullanıldı',
        timestamp: chatSessions[0].createdAt
      });
    }

    if (careerRecommendations.length > 0) {
      activities.push({
        type: 'career_recommendation',
        title: 'Kariyer Önerileri Alındı',
        timestamp: careerRecommendations[0].createdAt
      });
    }

    console.log(`- Toplam Aktivite: ${activities.length}`);
    activities.forEach((activity, index) => {
      console.log(`  ${index + 1}. ${activity.title} (${activity.timestamp})`);
    });
    console.log('');

    // 3. Achievements Testi
    console.log('3. Achievements Testi:');
    const achievements = [
      {
        id: 'first_test',
        title: 'İlk Test',
        earned: oceanResults.length > 0,
        progress: oceanResults.length > 0 ? 100 : 0
      },
      {
        id: 'field_selection',
        title: 'Alan Seçimi',
        earned: !!testUser.selectedField,
        progress: testUser.selectedField ? 100 : 0
      },
      {
        id: 'social_butterfly',
        title: 'Sosyal Kelebek',
        earned: chatSessions.length >= 5,
        progress: Math.min(chatSessions.length, 5)
      },
      {
        id: 'career_planner',
        title: 'Kariyer Planlayıcı',
        earned: careerRecommendations.length > 0,
        progress: careerRecommendations.length
      }
    ];

    achievements.forEach(achievement => {
      const status = achievement.earned ? '✅ Kazanıldı' : '❌ Kazanılmadı';
      console.log(`- ${achievement.title}: ${status} (${achievement.progress}%)`);
    });

    console.log('\n=== Test Tamamlandı ===');

  } catch (error) {
    console.error('Test hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDashboardAPIs(); 