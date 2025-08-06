const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAndAddData() {
  try {
    console.log('🔍 Checking database...');

    // Check if there are any users
    const users = await prisma.user.findMany();
    console.log(`👥 Found ${users.length} users`);

    if (users.length === 0) {
      console.log('❌ No users found. Please create a user first.');
      return;
    }

    const user = users[0];
    console.log('👤 Using user:', user.email);

    // Check existing data
    const activityLogs = await prisma.activityLog.findMany({ where: { userId: user.id } });
    const courseProgress = await prisma.courseProgress.findMany({ where: { userId: user.id } });
    const achievements = await prisma.userAchievement.findMany({ where: { userId: user.id } });

    console.log(`📝 Activity logs: ${activityLogs.length}`);
    console.log(`📚 Course progress: ${courseProgress.length}`);
    console.log(`🏆 Achievements: ${achievements.length}`);

    // Add sample data if none exists
    if (activityLogs.length === 0) {
      console.log('➕ Adding sample activity logs...');
      
      const activities = [
        {
          userId: user.id,
          type: 'test_completed',
          title: 'OCEAN Kişilik Testi Tamamlandı',
          description: 'OCEAN kişilik testini başarıyla tamamladınız ve kariyer önerilerinizi aldınız.',
          data: JSON.stringify({
            testDuration: 1800,
            questionsAnswered: 50,
            scores: {
              openness: 75,
              conscientiousness: 80,
              extraversion: 65,
              agreeableness: 70,
              neuroticism: 30
            }
          })
        },
        {
          userId: user.id,
          type: 'field_selected',
          title: 'Kariyer Alanı Seçildi',
          description: 'Full Stack Developer alanını seçtiniz ve kariyer yolculuğunuza başladınız.',
          data: JSON.stringify({ selectedField: 'Full Stack Developer' })
        },
        {
          userId: user.id,
          type: 'chat_session',
          title: 'AI Chat Oturumu Başlatıldı',
          description: 'AI ile yeni bir sohbet oturumu başlattınız.',
          data: JSON.stringify({
            sessionId: 'sample-session-1',
            title: 'Kariyer Danışmanlığı'
          })
        }
      ];

      for (const activity of activities) {
        await prisma.activityLog.create({
          data: {
            ...activity,
            createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          }
        });
      }
      console.log('✅ Sample activity logs added');
    }

    if (courseProgress.length === 0) {
      console.log('➕ Adding sample course progress...');
      
      await prisma.courseProgress.create({
        data: {
          userId: user.id,
          courseId: 'python-ml-course',
          courseTitle: 'Python ile Makine Öğrenmesi',
          platform: 'BTK Akademi',
          progress: 100,
          completed: true,
          completedAt: new Date(),
          startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      });
      console.log('✅ Sample course progress added');
    }

    if (achievements.length === 0) {
      console.log('➕ Adding sample achievements...');
      
      const achievements = [
        {
          userId: user.id,
          achievementId: 'first_test',
          title: 'İlk Test',
          description: 'OCEAN kişilik testini tamamlayın',
          earnedAt: new Date()
        },
        {
          userId: user.id,
          achievementId: 'field_selection',
          title: 'Alan Seçimi',
          description: 'Kariyer alanınızı belirleyin',
          earnedAt: new Date()
        },
        {
          userId: user.id,
          achievementId: 'first_chat',
          title: 'AI Danışman',
          description: 'AI ile ilk konuşmanızı yapın',
          earnedAt: new Date()
        }
      ];

      for (const achievement of achievements) {
        await prisma.userAchievement.create({
          data: achievement
        });
      }
      console.log('✅ Sample achievements added');
    }

    console.log('🎉 Database check completed!');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndAddData(); 