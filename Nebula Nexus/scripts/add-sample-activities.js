const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleActivities() {
  try {
    console.log('🔄 Adding sample activities...');

    // Get the first user
    const user = await prisma.user.findFirst();
    if (!user) {
      console.log('❌ No user found');
      return;
    }

    console.log('👤 User found:', user.email);

    // Add sample activity logs
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
      },
      {
        userId: user.id,
        type: 'chat_session',
        title: 'AI Chat Oturumu Başlatıldı',
        description: 'AI ile yeni bir sohbet oturumu başlattınız.',
        data: JSON.stringify({
          sessionId: 'sample-session-2',
          title: 'Teknoloji Sohbeti'
        })
      },
      {
        userId: user.id,
        type: 'course_completed',
        title: 'Kurs Tamamlandı',
        description: 'Python ile Makine Öğrenmesi kursunu başarıyla tamamladınız.',
        data: JSON.stringify({
          courseId: 'python-ml-course',
          progress: 100,
          completedAt: new Date()
        })
      }
    ];

    for (const activity of activities) {
      await prisma.activityLog.create({
        data: {
          ...activity,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Random date within last 7 days
        }
      });
    }

    console.log('✅ Sample activities added successfully');

         // Add sample course progress
     const courseProgress = await prisma.courseProgress.create({
       data: {
         userId: user.id,
         courseId: 'python-ml-course',
         courseTitle: 'Python ile Makine Öğrenmesi',
         platform: 'BTK Akademi',
         progress: 100,
         completed: true,
         completedAt: new Date(),
         startedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) // 14 days ago
       }
     });

    console.log('✅ Sample course progress added');

    // Add sample achievements
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

    console.log('🎉 All sample data added successfully!');

  } catch (error) {
    console.error('❌ Error adding sample activities:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleActivities(); 