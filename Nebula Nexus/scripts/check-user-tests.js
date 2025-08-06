const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUserTests() {
  try {
    // Get all users with their test results
    const users = await prisma.user.findMany({
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 1
        },
        careerRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    console.log(`Found ${users.length} users:`);
    console.log('');

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name || 'İsimsiz'} (${user.email})`);
      console.log(`   Role: ${user.role}`);
      console.log(`   OCEAN Tests: ${user.oceanResults.length}`);
      
      if (user.oceanResults.length > 0) {
        const latestTest = user.oceanResults[0];
        console.log(`   Latest Test Date: ${latestTest.testDate}`);
        console.log(`   Scores: O=${Math.round(latestTest.openness)}, C=${Math.round(latestTest.conscientiousness)}, E=${Math.round(latestTest.extraversion)}, A=${Math.round(latestTest.agreeableness)}, N=${Math.round(latestTest.neuroticism)}`);
      }
      
      console.log(`   Career Recommendations: ${user.careerRecommendations.length}`);
      console.log(`   Selected Field: ${user.selectedField || 'Seçilmemiş'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error checking user tests:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserTests(); 