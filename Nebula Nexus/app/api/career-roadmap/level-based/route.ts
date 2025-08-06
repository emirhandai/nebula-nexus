import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import { chatWithAI } from '@/lib/gemini';

const LEVEL_PROMPTS = {
  beginner: `Sen bir kariyer danışmanısın. Kullanıcı için başlangıç seviyesinde bir kariyer yolu oluştur. 
  
  Kullanıcının seçtiği alan: {field}
  OCEAN kişilik skorları: {oceanScores}
  
  Başlangıç seviyesi için şunları içeren detaylı bir kariyer yolu oluştur:
  - 3-4 öğrenme modülü (her biri 2-4 hafta sürecek)
  - Her modül için: konular, kaynaklar (ücretsiz/ucuz), projeler, kilometre taşları
  - Tahmini süre: 3-6 ay
  - Tahmini maaş aralığı
  - Piyasa talebi
  - Gerekli beceriler
  
  JSON formatında döndür:
  {
    "title": "Başlangıç Seviyesi {field} Kariyer Yolu",
    "description": "Detaylı açıklama",
    "duration": "3-6 ay",
    "estimatedSalary": "₺8,000 - ₺15,000",
    "demand": "Yüksek",
    "skills": ["skill1", "skill2", ...],
    "modules": [
      {
        "title": "Modül Başlığı",
        "duration": "2-4 hafta",
        "description": "Modül açıklaması",
        "topics": ["konu1", "konu2", ...],
        "resources": [
          {
            "title": "Kaynak adı",
            "type": "video/kurs/kitap",
            "platform": "Udemy/Coursera/YouTube",
            "duration": "10 saat",
            "price": "Ücretsiz/₺50",
            "url": "https://...",
            "description": "Açıklama"
          }
        ],
        "projects": [
          {
            "title": "Proje adı",
            "description": "Proje açıklaması",
            "difficulty": "kolay",
            "estimatedTime": "1-2 hafta",
            "technologies": ["tech1", "tech2"]
          }
        ],
        "milestones": [
          {
            "title": "Kilometre taşı",
            "description": "Açıklama",
            "criteria": "Tamamlama kriterleri",
            "estimatedTime": "1 hafta"
          }
        ]
      }
    ],
    "certifications": [
      {
        "name": "Sertifika adı",
        "issuer": "Kurum",
        "cost": "₺500",
        "duration": "2 ay",
        "url": "https://..."
      }
    ]
  }`,

  intermediate: `Sen bir kariyer danışmanısın. Kullanıcı için orta seviyede bir kariyer yolu oluştur. 
  
  Kullanıcının seçtiği alan: {field}
  OCEAN kişilik skorları: {oceanScores}
  
  Orta seviye için şunları içeren detaylı bir kariyer yolu oluştur:
  - 4-5 öğrenme modülü (her biri 3-6 hafta sürecek)
  - Her modül için: konular, kaynaklar, projeler, kilometre taşları
  - Tahmini süre: 6-12 ay
  - Tahmini maaş aralığı
  - Piyasa talebi
  - Gerekli beceriler
  
  JSON formatında döndür (aynı yapıda ama orta seviye içerikle)`,

  advanced: `Sen bir kariyer danışmanısın. Kullanıcı için ileri seviyede bir kariyer yolu oluştur. 
  
  Kullanıcının seçtiği alan: {field}
  OCEAN kişilik skorları: {oceanScores}
  
  İleri seviye için şunları içeren detaylı bir kariyer yolu oluştur:
  - 5-6 öğrenme modülü (her biri 4-8 hafta sürecek)
  - Her modül için: konular, kaynaklar, projeler, kilometre taşları
  - Tahmini süre: 12-18 ay
  - Tahmini maaş aralığı
  - Piyasa talebi
  - Gerekli beceriler
  
  JSON formatında döndür (aynı yapıda ama ileri seviye içerikle)`
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, level, field, oceanScores } = await request.json();

    if (!userId || !level || !field) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Seviye için uygun prompt'u seç
    const levelPrompt = LEVEL_PROMPTS[level as keyof typeof LEVEL_PROMPTS];
    if (!levelPrompt) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    // Prompt'u doldur
    const filledPrompt = levelPrompt
      .replace('{field}', field)
      .replace('{oceanScores}', JSON.stringify(oceanScores || {}));

    // Gemini ile kariyer yolu oluştur
    const aiResponse = await chatWithAI(filledPrompt, {
      selectedField: field,
      category: 'career'
    });
    
    let careerPathData;
    try {
      // AI yanıtından JSON'u çıkar
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        careerPathData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback JSON response when AI fails
        console.log('⚠️ Using fallback JSON response');
        careerPathData = {
          title: `${field} - ${level.charAt(0).toUpperCase() + level.slice(1)} Seviye Kariyer Yolu`,
          description: `${field} alanında ${level} seviyede kariyer gelişimi için hazırlanmış yol haritası.`,
          duration: level === 'beginner' ? '6-12 ay' : level === 'intermediate' ? '12-18 ay' : '18-24 ay',
          estimatedSalary: level === 'beginner' ? '₺15,000 - ₺25,000' : level === 'intermediate' ? '₺25,000 - ₺40,000' : '₺40,000 - ₺60,000',
          demand: 'Yüksek',
          skills: ['Temel programlama', 'Problem çözme', 'Takım çalışması'],
          modules: [
            {
              title: 'Temel Beceriler',
              duration: '4-6 hafta',
              topics: ['Programlama temelleri', 'Veri yapıları', 'Algoritmalar'],
              resources: ['BTK Akademi', 'Udemy kursları'],
              projects: ['Basit hesap makinesi', 'Todo uygulaması']
            }
          ],
          certifications: ['Temel sertifika', 'Seviye sertifikası']
        };
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback JSON response on parse error
      careerPathData = {
        title: `${field} - ${level.charAt(0).toUpperCase() + level.slice(1)} Seviye Kariyer Yolu`,
        description: `${field} alanında ${level} seviyede kariyer gelişimi için hazırlanmış yol haritası.`,
        duration: level === 'beginner' ? '6-12 ay' : level === 'intermediate' ? '12-18 ay' : '18-24 ay',
        estimatedSalary: level === 'beginner' ? '₺15,000 - ₺25,000' : level === 'intermediate' ? '₺25,000 - ₺40,000' : '₺40,000 - ₺60,000',
        demand: 'Yüksek',
        skills: ['Temel programlama', 'Problem çözme', 'Takım çalışması'],
        modules: [
          {
            title: 'Temel Beceriler',
            duration: '4-6 hafta',
            topics: ['Programlama temelleri', 'Veri yapıları', 'Algoritmalar'],
            resources: ['BTK Akademi', 'Udemy kursları'],
            projects: ['Basit hesap makinesi', 'Todo uygulaması']
          }
        ],
        certifications: ['Temel sertifika', 'Seviye sertifikası']
      };
    }

    // Kariyer yolunu veritabanına kaydet
    const careerPath = await prisma.careerRoadmap.create({
      data: {
        userId,
        fieldName: field,
        currentLevel: level === 'beginner' ? 1 : level === 'intermediate' ? 2 : 3,
        totalLevels: 5,
        isActive: true
      }
    });

    return NextResponse.json({
      success: true,
      careerPath: {
        ...careerPath,
        level,
        field,
        title: careerPathData.title,
        description: careerPathData.description,
        duration: careerPathData.duration,
        estimatedSalary: careerPathData.estimatedSalary,
        demand: careerPathData.demand,
        skills: careerPathData.skills,
        modules: careerPathData.modules,
        certifications: careerPathData.certifications,
        nextLevel: level === 'beginner' ? 'intermediate' : level === 'intermediate' ? 'advanced' : 'expert',
        completionCriteria: `Bu seviyeyi tamamlamak için tüm modülleri bitirmeniz gerekiyor.`
      }
    });

  } catch (error) {
    console.error('Error generating level-based career path:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 