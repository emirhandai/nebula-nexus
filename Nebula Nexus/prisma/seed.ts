import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Test kullanıcısı oluştur
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      id: 'test-user-001',
      email: 'test@example.com',
      name: 'Test Kullanıcı',
      password: 'hashedpassword123',
      role: 'user',
      isActive: true,
      isBanned: false
    },
  });

  console.log('✅ Test kullanıcısı oluşturuldu:', user.email);

  // OCEAN test sonucu oluştur
  const oceanResult = await prisma.oceanResult.upsert({
    where: { id: 'test-ocean-001' },
    update: {},
    create: {
      id: 'test-ocean-001',
      userId: user.id,
      openness: 0.75,
      conscientiousness: 0.80,
      extraversion: 0.65,
      agreeableness: 0.85,
      neuroticism: 0.30,
      recommendedFields: JSON.stringify(['Web Geliştirme', 'UI/UX Tasarım']),
      testDuration: 1800,
      questionsAnswered: 50
    },
  });

  console.log('✅ OCEAN test sonuçları oluşturuldu');

  console.log('✅ Database seeding tamamlandı');
}

main()
  .catch((e) => {
    console.error('❌ Seeding hatası:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 