import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { category, selectedField } = await request.json();

    console.log('🤖 Tamamen Gemini BTK sistemi:', { category, selectedField });

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

    // Kategori bazında BTK kurs önerileri
    const categoryMappings: { [key: string]: string } = {
      'frontend': 'HTML, CSS, JavaScript, React, Bootstrap, Web Tasarımı',
      'backend': 'Python, Java, PHP, Node.js, Veritabanı, API',
      'mobile': 'Android, Flutter, React Native, iOS',
      'ai': 'Yapay Zeka, Machine Learning, Deep Learning, Python',
      'data': 'Veri Bilimi, Veri Analizi, SQL, Python, R',
      'cybersecurity': 'Siber Güvenlik, Ağ Güvenliği, Etik Hacker',
      'database': 'SQL, MySQL, PostgreSQL, MongoDB',
      'gamedev': 'Unity, C#, Oyun Geliştirme',
      'design': 'Photoshop, Illustrator, UI/UX Tasarım',
      'devops': 'Linux, Docker, AWS, DevOps'
    };

    const techStack = categoryMappings[category] || 'Yazılım Geliştirme';

    const prompt = `
Sen BTK Akademi uzmanısın. ${selectedField || 'Yazılım Geliştirme'} alanında ${category} kategorisinde eğitim almak isteyen bir öğrenci için BTK Akademi'nin sahip olabileceği 5-8 adet kurs öner.

Teknolojiler: ${techStack}

Her kurs için şu bilgileri JSON formatında ver:

{
  "courses": [
    {
      "title": "Kurs başlığı (BTK formatında)",
      "description": "Kısa ve çekici açıklama (2-3 cümle)",
      "level": "beginner/intermediate/advanced",
      "duration": "X saat",
      "instructor": "BTK Akademi veya gerçekçi eğitmen adı",
      "skills": ["öğrenilecek beceri 1", "beceri 2", "beceri 3"],
      "tags": ["tag1", "tag2", "tag3"],
      "url": "https://www.btkakademi.gov.tr/portal/course/kurs-url-slugi"
    }
  ]
}

ÖNEMLI:
- Kurs başlıkları BTK Akademi tarzında olsun (örn: "Python Programlama Dili", "React ile Web Arayüz Geliştirme")
- URL'ler gerçekçi BTK formatında olsun (küçük harf, tire ile ayrılmış)
- Açıklamalar Türkçe ve pratik odaklı olsun
- Sadece JSON döndür, başka metin ekleme

Kategori: ${category}
Alan: ${selectedField}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('📝 Gemini BTK response:', text);

    // JSON'ı parse et
    let coursesData;
    try {
      // JSON'ı temizle
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      coursesData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Gemini response JSON olarak parse edilemedi');
    }

    // Kursları validate et
    if (!coursesData.courses || !Array.isArray(coursesData.courses)) {
      throw new Error('Geçersiz kurs formatı');
    }

    // BTK formatına dönüştür
    const btkCourses = coursesData.courses.map((course: any, index: number) => ({
      id: `btk-gemini-${category}-${index + 1}`,
      title: course.title,
      description: course.description,
      platform: 'btk',
      category: category,
      level: course.level || 'beginner',
      duration: course.duration || '40 saat',
      language: 'Turkish',
      price: 0,
      rating: 4.6 + (Math.random() * 0.5), // 4.6-5.1 arası
      instructor: course.instructor || 'BTK Akademi',
      url: course.url || 'https://www.btkakademi.gov.tr',
      tags: course.tags || [category, course.level, 'BTK'],
      skills: course.skills || ['Temel Bilgiler', 'Pratik Uygulamalar'],
      certificate: true,
      completionRate: Math.floor(70 + Math.random() * 25), // 70-95% arası
      popularity: 'high'
    }));

    console.log(`✅ ${btkCourses.length} Gemini BTK kursu oluşturuldu`);

    return NextResponse.json({
      success: true,
      category,
      selectedField,
      courses: btkCourses,
      total: btkCourses.length,
      method: 'gemini-only', // Sadece Gemini
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ BTK kurs fetch hatası:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Bilinmeyen hata',
        fallback: 'Statik kurs listesi kullanılacak'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'frontend';

  // GET isteği için de aynı işlemi yap
  return POST(new Request(request.url, {
    method: 'POST',
    body: JSON.stringify({ category })
  }));
}