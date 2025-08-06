import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, scores, answers, onetScores, onetAnswers, testDuration, questionsAnswered } = body;

    // Input validation
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!scores || !answers) {
      return NextResponse.json({ error: 'Scores and answers are required' }, { status: 400 });
    }

    // Normalize scores to 1-5 scale
    const normalizedScores = {
      openness: Math.min(5, Math.max(1, scores.openness / 20)),
      conscientiousness: Math.min(5, Math.max(1, scores.conscientiousness / 20)),
      extraversion: Math.min(5, Math.max(1, scores.extraversion / 20)),
      agreeableness: Math.min(5, Math.max(1, scores.agreeableness / 20)),
      neuroticism: Math.min(5, Math.max(1, scores.neuroticism / 20))
    };

    // Generate career recommendations
    const careerRecommendations = await generateCareerRecommendationsWithGemini(
      normalizedScores,
      onetScores || {},
      answers,
      onetAnswers
    );

    // Save to database
    try {
      // OCEAN sonuçlarını kaydet
      const oceanResultData: any = {
        userId,
        openness: scores.openness,
        conscientiousness: scores.conscientiousness,
        extraversion: scores.extraversion,
        agreeableness: scores.agreeableness,
        neuroticism: scores.neuroticism,
        testDuration,
        questionsAnswered,
        recommendedFields: JSON.stringify(careerRecommendations.map(r => r.field))
      };

      // Add optional fields only if they exist
      if (answers) {
        oceanResultData.answers = JSON.stringify(answers);
      }
      if (onetScores) {
        oceanResultData.onetScores = JSON.stringify(onetScores);
      }
      if (onetAnswers) {
        oceanResultData.onetAnswers = JSON.stringify(onetAnswers);
      }

      const oceanResult = await prisma.oceanResult.create({
        data: oceanResultData
      });

      // Kariyer önerilerini kaydet
      for (const recommendation of careerRecommendations) {
                 const careerData: any = {
           userId,
           oceanResultId: oceanResult.id,
           field: recommendation.field,
           confidence: recommendation.confidence,
           reasoning: recommendation.reasoning,
           description: recommendation.reasoning || recommendation.field // description field'ı zorunlu
         };

        // Add optional fields only if they exist
        if (recommendation.learningPath) {
          careerData.learningPath = recommendation.learningPath;
        }
        if (recommendation.nextSteps) {
          careerData.nextSteps = recommendation.nextSteps;
        }
        if (recommendation.requiredSkills) {
          careerData.requiredSkills = JSON.stringify(recommendation.requiredSkills);
        }
        if (recommendation.salaryRange) {
          careerData.salaryRange = recommendation.salaryRange;
        }
        if (recommendation.jobMarket) {
          careerData.jobMarket = recommendation.jobMarket;
        }
        if (recommendation.onetCompatibility) {
          careerData.onetCompatibility = recommendation.onetCompatibility;
        }

        await prisma.careerRecommendation.create({
          data: careerData
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Test results saved successfully',
        oceanResultId: oceanResult.id,
        careerRecommendations: careerRecommendations,
        recommendations: careerRecommendations // Fallback için
      });

    } catch (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { error: 'Failed to save test results' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('OCEAN save result error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateCareerRecommendationsWithGemini(scores: any, onetScores: any, answers: number[], onetAnswers: number[]) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // OCEAN ve O*NET sorularını al
    const { oceanQuestions } = await import('@/data/ocean-questions');
    const { onetQuestions } = await import('@/data/onet-questions');

    // OCEAN skorlarını 1-5 ölçeğine çevir (0-100'den)
    const normalizedScores = {
      openness: Math.round((scores.openness / 100) * 5 * 10) / 10,
      conscientiousness: Math.round((scores.conscientiousness / 100) * 5 * 10) / 10,
      extraversion: Math.round((scores.extraversion / 100) * 5 * 10) / 10,
      agreeableness: Math.round((scores.agreeableness / 100) * 5 * 10) / 10,
      neuroticism: Math.round((scores.neuroticism / 100) * 5 * 10) / 10
    };

    // O*NET skorlarını da normalize et
    const normalizedOnetScores = onetScores ? {
      technical: Math.round((onetScores.technical / 100) * 5 * 10) / 10,
      analytical: Math.round((onetScores.analytical / 100) * 5 * 10) / 10,
      creative: Math.round((onetScores.creative / 100) * 5 * 10) / 10,
      social: Math.round((onetScores.social / 100) * 5 * 10) / 10,
      soft: Math.round((onetScores.soft / 100) * 5 * 10) / 10,
      work_style: Math.round((onetScores.work_style / 100) * 5 * 10) / 10,
      work_context: Math.round((onetScores.work_context / 100) * 5 * 10) / 10,
      leadership: Math.round((onetScores.leadership / 100) * 5 * 10) / 10
    } : null;

    const prompt = `
Sen Nebula Nexus'un gelişmiş kariyer danışmanı AI asistanısın. Öğrencinin OCEAN kişilik testi ve O*NET ilgi alanları testinin TÜM SORULARINI VE CEVAPLARINI analiz ederek BİLGİSAYAR MÜHENDİSLİĞİ alanında kapsamlı kariyer önerileri ver.

=== TEST BİLGİLERİ ===
Test ID: ${Date.now()}-${Math.random().toString(36).substr(2, 9)}
Test Zamanı: ${new Date().toISOString()}

=== OCEAN KİŞİLİK TESTİ ===
OCEAN Puanları (1-5 ölçeği):
- Açıklık: ${normalizedScores.openness}/5 (Yaratıcılık, yenilikçilik, deneyimlere açıklık)
- Sorumluluk: ${normalizedScores.conscientiousness}/5 (Organizasyon, disiplin, hedef odaklılık)
- Dışadönüklük: ${normalizedScores.extraversion}/5 (Sosyallik, enerji, liderlik)
- Uyumluluk: ${normalizedScores.agreeableness}/5 (İşbirliği, güven, empati)
- Nörotizm: ${normalizedScores.neuroticism}/5 (Stres yönetimi, duygusal stabilite)

OCEAN Test Soruları ve Cevapları:
${oceanQuestions.map((q, index) => `${index + 1}. ${q.text} → Cevap: ${answers[index]}/5`).join('\n')}

=== O*NET İLGİ ALANLARI TESTİ ===
O*NET Puanları (1-5 ölçeği):
- Teknik: ${normalizedOnetScores?.technical || 0}/5
- Analitik: ${normalizedOnetScores?.analytical || 0}/5
- Yaratıcı: ${normalizedOnetScores?.creative || 0}/5
- Sosyal: ${normalizedOnetScores?.social || 0}/5
- Yumuşak Beceriler: ${normalizedOnetScores?.soft || 0}/5
- Çalışma Tarzı: ${normalizedOnetScores?.work_style || 0}/5
- Çalışma Ortamı: ${normalizedOnetScores?.work_context || 0}/5
- Liderlik: ${normalizedOnetScores?.leadership || 0}/5

O*NET Test Soruları ve Cevapları:
${onetQuestions.map((q, index) => `${index + 1}. ${q.question} → Cevap: ${onetAnswers[index]}/5`).join('\n')}

=== GÖREV ===
1. Önce kişilik tipini belirle (OCEAN sorularına ve cevaplarına göre)
2. Kişilik ve ilgi alanlarına göre en uygun kariyer alanlarını analiz et
3. Her alan için detaylı analiz yap
4. Öğrenme yolunu belirle
5. Sonraki adımları planla
6. Confidence score'ları gerçekçi olsun (0.1-1.0 arası)

=== ÖNEMLİ NOTLAR ===
- Kişilik ve ilgi alanlarına göre doğal analiz yap
- Her öneri için güçlü bir reasoning ver
- Confidence score'ları kişilik puanlarına göre hesapla
- Öğrenme yolları pratik ve gerçekçi olsun
- Sonraki adımlar spesifik ve uygulanabilir olsun

=== BİLGİSAYAR MÜHENDİSLİĞİ KARİYER ALANLARI ===
Aşağıdaki alanları analiz et ve kişiliğe uygun olanları öner:

1. Frontend Geliştirici (React, Vue, Angular, TypeScript)
2. Backend Geliştirici (Node.js, Python, Java, C#, Go, Rust)
3. Full Stack Geliştirici (MERN, MEAN, LAMP stack)
4. Mobil Geliştirici (iOS/Swift, Android/Kotlin, React Native, Flutter)
5. DevOps Mühendisi (Docker, Kubernetes, AWS, Azure, CI/CD)
6. Veri Mühendisi (ETL, Veri Ambarı, Büyük Veri, Apache Spark)
7. Yapay Zeka/Makine Öğrenmesi Mühendisi (TensorFlow, PyTorch, Scikit-learn, Derin Öğrenme)
8. Siber Güvenlik Mühendisi (Ağ Güvenliği, Penetrasyon Testi, Güvenlik Mimarisi)
9. Oyun Geliştirici (Unity, Unreal Engine, C++, Oyun Tasarımı)
10. Kullanıcı Arayüzü/Deneyimi Geliştirici (Figma, Adobe XD, Kullanıcı Araştırması, Prototipleme)
11. Kalite Güvencesi Mühendisi (Test Otomasyonu, Selenium, Performans Testi, Manuel Test)
12. Teknik Lider (Mimari Tasarım, Kod İnceleme, Ekip Liderliği)
13. Ürün Yöneticisi (Teknik) (Ürün Stratejisi, Yol Haritası, Paydaş Yönetimi)
14. Sistem Yöneticisi (Linux, Windows Server, Ağ Yönetimi)
15. Bulut Mühendisi (AWS, Azure, GCP, Altyapı Kodu)
16. Gömülü Sistemler Mühendisi (C/C++, Mikrodenetleyiciler, IoT, Gerçek Zamanlı Sistemler)
17. Robotik Mühendisi (ROS, Bilgisayarlı Görü, Kontrol Sistemleri, Otomasyon)
18. Ağ Mühendisi (Cisco, Ağ Tasarımı, Yönlendirme, Anahtarlama)
19. Veritabanı Yöneticisi (SQL, NoSQL, Performans Optimizasyonu, Yedekleme/Geri Yükleme)
20. Makine Öğrenmesi Mühendisi (MLOps, Model Dağıtımı, Özellik Mühendisliği)
21. Veri Bilimci (İstatistiksel Analiz, Veri Görselleştirme, Tahmine Dayalı Modelleme)
22. Yapay Zeka/Makine Öğrenmesi Araştırmacısı (Araştırma Makaleleri, Algoritma Geliştirme, Akademik İşbirliği)
23. Blockchain Geliştirici (Akıllı Sözleşmeler, DApps, Web3, Kriptografi)
24. Bilgisayarlı Görü Mühendisi (OpenCV, Görüntü İşleme, Derin Öğrenme)
25. Doğal Dil İşleme Mühendisi (NLP, Transformers, BERT, GPT)
26. Yazılım Mimarı (Sistem Tasarımı, Ölçeklenebilirlik, Performans Optimizasyonu)
27. Site Güvenilirlik Mühendisi (SRE) (İzleme, Olay Müdahalesi, Otomasyon)
28. Teknik Yazar (Dokümantasyon, API Dokümantasyonu, Kullanıcı Kılavuzları, Teknik İçerik)
29. Çözüm Mimarı (Kurumsal Mimari, Entegrasyon, Danışmanlık)
30. Araştırma ve Geliştirme Mühendisi (İnovasyon, Patent Geliştirme, Akademik Araştırma)

=== KRİTİK PUANLAMA KURALLARI ===
PUANLAMA MANTIĞI (REHBER OLARAK KULLAN):

1. OCEAN Puanları ile Kariyer Uyumluluğu:
   - Yüksek puanlar (4-5/5) genellikle ilgili alanlarda yüksek uyum gösterir
   - Düşük puanlar (1-2/5) genellikle ilgili alanlarda düşük uyum gösterir
   - Orta puanlar (3/5) orta uyum gösterir

2. Genel Prensipler:
   - Açıklık yüksek → Yaratıcılık gerektiren alanlar
   - Sorumluluk yüksek → Sistematik ve organize alanlar
   - Dışadönüklük yüksek → Ekip çalışması gerektiren alanlar
   - Uyumluluk yüksek → Kullanıcı odaklı alanlar
   - Nörotizm düşük → Stres yönetimi gerektiren alanlar

3. O*NET Puanlarını da analiz et ve kişilik ile birleştirerek kapsamlı bir değerlendirme yap.

AI olarak, bu genel prensipleri kullanarak kendi analiz yeteneğinle en uygun kariyer alanlarını belirle. Teknoloji isimlerini orijinal halleriyle kullan (React, Python, Docker vb.).

JSON formatında döndür:
{
  "personalityType": {
    "type": "Kişilik Tipi Adı",
    "description": "Detaylı açıklama (OCEAN sorularına göre)",
    "strengths": ["Güçlü yanlar"],
    "weaknesses": ["Geliştirilmesi gereken alanlar"],
    "idealWorkEnvironment": "İdeal çalışma ortamı",
    "oceanAnalysis": "OCEAN puanlarının detaylı analizi"
  },
  "recommendations": [
    {
      "field": "Alan Adı",
      "confidence": 0.85,
      "reasoning": "Neden bu alan uygun (sorulara ve cevaplara göre detaylı analiz)",
      "learningPath": "Öğrenme yolu (adım adım)",
      "nextSteps": "3-6 ay içinde yapılacaklar",
      "requiredSkills": ["Gerekli beceriler"],
      "salaryRange": "Maaş aralığı",
      "jobMarket": "İş piyasası durumu",
      "onetCompatibility": "O*NET puanlarıyla uyumluluk analizi"
    }
  ],
  "overallAnalysis": {
    "summary": "Genel değerlendirme",
    "careerAdvice": "Kariyer tavsiyeleri",
    "developmentAreas": "Geliştirilmesi gereken alanlar",
    "timeline": "Kariyer gelişim zaman çizelgesi",
    "questionAnalysis": "Sorulara verilen cevapların detaylı analizi"
  }
}

Sadece JSON döndür, markdown kullanma. Her öneri bilgisayar mühendisliği ile ilgili olsun.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean the response - remove markdown formatting
    let cleanText = text;
    if (cleanText.includes('```json')) {
      cleanText = cleanText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }
    if (cleanText.includes('```')) {
      cleanText = cleanText.replace(/```\n?/g, '');
    }
    
    // JSON parse etmeye çalış
    try {
      const parsed = JSON.parse(cleanText);
      const recommendations = parsed.recommendations || [];
      
      // Gemini'den gelen önerileri olduğu gibi döndür - manipüle etme!
      return recommendations;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Cleaned text:', cleanText);
      
      // Fallback: Basit yazılım önerileri
      return generateFallbackSoftwareRecommendations(scores);
    }
    
  } catch (error) {
    console.error('Gemini API error:', error);
    
    // Fallback: Basit yazılım önerileri
    return generateFallbackSoftwareRecommendations(scores);
  }
}

function generateFallbackSoftwareRecommendations(scores: any) {
  // Skorları 1-5 ölçeğine normalize et
  const normalizedScores = {
    openness: Math.round((scores.openness / 100) * 5 * 10) / 10,
    conscientiousness: Math.round((scores.conscientiousness / 100) * 5 * 10) / 10,
    extraversion: Math.round((scores.extraversion / 100) * 5 * 10) / 10,
    agreeableness: Math.round((scores.agreeableness / 100) * 5 * 10) / 10,
    neuroticism: Math.round((scores.neuroticism / 100) * 5 * 10) / 10
  };

  const recommendations: any[] = [];

  // Açıklık yüksekse - yaratıcı alanlar (YÜKSEK PUAN = YÜKSEK UYUMLULUK)
  if (normalizedScores.openness > 3.5) {
    recommendations.push({
      field: 'Frontend Developer',
      confidence: 0.85,
      reasoning: 'Yüksek açıklık skorunuz (4-5/5), yaratıcı UI tasarımı ve kullanıcı deneyimi konularında başarılı olacağınızı gösteriyor.',
      learningPath: 'HTML/CSS → JavaScript → React → TypeScript → Advanced React',
      nextSteps: '1. Udemy\'de React kursu al 2. Portfolio projesi yap 3. GitHub\'da aktif ol'
    });
  } else if (normalizedScores.openness < 2.5) {
    recommendations.push({
      field: 'Backend Developer',
      confidence: 0.75,
      reasoning: 'Düşük açıklık skorunuz (1-2/5), sistematik ve yapılandırılmış backend geliştirme alanında daha başarılı olacağınızı gösteriyor.',
      learningPath: 'Python/Java → SQL → Node.js → Docker → Microservices',
      nextSteps: '1. Python veya Java öğren 2. Veritabanı tasarımı yap 3. API geliştir'
    });
  }

  // Sorumluluk yüksekse - sistematik alanlar (YÜKSEK PUAN = YÜKSEK UYUMLULUK)
  if (normalizedScores.conscientiousness > 3.5) {
    recommendations.push({
      field: 'DevOps Engineer',
      confidence: 0.90,
      reasoning: 'Yüksek sorumluluk skorunuz (4-5/5), sistematik kod yazma ve sistem yönetimi konularında mükemmeliyetçilik göstereceğinizi belirtiyor.',
      learningPath: 'Linux → Docker → Kubernetes → AWS/Azure → CI/CD',
      nextSteps: '1. Linux sistem yönetimi öğren 2. Docker containerization 3. Cloud platformları keşfet'
    });
  } else if (normalizedScores.conscientiousness < 2.5) {
    recommendations.push({
      field: 'Creative Developer',
      confidence: 0.65,
      reasoning: 'Düşük sorumluluk skorunuz (1-2/5), daha esnek ve yaratıcı geliştirme alanlarında başarılı olabilirsiniz.',
      learningPath: 'Creative Coding → Game Development → Interactive Media',
      nextSteps: '1. Creative coding öğren 2. Oyun geliştirme projeleri yap 3. Sanatsal projeler keşfet'
    });
  }

  // Dışadönüklük yüksekse - ekip çalışması (YÜKSEK PUAN = YÜKSEK UYUMLULUK)
  if (normalizedScores.extraversion > 3.5) {
    recommendations.push({
      field: 'Full Stack Developer',
      confidence: 0.85,
      reasoning: 'Yüksek dışadönüklük skorunuz (4-5/5), hem frontend hem backend alanlarında ekip çalışması yapabileceğinizi gösteriyor.',
      learningPath: 'HTML/CSS → JavaScript → React → Node.js → Database → DevOps',
      nextSteps: '1. MERN stack öğren 2. Tam proje geliştir 3. Ekip projelerine katıl'
    });
  } else if (normalizedScores.extraversion < 2.5) {
    recommendations.push({
      field: 'Data Engineer',
      confidence: 0.80,
      reasoning: 'Düşük dışadönüklük skorunuz (1-2/5), bağımsız çalışma gerektiren veri mühendisliği alanında başarılı olacağınızı gösteriyor.',
      learningPath: 'SQL → Python → ETL → Big Data → Data Warehousing',
      nextSteps: '1. SQL ve Python öğren 2. ETL süreçleri anla 3. Big Data teknolojileri keşfet'
    });
  }

  // Uyumluluk yüksekse - kullanıcı odaklı (YÜKSEK PUAN = YÜKSEK UYUMLULUK)
  if (normalizedScores.agreeableness > 3.5) {
    recommendations.push({
      field: 'UI/UX Developer',
      confidence: 0.80,
      reasoning: 'Yüksek uyumluluk skorunuz (4-5/5), kullanıcı ihtiyaçlarını anlama ve empatik tasarım konularında başarılı olacağınızı gösteriyor.',
      learningPath: 'Design Principles → Figma → HTML/CSS → JavaScript → React',
      nextSteps: '1. UI/UX tasarım prensiplerini öğren 2. Figma ile tasarım yap 3. Portfolio oluştur'
    });
  } else if (normalizedScores.agreeableness < 2.5) {
    recommendations.push({
      field: 'Cybersecurity Engineer',
      confidence: 0.75,
      reasoning: 'Düşük uyumluluk skorunuz (1-2/5), eleştirel düşünme ve güvenlik analizi konularında başarılı olacağınızı gösteriyor.',
      learningPath: 'Network Security → Penetration Testing → Security Architecture',
      nextSteps: '1. Ağ güvenliği öğren 2. Penetrasyon testi yap 3. Güvenlik sertifikaları al'
    });
  }

  // Nörotizm düşükse - stresli alanlar (DÜŞÜK PUAN = YÜKSEK UYUMLULUK - bu ters)
  if (normalizedScores.neuroticism < 2.5) {
    recommendations.push({
      field: 'System Administrator',
      confidence: 0.90,
      reasoning: 'Düşük nörotik skorunuz (1-2/5), yüksek stres altında sakin kalma ve sistem yönetimi konularında başarılı olacağınızı belirtiyor.',
      learningPath: 'Linux → Windows Server → Network Management → Cloud Services',
      nextSteps: '1. Linux sistem yönetimi öğren 2. Ağ yönetimi anla 3. Cloud platformları keşfet'
    });
  } else if (normalizedScores.neuroticism > 3.5) {
    recommendations.push({
      field: 'Technical Writer',
      confidence: 0.70,
      reasoning: 'Yüksek nörotik skorunuz (4-5/5), daha az stresli teknik yazarlık alanında başarılı olabilirsiniz.',
      learningPath: 'Technical Writing → Documentation → API Docs → User Guides',
      nextSteps: '1. Teknik yazarlık öğren 2. Dokümantasyon yap 3. API dokümantasyonu yaz'
    });
  }

  // Eğer hiç öneri yoksa, genel yazılım önerisi
  if (recommendations.length === 0) {
    recommendations.push({
      field: 'Software Developer',
      confidence: 0.75,
      reasoning: 'Genel yazılım geliştirme alanında başarılı olabilirsiniz. Farklı projeler deneyerek hangi alanın size en uygun olduğunu keşfedebilirsiniz.',
      learningPath: 'Programming Basics → Web Development → Specialization',
      nextSteps: '1. Temel programlama öğren 2. Web geliştirme projeleri yap 3. İlgi alanınızı keşfedin'
    });
  }

  // Tüm önerileri döndür - AI'ın verdiği önerileri manipüle etme!
  return recommendations;
} 