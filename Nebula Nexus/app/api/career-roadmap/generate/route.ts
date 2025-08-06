import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { PrismaClient } from '@prisma/client';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, oceanScores, onetScores, selectedField } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    console.log('=== Generating AI Career Roadmap ===');
    console.log('User ID:', userId);
    console.log('Selected Field:', selectedField);
    console.log('OCEAN Scores:', oceanScores);

    // Get user's career recommendations if available
    const careerRecommendations = await prisma.careerRecommendation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    // Generate detailed career roadmaps with Gemini
    const careerPaths = await generateDetailedCareerRoadmaps(
      oceanScores, 
      onetScores, 
      selectedField, 
      careerRecommendations
    );

    console.log('✅ Career roadmaps generated:', careerPaths.length);

    // Save generated roadmaps to database
    const savedRoadmaps = await saveRoadmapsToDatabase(userId, careerPaths);

    return NextResponse.json({
      success: true,
      careerPaths: careerPaths,
      savedRoadmaps: savedRoadmaps
    });

  } catch (error: any) {
    console.error('❌ Error generating career roadmap:', error);
    return NextResponse.json(
      { error: 'Failed to generate career roadmap', details: error?.message },
      { status: 500 }
    );
  }
}

async function saveRoadmapsToDatabase(userId: string, careerPaths: any[]) {
  const savedRoadmaps = [];

  for (const path of careerPaths) {
    try {
      // Create the main roadmap
      const roadmap = await prisma.careerRoadmap.create({
        data: {
          userId: userId,
          title: path.field,
          description: path.reasoning,
          category: 'AI Generated',
          difficulty: 'beginner',
          duration: path.detailedRoadmap.phases.reduce((total: number, phase: any) => {
            const months = parseInt(phase.duration.match(/(\d+)/)?.[1] || '3');
            return total + months;
          }, 0) + ' ay',
          salary: path.detailedRoadmap.salary,
          demand: path.detailedRoadmap.demand,
          skills: JSON.stringify(path.detailedRoadmap.phases.flatMap((phase: any) => phase.skills)),
          progress: 0,
          isCompleted: false
        }
      });

      // Create milestones for each phase
      let milestoneOrder = 0;
      for (const phase of path.detailedRoadmap.phases) {
        for (const milestone of phase.milestones) {
          await prisma.milestone.create({
            data: {
              roadmapId: roadmap.id,
              title: milestone.title,
              description: milestone.description,
              priority: milestone.priority,
              order: milestoneOrder++,
              isCompleted: false
            }
          });
        }
      }

      // Create courses for each phase
      let courseOrder = 0;
      for (const phase of path.detailedRoadmap.phases) {
        for (const course of phase.courses) {
          await prisma.course.create({
            data: {
              roadmapId: roadmap.id,
              title: course.title,
              platform: course.platform,
              duration: course.duration,
              price: course.price,
              rating: 4.5,
              url: course.url,
              order: courseOrder++,
              isCompleted: false
            }
          });
        }
      }

      savedRoadmaps.push(roadmap);
      console.log(`✅ Saved roadmap: ${path.field}`);

    } catch (error) {
      console.error(`❌ Error saving roadmap ${path.field}:`, error);
    }
  }

  return savedRoadmaps;
}

