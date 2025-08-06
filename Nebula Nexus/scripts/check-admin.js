const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAdmin() {
  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@nebulanexus.com' }
    });

    if (adminUser) {
      console.log('Admin hesabı bulundu:');
      console.log('ID:', adminUser.id);
      console.log('E-posta:', adminUser.email);
      console.log('İsim:', adminUser.name);
      console.log('Rol:', adminUser.role);
      console.log('Aktif:', adminUser.isActive);
      console.log('Şifre var mı:', !!adminUser.password);
      console.log('Oluşturulma tarihi:', adminUser.createdAt);
    } else {
      console.log('Admin hesabı bulunamadı!');
      
      // Tüm kullanıcıları listele
      const allUsers = await prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
          createdAt: true
        }
      });
      
      console.log('\nMevcut kullanıcılar:');
      allUsers.forEach(user => {
        console.log(`- ${user.email} (${user.name}) - ${user.role} - ${user.isActive ? 'Aktif' : 'Pasif'}`);
      });
    }

  } catch (error) {
    console.error('Hata:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAdmin(); 