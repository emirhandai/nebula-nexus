const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

async function createSecureAdmin() {
  try {
    // Güvenli şifre oluştur
    const generateSecurePassword = () => {
      const length = 16;
      const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      let password = "";
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      return password;
    };

    const adminData = {
      name: 'Nebula Nexus Admin',
      email: 'admin@nebulanexus.com',
      password: generateSecurePassword(),
      role: 'admin',
      isActive: true
    };

    console.log('🔐 Güvenli Admin Hesabı Oluşturuluyor...');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Şifre:', adminData.password);
    console.log('⚠️  Bu şifreyi güvenli bir yere kaydedin!');

    // E-posta kontrolü
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email }
    });

    if (existingUser) {
      console.log('❌ Admin hesabı zaten mevcut!');
      return;
    }

    // Şifreyi güvenli bir şekilde hashle
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Admin kullanıcısını oluştur
    const adminUser = await prisma.user.create({
      data: {
        name: adminData.name,
        email: adminData.email,
        password: hashedPassword,
        role: adminData.role,
        isActive: adminData.isActive,
        emailVerified: new Date(),
        lastLoginAt: new Date(),
        // Güvenlik ayarları
        isPublic: false,
        showEmail: false,
        showPhone: false,
        showLocation: false,
        showStats: true,
        // Bildirim ayarları
        emailNotifications: true,
        pushNotifications: true,
        smsNotifications: false
      }
    });

    console.log('\n✅ Admin hesabı başarıyla oluşturuldu!');
    console.log('🆔 Kullanıcı ID:', adminUser.id);
    console.log('📅 Oluşturulma tarihi:', adminUser.createdAt);
    console.log('🔒 Rol:', adminUser.role);
    console.log('✅ Aktif:', adminUser.isActive);
    
    console.log('\n📋 Giriş Bilgileri:');
    console.log('Email: ' + adminData.email);
    console.log('Şifre: ' + adminData.password);
    
    console.log('\n⚠️  ÖNEMLİ: Bu şifreyi güvenli bir yere kaydedin!');
    console.log('🔐 Şifre hash\'lendi ve güvenli bir şekilde saklandı.');

  } catch (error) {
    console.error('❌ Admin oluşturma hatası:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSecureAdmin(); 