import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback content generator
function generateFallbackContent(type: string, category: string) {
  switch (type) {
    case 'quiz':
      return {
        quiz: {
          title: `${category} Quiz`,
          difficulty: 'intermediate',
          questions: [
            {
              question: `${category} alanında en önemli beceri hangisidir?`,
              options: [
                'A) Problem çözme',
                'B) İletişim',
                'C) Teknik bilgi',
                'D) Hepsi'
              ],
              correct: 'D) Hepsi',
              explanation: 'Başarılı bir kariyerde tüm beceriler önemlidir.'
            },
            {
              question: `${category} öğrenirken hangi kaynak en faydalıdır?`,
              options: [
                'A) Online kurslar',
                'B) Pratik projeler',
                'C) Mentoring',
                'D) Tümü'
              ],
              correct: 'D) Tümü',
              explanation: 'Farklı öğrenme yöntemleri birbirini destekler.'
            }
          ]
        }
      };
      
    case 'roadmap':
      return {
        roadmap: {
          title: `${category} Öğrenme Yol Haritası`,
          duration: '3-6 ay',
          phases: [
            {
              phase: 1,
              title: 'Temel Kavramlar',
              duration: '2-3 hafta',
              topics: ['Terminoloji', 'Genel kavramlar', 'Araçlar'],
              skills: ['Araştırma', 'Dokümantasyon okuma']
            },
            {
              phase: 2,
              title: 'Pratik Uygulamalar',
              duration: '4-6 hafta',
              topics: ['Basit projeler', 'Örnekler', 'Egzersizler'],
              skills: ['Problem çözme', 'Uygulama']
            },
            {
              phase: 3,
              title: 'İleri Seviye',
              duration: '6-8 hafta',
              topics: ['Karmaşık projeler', 'Best practices', 'Optimizasyon'],
              skills: ['Analiz', 'Optimize etme']
            }
          ],
          personalizedTips: [
            'Günlük 1-2 saat çalışarak düzenli olun',
            'Pratik projeler yaparak öğrendiklerinizi pekiştirin',
            'Toplulukta aktif olun ve sorular sorun'
          ]
        }
      };
      
    case 'project_idea':
      return {
        projects: [
          {
            title: `${category} Başlangıç Projesi`,
            description: 'Temel kavramları öğrenmek için ideal proje',
            difficulty: 'beginner',
            duration: '1-2 hafta',
            technologies: ['Temel araçlar'],
            learningGoals: ['Pratik deneyim', 'Kavram pekiştirme']
          },
          {
            title: `${category} Orta Seviye Proje`,
            description: 'Becerilerinizi geliştirmek için kapsamlı proje',
            difficulty: 'intermediate',
            duration: '3-4 hafta',
            technologies: ['İleri araçlar', 'Framework\'ler'],
            learningGoals: ['Karmaşık problem çözme', 'Proje yönetimi']
          }
        ]
      };
      
    case 'interview_prep':
      return {
        interview: {
          category: category,
          level: 'intermediate',
          questions: [
            {
              question: `${category} alanında kendinizi nasıl geliştiriyorsunuz?`,
              expectedAnswer: 'Sürekli öğrenme, pratik projeler ve topluluk etkinlikleri ile kendimi geliştiriyorum.',
              tips: 'Somut örnekler verin'
            },
            {
              question: `${category} alanında karşılaştığınız en büyük zorluk neydi?`,
              expectedAnswer: 'Spesifik bir zorluğu ve onu nasıl çözdüğünüzü anlatın.',
              tips: 'Problem çözme becerinizi vurgulayın'
            }
          ]
        }
      };
      
    default:
      return {
        message: 'İçerik üretildi ancak Gemini quota limit aşıldığı için genel bir örnek sunuluyor.',
        suggestion: 'Daha detaylı içerik için yarın tekrar deneyin.'
      };
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userId, 
      contentType, 
      userProfile, 
      topic, 
      difficulty, 
      format 
    } = await request.json();

    // Gemini 2.0 Flash kullan (GA version)
    let model;
    try {
      model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
      console.log('Using Gemini 2.0 Flash GA version');
    } catch (error) {
      try {
        model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        console.log('Using Gemini 2.0 Flash');
      } catch (error2) {
        console.log('Gemini 2.0 Flash not available, falling back to 1.5 Flash');
        model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      }
    }

    let prompt = '';

    switch (contentType) {
      case 'roadmap':
        prompt = `
        Bu kullanıcı için ${topic} konusunda ${difficulty} seviyesinde öğrenme yol haritası oluştur:
        
        Kullanıcı Profili:
        - Alan: ${userProfile.selectedField}
        - OCEAN Skorları: ${JSON.stringify(userProfile.oceanScores)}
        - Mevcut Seviye: ${difficulty}
        
        Lütfen şu formatta yanıt ver:
        {
          "roadmap": {
            "title": "Kişiselleştirilmiş ${topic} Yol Haritası",
            "duration": "3-6 ay",
            "phases": [
              {
                "phase": 1,
                "title": "Temel Kavramlar",
                "duration": "2-3 hafta",
                "topics": ["HTML", "CSS"],
                "projects": ["Basit web sayfası"],
                "resources": ["MDN Web Docs"],
                "skills": ["Markup", "Styling"]
              }
            ],
            "personalizedTips": [
              "Yüksek sorumluluk skorun sayesinde düzenli çalışabilirsin",
              "Açıklık skorun ile yeni teknolojileri hızla öğrenebilirsin"
            ]
          }
        }
        `;
        break;

      case 'quiz':
        prompt = `
        ${topic} konusunda ${difficulty} seviyesinde 5 soruluk quiz oluştur:
        
        Lütfen şu formatta yanıt ver:
        {
          "quiz": {
            "title": "${topic} Quiz",
            "difficulty": "${difficulty}",
            "questions": [
              {
                "id": 1,
                "question": "React'te state nedir?",
                "options": ["A) Özellik", "B) Veri", "C) Fonksiyon", "D) Stil"],
                "correct": "B",
                "explanation": "State, komponentin değişken verilerini tutar"
              }
            ]
          }
        }
        `;
        break;

      case 'project_idea':
        prompt = `
        ${userProfile.selectedField} alanında ${difficulty} seviyesinde proje fikirleri ver:
        
        Kullanıcı Profili: ${JSON.stringify(userProfile)}
        
        Lütfen şu formatta yanıt ver:
        {
          "projects": [
            {
              "title": "To-Do List App",
              "difficulty": "beginner",
              "description": "Basit görev yönetim uygulaması",
              "technologies": ["HTML", "CSS", "JavaScript"],
              "duration": "1-2 hafta",
              "learningGoals": ["DOM manipülasyonu", "Event handling"],
              "features": ["Görev ekleme", "Silme", "Tamamlama"],
              "nextSteps": ["Local storage ekle", "Kategoriler ekle"]
            }
          ]
        }
        `;
        break;

      case 'code_review':
        prompt = `
        Bu koda yapıcı geri bildirim ver ve iyileştirme önerileri sun:
        
        Kod: ${topic}
        
        Lütfen şu formatta yanıt ver:
        {
          "review": {
            "score": 8,
            "strengths": ["Temiz kod", "İyi isimlendirme"],
            "improvements": ["Error handling ekle", "Performans optimizasyonu"],
            "suggestions": [
              {
                "issue": "Error handling eksik",
                "solution": "try-catch blokları ekle",
                "example": "try { ... } catch(error) { ... }"
              }
            ],
            "nextLevel": "Exception handling ve logging ekle"
          }
        }
        `;
        break;

      case 'interview_prep':
        prompt = `
        ${userProfile.selectedField} alanında ${difficulty} seviyesinde mülakat soruları hazırla:
        
        Lütfen şu formatta yanıt ver:
        {
          "interview": {
            "category": "${userProfile.selectedField}",
            "level": "${difficulty}",
            "questions": [
              {
                "question": "React hook'ları nedir ve neden kullanılır?",
                "type": "technical",
                "expectedAnswer": "Hook'lar functional componentlerde state ve lifecycle kullanmayı sağlar",
                "followUp": "useState ve useEffect arasındaki fark nedir?",
                "tips": "Örneklerle açıkla"
              }
            ],
            "behavioralQuestions": [
              "Zor bir projeyle nasıl başa çıktınız?"
            ],
            "technicalChallenges": [
              "Bir API'den veri çeken React component yazın"
            ]
          }
        }
        `;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz içerik tipi' },
          { status: 400 }
        );
    }

    let result, response, text;
    try {
      result = await model.generateContent(prompt);
      response = await result.response;
      text = response.text();
    } catch (error: any) {
      console.error('Gemini API error:', error);
      
      // Quota limit veya model not found hatasını yakala
      if (error.message?.includes('429') || error.message?.includes('quota') || error.message?.includes('404') || error.message?.includes('not found')) {
        // Fallback content oluştur
        const fallbackContent = generateFallbackContent(contentType, topic || userProfile.selectedField);
        console.log('⚠️ Using fallback content:', { contentType, topic: topic || userProfile.selectedField });
        return NextResponse.json({
          success: true,
          generatedContent: fallbackContent,
          isFallback: true
        });
      }
      
      throw error;
    }

    let generatedContent;
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      generatedContent = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'AI yanıtı işlenemiyor' },
        { status: 500 }
      );
    }

    console.log('✅ Content generated successfully:', { contentType, hasContent: !!generatedContent });
    return NextResponse.json({
      success: true,
      generatedContent: generatedContent,
      contentType
    });

  } catch (error) {
    console.error('Content generation error:', error);
    return NextResponse.json(
      { success: false, error: 'İçerik oluşturma hatası' },
      { status: 500 }
    );
  }
}