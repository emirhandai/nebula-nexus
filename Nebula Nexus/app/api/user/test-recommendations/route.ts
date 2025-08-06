import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/gemini';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;

    // Kullanıcının test geçmişini al
    const testHistory = await prisma.oceanResult.findMany({
      where: { userId },
      orderBy: { testDate: 'desc' },
      take: 5 // Son 5 test
    });

    if (testHistory.length === 0) {
      return NextResponse.json({
        success: true,
        recommendations: [],
        message: 'Henüz test sonucunuz bulunmuyor. İlk testinizi çözerek öneriler alabilirsiniz.'
      });
    }

    // En son test sonucunu al
    const latestTest = testHistory[0];
    const averageScore = (latestTest.openness + latestTest.conscientiousness + latestTest.extraversion + latestTest.agreeableness + latestTest.neuroticism) / 5;

    // Test geçmişi analizi
    const scoreTrends = testHistory.length > 1 ? {
      openness: testHistory[0].openness - testHistory[testHistory.length - 1].openness,
      conscientiousness: testHistory[0].conscientiousness - testHistory[testHistory.length - 1].conscientiousness,
      extraversion: testHistory[0].extraversion - testHistory[testHistory.length - 1].extraversion,
      agreeableness: testHistory[0].agreeableness - testHistory[testHistory.length - 1].agreeableness,
      neuroticism: testHistory[0].neuroticism - testHistory[testHistory.length - 1].neuroticism
    } : null;

    // AI ile öneriler oluştur
    const prompt = `
    Kullanıcının OCEAN test sonuçlarına göre kişiselleştirilmiş test önerileri oluştur.
    
    En son test sonuçları:
    - Açıklık (Openness): ${latestTest.openness}/100
    - Sorumluluk (Conscientiousness): ${latestTest.conscientiousness}/100
    - Dışadönüklük (Extraversion): ${latestTest.extraversion}/100
    - Uyumluluk (Agreeableness): ${latestTest.agreeableness}/100
    - Duygusal Dengelilik (Neuroticism): ${latestTest.neuroticism}/100
    - Ortalama Skor: ${averageScore.toFixed(1)}/100
    
    Test geçmişi: ${testHistory.length} test çözülmüş
    ${scoreTrends ? `
    Skor değişimleri (son test - ilk test):
    - Açıklık: ${scoreTrends.openness > 0 ? '+' : ''}${scoreTrends.openness}
    - Sorumluluk: ${scoreTrends.conscientiousness > 0 ? '+' : ''}${scoreTrends.conscientiousness}
    - Dışadönüklük: ${scoreTrends.extraversion > 0 ? '+' : ''}${scoreTrends.extraversion}
    - Uyumluluk: ${scoreTrends.agreeableness > 0 ? '+' : ''}${scoreTrends.agreeableness}
    - Duygusal Dengelilik: ${scoreTrends.neuroticism > 0 ? '+' : ''}${scoreTrends.neuroticism}
    ` : ''}
    
    Bu verilere göre şu konularda öneriler ver:
    1. Hangi OCEAN faktörlerini geliştirmeli
    2. Ne sıklıkla test çözmeli
    3. Test sonuçlarını nasıl yorumlamalı
    4. Kişilik gelişimi için öneriler
    5. Kariyer seçiminde dikkat edilecek noktalar
    
    JSON formatında döndür:
    {
      "recommendations": [
        {
          "category": "Gelişim Alanları",
          "title": "Başlık",
          "description": "Açıklama",
          "priority": "high/medium/low",
          "actionItems": ["Eylem 1", "Eylem 2"],
          "expectedOutcome": "Beklenen sonuç"
        }
      ],
      "nextTestDate": "2024-01-15",
      "focusAreas": ["Açıklık", "Sorumluluk"],
      "overallAssessment": "Genel değerlendirme"
    }
    `;

    const aiResponse = await chatWithAI(prompt, 'career-guidance');
    
    let recommendations;
    try {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        recommendations = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback öneriler
        recommendations = {
          recommendations: [
            {
              category: "Test Sıklığı",
              title: "Düzenli Test Çözümü",
              description: "Kişilik gelişiminizi takip etmek için ayda bir kez test çözmenizi öneriyoruz.",
              priority: "high",
              actionItems: ["Ayda bir test çöz", "Sonuçları karşılaştır", "Gelişim alanlarını belirle"],
              expectedOutcome: "Kişilik gelişiminizi daha iyi takip edebilirsiniz"
            }
          ],
          nextTestDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          focusAreas: ["Açıklık", "Sorumluluk"],
          overallAssessment: "Test sonuçlarınız genel olarak dengeli görünüyor. Düzenli test çözümü ile gelişiminizi takip edebilirsiniz."
        };
      }
    } catch (error) {
      console.error('AI response parse error:', error);
      return NextResponse.json({ error: 'Failed to generate recommendations' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations.recommendations,
      nextTestDate: recommendations.nextTestDate,
      focusAreas: recommendations.focusAreas,
      overallAssessment: recommendations.overallAssessment,
      testStats: {
        totalTests: testHistory.length,
        averageScore: averageScore.toFixed(1),
        lastTestDate: latestTest.testDate,
        scoreTrends
      }
    });

  } catch (error) {
    console.error('Error generating test recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 