async function generateDetailedCareerRoadmaps(
  oceanScores: any, 
  onetScores: any, 
  selectedField: string, 
  careerRecommendations: any[]
) {
  try {
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

    const prompt = `
Sen bir yazılım kariyer danışmanısın. Öğrencinin kişilik analizi sonuçlarına göre ÇOK DETAYLI kariyer yol haritaları oluştur.

OCEAN Puanları (1-5 ölçeği):
- Açıklık: ${oceanScores?.openness || 'Bilinmiyor'}
- Sorumluluk: ${oceanScores?.conscientiousness || 'Bilinmiyor'}
- Dışadönüklük: ${oceanScores?.extraversion || 'Bilinmiyor'}
- Uyumluluk: ${oceanScores?.agreeableness || 'Bilinmiyor'}
- Nörotizm: ${oceanScores?.neuroticism || 'Bilinmiyor'}

O*NET İlgi Alanları (1-5 ölçeği):
- Teknik: ${onetScores?.technical || 'Bilinmiyor'}
- Analitik: ${onetScores?.analytical || 'Bilinmiyor'}
- Yaratıcı: ${onetScores?.creative || 'Bilinmiyor'}
- Sosyal: ${onetScores?.social || 'Bilinmiyor'}

Seçilen Alan: ${selectedField}

Mevcut Kariyer Önerileri: ${JSON.stringify(careerRecommendations || [])}

Her kariyer yolu için ÇOK DETAYLI bir yol haritası oluştur. Özellikle mobil geliştirme için alt dalları ayrı ayrı belirt:

**MOBİL GELİŞTİRME ALT DALLARI:**
1. **iOS Developer (Swift/SwiftUI)** - Apple ekosistemi odaklı
2. **Android Developer (Kotlin/Jetpack Compose)** - Google ekosistemi odaklı  
3. **Cross-Platform Developer (React Native)** - JavaScript/TypeScript ile
4. **Cross-Platform Developer (Flutter)** - Dart ile
5. **Mobile Game Developer (Unity/C#)** - Oyun geliştirme odaklı

**FRONTEND ALT DALLARI:**
1. **React Developer** - Modern React (Hooks, Context, Redux)
2. **Vue.js Developer** - Vue 3 Composition API
3. **Angular Developer** - TypeScript odaklı
4. **Next.js Developer** - Full-stack React framework
5. **UI/UX Developer** - Design + Development

**BACKEND ALT DALLARI:**
1. **Node.js Developer** - JavaScript/TypeScript backend
2. **Python Developer** - Django/Flask/FastAPI
3. **Java Developer** - Spring Boot/Microservices
4. **C# Developer** - .NET Core/ASP.NET
5. **Go Developer** - Microservices/Cloud native

**DEVOPS ALT DALLARI:**
1. **Cloud Engineer** - AWS/Azure/GCP
2. **Kubernetes Engineer** - Container orchestration
3. **CI/CD Engineer** - Pipeline automation
4. **Infrastructure Engineer** - IaC (Terraform/Ansible)

**DATA ALT DALLARI:**
1. **Data Engineer** - ETL/Big Data
2. **Machine Learning Engineer** - ML/AI models
3. **Data Scientist** - Analytics/Statistics
4. **Business Intelligence** - Data visualization

**SECURITY ALT DALLARI:**
1. **Application Security** - Code security
2. **Network Security** - Infrastructure security
3. **Cloud Security** - Cloud platform security
4. **Penetration Testing** - Ethical hacking

Her yol haritası için şu DETAYLARI ver:
- 6-8 aşamalı öğrenme süreci (her aşama 2-4 ay)
- Her aşama için 3-5 spesifik kurs (Udemy, Coursera, BTK Akademi, YouTube)
- 2-3 proje önerisi (her aşama için)
- 5-8 kilometre taşı (her aşama için)
- Detaylı beceri listesi
- Tahmini maaş aralığı (Türkiye pazarı)
- Kariyer ilerleme yolu (Junior → Mid → Senior → Lead → Architect)
- Talep seviyesi ve iş piyasası analizi
- Önerilen sertifikalar
- Networking ve topluluk önerileri

JSON formatında döndür (markdown kullanma):
{
  "careerPaths": [
    {
      "field": "iOS Developer (Swift/SwiftUI)",
      "confidence": 0.85,
      "reasoning": "Yüksek açıklık skorunuz yaratıcı UI tasarımı için uygun, düşük nörotizm skorunuz detay odaklı çalışma için ideal...",
      "learningPath": "Swift Temelleri → SwiftUI → iOS App Development → Advanced iOS → App Store Optimization",
      "nextSteps": "1. Xcode'u indir ve Swift playground'ları çalış 2. Apple Developer hesabı oluştur 3. İlk iOS uygulamanı geliştir",
      "detailedRoadmap": {
        "phases": [
          {
            "phase": "Swift Programlama Temelleri",
            "duration": "3 ay",
            "skills": ["Swift Syntax", "Optionals", "Protocols", "Closures", "Error Handling", "Memory Management"],
            "courses": [
              {
                "title": "iOS 17 & Swift 5: Complete iOS App Development",
                "platform": "Udemy",
                "duration": "60 saat",
                "price": "₺299",
                "url": "https://udemy.com/...",
                "description": "Sıfırdan iOS uygulama geliştirme"
              },
              {
                "title": "Swift Programming for Beginners",
                "platform": "Coursera",
                "duration": "40 saat",
                "price": "Ücretsiz",
                "url": "https://coursera.org/...",
                "description": "Swift temelleri ve best practices"
              },
              {
                "title": "iOS Development with Swift",
                "platform": "BTK Akademi",
                "duration": "50 saat",
                "price": "Ücretsiz",
                "url": "https://btkakademi.gov.tr/...",
                "description": "Türkçe iOS geliştirme kursu"
              }
            ],
            "projects": [
              {
                "title": "Todo List Uygulaması",
                "description": "Core Data kullanarak yerel veri saklama",
                "difficulty": "Başlangıç",
                "estimatedTime": "3 hafta"
              },
              {
                "title": "Hava Durumu Uygulaması",
                "description": "API entegrasyonu ve JSON parsing",
                "difficulty": "Orta",
                "estimatedTime": "4 hafta"
              }
            ],
            "milestones": [
              {
                "title": "Swift Syntax Öğrenimi",
                "description": "Temel Swift syntax ve veri tiplerini öğren",
                "priority": "high",
                "estimatedTime": "2 hafta"
              },
              {
                "title": "Optionals ve Error Handling",
                "description": "Swift'in güvenli tip sistemi",
                "priority": "high",
                "estimatedTime": "2 hafta"
              },
              {
                "title": "Protocol-Oriented Programming",
                "description": "Swift'in protokol odaklı yaklaşımı",
                "priority": "medium",
                "estimatedTime": "3 hafta"
              },
              {
                "title": "Memory Management",
                "description": "ARC ve memory management",
                "priority": "medium",
                "estimatedTime": "2 hafta"
              }
            ]
          },
          {
            "phase": "SwiftUI Framework",
            "duration": "4 ay",
            "skills": ["SwiftUI", "State Management", "Navigation", "Animations", "Custom Views", "Data Binding"],
            "courses": [
              {
                "title": "SwiftUI Masterclass 2024",
                "platform": "Udemy",
                "duration": "45 saat",
                "price": "₺199",
                "url": "https://udemy.com/...",
                "description": "Modern SwiftUI geliştirme"
              }
            ],
            "projects": [
              {
                "title": "E-Ticaret Uygulaması",
                "description": "SwiftUI ile kompleks UI tasarımı",
                "difficulty": "Orta",
                "estimatedTime": "6 hafta"
              }
            ],
            "milestones": [
              {
                "title": "SwiftUI Temelleri",
                "description": "View, State, Binding kavramları",
                "priority": "high",
                "estimatedTime": "3 hafta"
              }
            ]
          }
        ],
        "salary": "₺25,000 - ₺60,000",
        "demand": "high",
        "careerProgression": ["Junior iOS Developer", "Mid iOS Developer", "Senior iOS Developer", "iOS Team Lead", "iOS Architect"],
        "certifications": ["Apple Developer Certification", "Swift Certification"],
        "networking": ["iOS Developer Meetups", "Swift Türkiye Topluluğu", "Apple Developer Forums"]
      }
    }
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('Raw Gemini response:', text);
    
    // Clean markdown backticks if present
    let cleanedText = text;
    if (text.includes('```json')) {
      cleanedText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (text.includes('```')) {
      cleanedText = text.replace(/```\n?/g, '');
    }
    
    try {
      const parsed = JSON.parse(cleanedText);
      return parsed.careerPaths || [];
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.log('Cleaned text:', cleanedText);
      
      // Fallback to basic career paths
      return generateFallbackCareerRoadmaps(selectedField, oceanScores);
    }
    
  } catch (error) {
    console.error('Error generating career roadmaps:', error);
    return generateFallbackCareerRoadmaps(selectedField, oceanScores);
  }
}

function generateFallbackCareerRoadmaps(selectedField: string, oceanScores: any) {
  const roadmaps = [
    {
      field: "Frontend Developer",
      confidence: 0.85,
      reasoning: "Yüksek açıklık skorunuz yaratıcı UI tasarımı için uygun.",
      learningPath: "HTML/CSS → JavaScript → React → TypeScript → Advanced React",
      nextSteps: "1. Udemy'de React kursu al 2. Portfolio projesi yap 3. GitHub'da aktif ol",
      detailedRoadmap: {
        phases: [
          {
            phase: "Temel Web Teknolojileri",
            duration: "3 ay",
            skills: ["HTML5", "CSS3", "JavaScript ES6+", "Responsive Design"],
            courses: [
              {
                title: "Modern JavaScript Kursu",
                platform: "Udemy",
                duration: "40 saat",
                price: "₺199",
                url: "https://udemy.com/javascript",
                description: "ES6+ özellikleri ve modern JavaScript pratikleri"
              }
            ],
            projects: [
              {
                title: "Responsive Portfolio Sitesi",
                description: "Kendi portföy sitenizi oluşturun",
                difficulty: "Başlangıç",
                estimatedTime: "2 hafta"
              }
            ],
            milestones: [
              {
                title: "HTML/CSS Temelleri",
                description: "Semantic HTML ve CSS Grid/Flexbox öğrenin",
                priority: "high",
                estimatedTime: "1 ay"
              }
            ]
          }
        ],
        salary: "₺15,000 - ₺35,000",
        demand: "high",
        careerProgression: ["Junior Frontend", "Mid Frontend", "Senior Frontend", "Frontend Lead"]
      }
    },
    {
      field: "Backend Developer",
      confidence: 0.80,
      reasoning: "Yüksek sorumluluk skorunuz sistematik kod yazma için uygun.",
      learningPath: "Python/Java → SQL → Node.js → Docker → Microservices",
      nextSteps: "1. Python veya Java öğren 2. Veritabanı tasarımı yap 3. API geliştir",
      detailedRoadmap: {
        phases: [
          {
            phase: "Programlama Temelleri",
            duration: "4 ay",
            skills: ["Python", "SQL", "Git", "API Design"],
            courses: [
              {
                title: "Python Backend Development",
                platform: "Coursera",
                duration: "60 saat",
                price: "₺299",
                url: "https://coursera.org/python-backend",
                description: "Python ile backend geliştirme"
              }
            ],
            projects: [
              {
                title: "REST API Projesi",
                description: "CRUD işlemleri olan bir API geliştirin",
                difficulty: "Orta",
                estimatedTime: "3 hafta"
              }
            ],
            milestones: [
              {
                title: "Python Temelleri",
                description: "Python programlama dilini öğrenin",
                priority: "high",
                estimatedTime: "2 ay"
              }
            ]
          }
        ],
        salary: "₺18,000 - ₺40,000",
        demand: "high",
        careerProgression: ["Junior Backend", "Mid Backend", "Senior Backend", "Backend Lead"]
      }
    }
  ];

  return roadmaps;
} 