const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addSampleMessages() {
  try {
    console.log('Örnek mesajlar ekleniyor...');

    // Get existing users
    const users = await prisma.user.findMany({
      take: 3
    });

    if (users.length < 2) {
      console.log('En az 2 kullanıcı gerekli. Önce kullanıcılar oluşturun.');
      return;
    }

    // Get existing projects
    const projects = await prisma.project.findMany({
      take: 2
    });

    const sampleMessages = [
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        subject: 'Proje Hakkında Soru',
        content: 'Merhaba! Projenizle ilgili birkaç sorum var. Hangi teknolojileri kullanmayı planlıyorsunuz?',
        projectId: projects.length > 0 ? projects[0].id : null
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        subject: 'Proje Teknolojileri',
        content: 'React ve Node.js kullanmayı düşünüyorum. Backend için Express.js ve veritabanı olarak PostgreSQL kullanacağız.',
        projectId: projects.length > 0 ? projects[0].id : null
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        subject: 'Ekip Üyeliği',
        content: 'Projenize katılmak istiyorum. Frontend geliştirme konusunda deneyimim var. Nasıl başvurabilirim?',
        projectId: projects.length > 0 ? projects[0].id : null
      },
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        subject: 'Hoş Geldiniz!',
        content: 'Harika! Projemize katılmak istediğiniz için teşekkürler. GitHub profilinizi paylaşabilir misiniz?',
        projectId: projects.length > 0 ? projects[0].id : null
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        subject: 'GitHub Profili',
        content: 'GitHub profilim: github.com/example. Portfolio sitem de var: example.com. İnceleyebilir misiniz?',
        projectId: projects.length > 0 ? projects[0].id : null
      }
    ];

    // Add messages
    for (const messageData of sampleMessages) {
      await prisma.message.create({
        data: messageData
      });
    }

    console.log(`${sampleMessages.length} örnek mesaj başarıyla eklendi!`);
    
    // Add some unread messages
    const unreadMessages = [
      {
        senderId: users[1].id,
        receiverId: users[0].id,
        subject: 'Yeni Proje Önerisi',
        content: 'Yeni bir AI projesi başlatmayı düşünüyorum. İlgilenir misiniz?',
        isRead: false
      },
      {
        senderId: users[0].id,
        receiverId: users[1].id,
        subject: 'Toplantı Önerisi',
        content: 'Proje hakkında konuşmak için bir toplantı yapalım mı?',
        isRead: false
      }
    ];

    for (const messageData of unreadMessages) {
      await prisma.message.create({
        data: messageData
      });
    }

    console.log(`${unreadMessages.length} okunmamış mesaj eklendi!`);

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addSampleMessages(); 