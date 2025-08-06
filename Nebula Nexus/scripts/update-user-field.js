const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateUserField() {
  try {
    const user = await prisma.user.findFirst();
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { selectedField: 'Full Stack Developer' }
      });
      console.log('✅ User updated with selected field: Full Stack Developer');
    } else {
      console.log('❌ No user found');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserField(); 