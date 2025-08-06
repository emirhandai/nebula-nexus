const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCareerRecommendations() {
  try {
    console.log('=== Kariyer Önerileri API Testi ===\n');

    // Test kullanıcısını bul
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 1
        },
        careerRecommendations: {
          orderBy: { confidence: 'desc' }
        }
      }
    });

    if (!testUser) {
      console.log('Test kullanıcısı bulunamadı!');
      return;
    }

    console.log('Test Kullanıcısı:', testUser.name, `(${testUser.email})`);
    console.log('User ID:', testUser.id);
    console.log('OCEAN Testleri:', testUser.oceanResults.length);
    console.log('Mevcut Kariyer Önerileri:', testUser.careerRecommendations.length);

    if (testUser.oceanResults.length > 0) {
      const latestTest = testUser.oceanResults[0];
      console.log('\nEn Son OCEAN Test Sonuçları:');
      console.log('Test Tarihi:', latestTest.testDate);
      console.log('Açıklık:', latestTest.openness);
      console.log('Sorumluluk:', latestTest.conscientiousness);
      console.log('Dışadönüklük:', latestTest.extraversion);
      console.log('Uyumluluk:', latestTest.agreeableness);
      console.log('Nörotizm:', latestTest.neuroticism);
    }

    if (testUser.careerRecommendations.length > 0) {
      console.log('\nMevcut Kariyer Önerileri:');
      testUser.careerRecommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.field} - ${rec.confidence}% uyum`);
        console.log(`   Açıklama: ${rec.reasoning}`);
      });
    } else {
      console.log('\nKariyer önerisi bulunamadı. Yeni öneriler oluşturulacak...');
      
      // Yeni öneriler oluştur
      if (testUser.oceanResults.length > 0) {
        const latestTest = testUser.oceanResults[0];
        
        // OCEAN skorlarını 0-100 ölçeğine çevir
        const convertTo100Scale = (score) => Math.round((score / 5) * 100);
        
        const oceanScores100 = {
          openness: convertTo100Scale(latestTest.openness),
          conscientiousness: convertTo100Scale(latestTest.conscientiousness),
          extraversion: convertTo100Scale(latestTest.extraversion),
          agreeableness: convertTo100Scale(latestTest.agreeableness),
          neuroticism: convertTo100Scale(latestTest.neuroticism)
        };

        console.log('\n0-100 Ölçeğindeki OCEAN Skorları:', oceanScores100);

        // Kariyer alanları ve gereksinimleri
        const careerFields = [
          {
            field: 'AI & Machine Learning',
            requirements: { openness: 80, conscientiousness: 70, extraversion: 40, agreeableness: 50, neuroticism: 30 },
            reasoning: 'Yüksek açıklık ve sorumluluk skorlarınız, yaratıcı problem çözme ve sistematik düşünme gerektiren AI alanında başarılı olmanızı sağlar.'
          },
          {
            field: 'Frontend Development',
            requirements: { openness: 60, conscientiousness: 70, extraversion: 50, agreeableness: 60, neuroticism: 40 },
            reasoning: 'Orta düzey dışadönüklük ve uyumluluk skorlarınız, kullanıcı deneyimi odaklı frontend geliştirmede avantaj sağlar.'
          },
          {
            field: 'Mobile Development',
            requirements: { openness: 65, conscientiousness: 75, extraversion: 60, agreeableness: 55, neuroticism: 35 },
            reasoning: 'Yüksek sorumluluk ve dışadönüklük skorlarınız, mobil uygulama geliştirmede hem teknik hem de kullanıcı odaklı çalışmanızı sağlar.'
          },
          {
            field: 'Cybersecurity',
            requirements: { openness: 70, conscientiousness: 80, extraversion: 40, agreeableness: 45, neuroticism: 25 },
            reasoning: 'Yüksek sorumluluk ve düşük nörotizm skorlarınız, detay odaklı ve stresli ortamlarda çalışmayı gerektiren siber güvenlik alanında başarılı olmanızı sağlar.'
          },
          {
            field: 'Data Engineering',
            requirements: { openness: 75, conscientiousness: 75, extraversion: 45, agreeableness: 50, neuroticism: 30 },
            reasoning: 'Yüksek açıklık ve sorumluluk skorlarınız, büyük veri analizi ve sistem tasarımı gerektiren veri mühendisliği alanında avantaj sağlar.'
          }
        ];

        // Uyum skorlarını hesapla
        const recommendations = careerFields.map(field => {
          const { requirements } = field;
          let totalMatch = 0;
          let maxPossible = 0;

          Object.entries(requirements).forEach(([trait, requiredScore]) => {
            const userScore = oceanScores100[trait] || 0;
            const match = Math.max(0, 100 - Math.abs(userScore - requiredScore));
            totalMatch += match;
            maxPossible += 100;
          });

          const confidence = Math.round((totalMatch / maxPossible) * 100);
          
          return {
            field: field.field,
            confidence,
            reasoning: field.reasoning
          };
        });

        // En yüksek uyumlu 5 alanı seç
        recommendations.sort((a, b) => b.confidence - a.confidence);
        const topRecommendations = recommendations.slice(0, 5);

        console.log('\nHesaplanan Kariyer Önerileri:');
        topRecommendations.forEach((rec, index) => {
          console.log(`${index + 1}. ${rec.field} - ${rec.confidence}% uyum`);
          console.log(`   Açıklama: ${rec.reasoning}`);
        });

        // Veritabanına kaydet
        console.log('\nVeritabanına kaydediliyor...');
        const savedRecommendations = await Promise.all(
          topRecommendations.map(rec => 
            prisma.careerRecommendation.create({
              data: {
                userId: testUser.id,
                field: rec.field,
                confidence: rec.confidence,
                reasoning: rec.reasoning
              }
            })
          )
        );

        console.log(`${savedRecommendations.length} kariyer önerisi başarıyla kaydedildi!`);
      }
    }

  } catch (error) {
    console.error('Test sırasında hata oluştu:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCareerRecommendations(); 