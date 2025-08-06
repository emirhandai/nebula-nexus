const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function clearCareerRecommendations() {
  try {
    console.log('Clearing all career recommendations...');
    
    const result = await prisma.careerRecommendation.deleteMany({});
    
    console.log(`Deleted ${result.count} career recommendations`);
    
  } catch (error) {
    console.error('Error clearing career recommendations:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearCareerRecommendations(); 