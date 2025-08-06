const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function fixAdmin() {
  try {
    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Admin hesabını güncelle
    const updatedAdmin = await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: {
        role: 'admin',
        password: hashedPassword,
        isActive: true
      }
    });

    console.log('Admin hesabı başarıyla güncellendi!');
    console.log('E-posta:', updatedAdmin.email);
    console.log('Rol:', updatedAdmin.role);
    console.log('Şifre güncellendi: admin123');

  } catch (error) {
    console.error('Admin güncelleme hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixAdmin(); 