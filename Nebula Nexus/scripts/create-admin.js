const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const adminData = {
      name: 'Admin',
      email: 'admin@nebulanexus.com',
      password: 'admin123',
      role: 'admin',
      isActive: true
    };

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingUser) {
      console.log('Admin hesabı zaten mevcut!');
      return;
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(adminData.password, 12);

    // Admin kullanıcısını oluştur
    const adminUser = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: adminData.isActive
      }
    });

    console.log('Admin hesabı başarıyla oluşturuldu!');
    console.log('E-posta:', adminData.email);
    console.log('Şifre:', adminData.password);
    console.log('Kullanıcı ID:', adminUser.id);

  } catch (error) {
    console.error('Admin oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 