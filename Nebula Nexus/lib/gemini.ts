import { GoogleGenerativeAI } from '@google/generative-ai';

// Check if API key exists, if not use fallback mode
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const CAREER_ADVISOR_PROMPT = `
Sen Nebula Nexus'un kariyer danışmanı AI asistanısın. Sadece yazılım geliştirme alanlarında uzmanlaşmış bir danışmansın.

ÖNEMLİ KURALLAR:
1. SADECE seçilen alan hakkında konuş
2. Genel sohbet yapma, her zaman kariyer odaklı ol
3. Türkçe yanıt ver
4. Pratik ve uygulanabilir öneriler sun
5. Teknik detaylara gir ama anlaşılır ol
6. Kariyer yolu ve gelişim planı oluştur
7. Eğitim önerileri ver (BTK Akademi, Udemy, Coursera)
8. Proje önerileri sun
9. İş fırsatları hakkında bilgi ver

YANIT FORMATI:
- Kısa ve öz ol
- Madde halinde öneriler ver
- Pratik adımlar sun
- Motivasyonel ol ama gerçekçi kal
- Her yanıtı seçilen alanla ilişkilendir

KARİYER ALANLARI:
- Web Geliştirme: Frontend, Backend, Full Stack
- Yapay Zeka & Makine Öğrenmesi: AI, ML, Deep Learning
- Mobil Geliştirme: iOS, Android, Cross-platform
- Siber Güvenlik: Network Security, Penetration Testing
- Veri Bilimi: Data Analysis, Data Engineering

Her yanıtında kullanıcının seçtiği alanı dikkate al ve o alana özel öneriler ver.
`;

interface ChatContext {
  selectedField?: string;
  userLevel?: 'beginner' | 'intermediate' | 'advanced';
  previousMessages?: string[];
  category?: 'casual' | 'career' | 'education' | 'technical';
  oceanScores?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  onetScores?: {
    technical: number;
    analytical: number;
    creative: number;
    social: number;
  };
}

// Kişilik adaptasyonu fonksiyonu
function generatePersonalityAdaptedPrompt(oceanScores: any, onetScores: any) {
  const adaptations: string[] = [];
  
  // Açıklık (Openness) - Yaratıcılık ve yenilikçilik
  if (oceanScores.openness > 3.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - YÜKSEK AÇIKLIK:
- Yaratıcı ve yenilikçi yaklaşımlar öner
- Deneysel projeler ve yeni teknolojiler vurgula
- Sanatsal ve estetik yönleri olan projeler öner
- Farklı perspektiflerden bakış açıları sun
- Yaratıcı problem çözme teknikleri anlat`);
  } else if (oceanScores.openness < 2.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - DÜŞÜK AÇIKLIK:
- Sistematik ve yapılandırılmış yaklaşımlar öner
- Kanıtlanmış ve güvenilir yöntemler vurgula
- Adım adım rehberlik et
- Geleneksel ve test edilmiş teknolojiler öner
- Rutin ve düzenli çalışma planları sun`);
  }
  
  // Sorumluluk (Conscientiousness) - Organizasyon ve disiplin
  if (oceanScores.conscientiousness > 3.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - YÜKSEK SORUMLULUK:
- Detaylı planlama ve organizasyon öner
- Kalite odaklı yaklaşımlar vurgula
- Mükemmeliyetçilik ve sistematik çalışma
- Uzun vadeli hedefler ve stratejiler
- Metodolojik ve düzenli yaklaşımlar`);
  } else if (oceanScores.conscientiousness < 2.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - DÜŞÜK SORUMLULUK:
- Esnek ve adaptif yaklaşımlar öner
- Hızlı prototipleme ve iteratif geliştirme
- Yaratıcı ve spontane projeler
- Kısa vadeli hedefler ve hızlı sonuçlar
- Esnek çalışma düzenleri`);
  }
  
  // Dışadönüklük (Extraversion) - Sosyallik ve enerji
  if (oceanScores.extraversion > 3.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - YÜKSEK DIŞADÖNÜKLÜK:
- Ekip çalışması ve işbirliği vurgula
- Networking ve topluluk katılımı öner
- Liderlik ve mentorluk fırsatları
- Sosyal projeler ve açık kaynak katkıları
- Konferans ve etkinlik katılımı`);
  } else if (oceanScores.extraversion < 2.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - DÜŞÜK DIŞADÖNÜKLÜK:
- Bağımsız çalışma ve solo projeler öner
- Derinlemesine odaklanma ve uzmanlaşma
- Remote çalışma ve esnek ortamlar
- Bireysel gelişim ve self-paced öğrenme
- Minimal sosyal etkileşim gerektiren roller`);
  }
  
  // Uyumluluk (Agreeableness) - İşbirliği ve empati
  if (oceanScores.agreeableness > 3.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - YÜKSEK UYUMLULUK:
- İşbirliği ve takım çalışması vurgula
- Kullanıcı odaklı ve empatik yaklaşımlar
- Mentorluk ve yardım etme fırsatları
- Sosyal sorumluluk projeleri
- Topluluk katkıları ve açık kaynak`);
  } else if (oceanScores.agreeableness < 2.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - DÜŞÜK UYUMLULUK:
- Bağımsız karar verme ve liderlik
- Teknik uzmanlık ve derinlemesine analiz
- Rekabetçi ortamlar ve performans odaklı
- Eleştirel düşünme ve problem çözme
- Bireysel başarı ve uzmanlaşma`);
  }
  
  // Nörotizm (Neuroticism) - Stres yönetimi
  if (oceanScores.neuroticism < 2.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - DÜŞÜK NÖROTİZM:
- Yüksek stresli ortamlarda çalışma
- Kritik sistemler ve güvenlik odaklı
- Hızlı değişen teknolojiler ve adaptasyon
- Liderlik ve yönetim pozisyonları
- Kriz yönetimi ve problem çözme`);
  } else if (oceanScores.neuroticism > 3.5) {
    adaptations.push(`
KİŞİLİK ADAPTASYONU - YÜKSEK NÖROTİZM:
- Düşük stresli ve stabil ortamlar
- Yapılandırılmış ve öngörülebilir işler
- Detaylı planlama ve hazırlık
- Destekleyici ekip ortamları
- Aşamalı gelişim ve güvenli öğrenme`);
  }
  
  return adaptations.join('\n');
}

// Kullanıcı tercihlerini analiz eden fonksiyon
function analyzeUserPreferences(previousMessages: string[], oceanScores: any) {
  const preferences = {
    communicationStyle: 'neutral',
    detailLevel: 'medium',
    focusAreas: [] as string[],
    learningStyle: 'mixed'
  };
  
  // İletişim stilini analiz et
  const messageAnalysis = previousMessages.join(' ').toLowerCase();
  
  if (messageAnalysis.includes('detaylı') || messageAnalysis.includes('açıkla')) {
    preferences.detailLevel = 'high';
  } else if (messageAnalysis.includes('kısa') || messageAnalysis.includes('öz')) {
    preferences.detailLevel = 'low';
  }
  
  if (messageAnalysis.includes('pratik') || messageAnalysis.includes('uygulama')) {
    preferences.learningStyle = 'practical';
  } else if (messageAnalysis.includes('teorik') || messageAnalysis.includes('kavram')) {
    preferences.learningStyle = 'theoretical';
  }
  
  // OCEAN skorlarına göre varsayılan tercihler
  if (oceanScores.openness > 3.5) {
    preferences.focusAreas.push('innovation', 'creativity');
  }
  if (oceanScores.conscientiousness > 3.5) {
    preferences.focusAreas.push('planning', 'organization');
  }
  if (oceanScores.extraversion > 3.5) {
    preferences.focusAreas.push('collaboration', 'networking');
  }
  if (oceanScores.agreeableness > 3.5) {
    preferences.focusAreas.push('teamwork', 'mentoring');
  }
  if (oceanScores.neuroticism < 2.5) {
    preferences.focusAreas.push('leadership', 'stress_management');
  }
  
  return preferences;
}

// Zaman bazlı context oluşturan fonksiyon
function generateTimeBasedContext() {
  const now = new Date();
  const hour = now.getHours();
  const dayOfWeek = now.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  const timeContext = {
    period: '',
    energyLevel: '',
    recommendations: [] as string[],
    greetings: [] as string[]
  };
  
  // Günün saati analizi
  if (hour >= 6 && hour < 12) {
    timeContext.period = 'morning';
    timeContext.energyLevel = 'high';
    timeContext.recommendations = [
      'Günlük planlama ve hedef belirleme',
      'Yeni teknolojileri öğrenme',
      'Karmaşık problemleri çözme',
      'Yaratıcı projeler başlatma'
    ];
    timeContext.greetings = [
      'Günaydın! Yeni bir güne başlarken',
      'Sabah enerjisiyle',
      'Güne taze bir başlangıç yaparken'
    ];
  } else if (hour >= 12 && hour < 17) {
    timeContext.period = 'afternoon';
    timeContext.energyLevel = 'medium';
    timeContext.recommendations = [
      'Pratik çalışma ve proje geliştirme',
      'Ekip çalışması ve işbirliği',
      'Mevcut projeleri gözden geçirme',
      'Öğrenilen konuları uygulama'
    ];
    timeContext.greetings = [
      'Öğleden sonra verimli çalışma zamanı',
      'Günün ortasında',
      'Öğleden sonra enerjisiyle'
    ];
  } else if (hour >= 17 && hour < 21) {
    timeContext.period = 'evening';
    timeContext.energyLevel = 'medium-low';
    timeContext.recommendations = [
      'Günlük değerlendirme ve reflection',
      'Hafif öğrenme aktiviteleri',
      'Gelecek planlaması',
      'Kişisel projeler ve hobi çalışmaları'
    ];
    timeContext.greetings = [
      'Akşam vakti, günü değerlendirme zamanı',
      'Günün sonunda',
      'Akşam sakinliğiyle'
    ];
  } else {
    timeContext.period = 'night';
    timeContext.energyLevel = 'low';
    timeContext.recommendations = [
      'Hafif okuma ve araştırma',
      'Gelecek planlaması',
      'Rahat öğrenme aktiviteleri',
      'Yarın için hazırlık'
    ];
    timeContext.greetings = [
      'Gece vakti, sakin öğrenme zamanı',
      'Günün sonunda',
      'Gece sükûnetiyle'
    ];
  }
  
  // Haftanın günü analizi
  if (isWeekend) {
    timeContext.recommendations.push(
      'Hafta sonu projeleri ve kişisel gelişim',
      'Yaratıcı ve eğlenceli öğrenme aktiviteleri',
      'Haftalık değerlendirme ve planlama'
    );
  } else {
    timeContext.recommendations.push(
      'Profesyonel gelişim ve kariyer odaklı çalışma',
      'İş hayatına yönelik beceriler',
      'Hafta içi rutinlerine uygun aktiviteler'
    );
  }
  
  return timeContext;
}

// Zaman bazlı öneriler oluşturan fonksiyon
function generateTimeBasedSuggestions(timeContext: any, selectedField: string) {
  const suggestions: string[] = [];
  
  switch (timeContext.period) {
    case 'morning':
      suggestions.push(
        `🌅 **Sabah Enerjisiyle ${selectedField} Öğrenimi:**
        • Yeni bir teknoloji veya framework öğrenmeye başla
        • Günlük hedeflerini belirle ve planla
        • Karmaşık problemleri çözmeye odaklan
        • Yaratıcı proje fikirleri geliştir`,
        
        `📚 **Sabah Öğrenme Aktiviteleri:**
        • Online kurslara başla (Udemy, Coursera)
        • Teknik blog yazıları oku
        • Kod örneklerini incele ve uygula
        • Yeni bir programlama dili öğrenmeye başla`
      );
      break;
      
    case 'afternoon':
      suggestions.push(
        `☀️ **Öğleden Sonra Pratik Çalışma:**
        • Mevcut projelerini geliştir
        • Ekip çalışması gerektiren projeler üzerinde çalış
        • Code review yap ve iyileştirmeler öner
        • Yeni öğrendiğin konuları uygula`,
        
        `🛠️ **Öğleden Sonra Proje Önerileri:**
        • Portfolio projelerini güncelle
        • Açık kaynak projelere katkıda bulun
        • Yeni bir mini proje başlat
        • Mevcut kodlarını refactor et`
      );
      break;
      
    case 'evening':
      suggestions.push(
        `🌆 **Akşam Değerlendirme ve Planlama:**
        • Günlük öğrendiklerini değerlendir
        • Yarın için hedeflerini planla
        • Haftalık ilerlemeni gözden geçir
        • Kişisel projeler üzerinde çalış`,
        
        `📖 **Akşam Öğrenme Aktiviteleri:**
        • Teknik kitaplar oku
        • Podcast dinle (yazılım geliştirme)
        • Online topluluklarda tartışmalara katıl
        • Gelecek planlarını gözden geçir`
      );
      break;
      
    case 'night':
      suggestions.push(
        `🌙 **Gece Sakin Öğrenme:**
        • Hafif okuma ve araştırma yap
        • Yarın için hazırlık yap
        • Rahat öğrenme aktiviteleri seç
        • Gelecek planlarını düşün`,
        
        `🤔 **Gece Reflection:**
        • Bugün öğrendiklerini düşün
        • Haftalık hedeflerini gözden geçir
        • Gelecek kariyer planlarını değerlendir
        • Kişisel gelişim hedeflerini planla`
      );
      break;
  }
  
  return suggestions;
}

function analyzeUserTopic(userMessage: string): string {
  const message = userMessage.toLowerCase();
  
  // Greeting detection
  if (message.includes('selam') || message.includes('merhaba') || message.includes('hey') || 
      message.includes('hi') || message.includes('hello') || message.includes('nasılsın')) {
    return 'greeting';
  }
  
  // Career path questions
  if (message.includes('kariyer') || message.includes('yol') || message.includes('path') || 
      message.includes('nasıl başlarım') || message.includes('nereden başlamalı')) {
    return 'career_path';
  }
  
  // Technology questions
  if (message.includes('teknoloji') || message.includes('teknolojiler') || message.includes('araç') || 
      message.includes('tool') || message.includes('framework') || message.includes('library')) {
    return 'technology';
  }
  
  // Project questions
  if (message.includes('proje') || message.includes('portfolio') || message.includes('çalışma') || 
      message.includes('project') || message.includes('sample')) {
    return 'projects';
  }
  
  // Job questions
  if (message.includes('iş') || message.includes('job') || message.includes('kariyer') || 
      message.includes('maaş') || message.includes('salary') || message.includes('pozisyon')) {
    return 'jobs';
  }
  
  // Education questions
  if (message.includes('eğitim') || message.includes('kurs') || message.includes('öğrenme') || 
      message.includes('education') || message.includes('course') || message.includes('tutorial')) {
    return 'education';
  }
  
  // Skill questions
  if (message.includes('beceri') || message.includes('skill') || message.includes('yetenek') || 
      message.includes('öğrenmeli') || message.includes('bilmem gereken')) {
    return 'skills';
  }
  
  return 'general';
}

export async function chatWithAI(
  userMessage: string, 
  context?: ChatContext
): Promise<string> {
  const selectedField = context?.selectedField || 'Genel Yazılım Geliştirme';
  const category = context?.category || 'casual';
  
  // Debug: Check API key
  console.log('🔑 API Key check:', {
    hasApiKey: !!process.env.GEMINI_API_KEY,
    apiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
    genAIExists: !!genAI
  });
  
  try {
    // Check if genAI is available
    if (!genAI) {
      console.log('⚠️ Gemini API not available, using fallback response');
      return getFallbackResponse('general', selectedField, {
        openness: 0,
        conscientiousness: 0,
        extraversion: 0,
        agreeableness: 0,
        neuroticism: 0
      });
    }
    
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log('🤖 Model initialized:', !!model);
    
    const userTopic = analyzeUserTopic(userMessage);
    const oceanScores = context?.oceanScores || {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };
    const onetScores = context?.onetScores || {
      technical: 0,
      analytical: 0,
      creative: 0,
      social: 0
    };
    
    // Category-specific prompts
    const categoryPrompts = {
      casual: `Sen Nebula Nexus'un arkadaş canlısı AI asistanısın. Gündelik sohbet yapabilir, genel konularda konuşabilirsin. 
      
      KURALLAR:
      - Doğal ve samimi ol
      - Türkçe yanıt ver
      - Günlük konularda sohbet et
      - Espri yapabilirsin ama saygılı ol
      - Kullanıcıyla arkadaş gibi konuş`,
      
      career: `Sen Nebula Nexus'un kariyer danışmanı AI asistanısın. Sadece yazılım geliştirme alanlarında uzmanlaşmış bir danışmansın.

      ÖNEMLİ KURALLAR:
      1. SADECE seçilen alan hakkında konuş
      2. Genel sohbet yapma, her zaman kariyer odaklı ol
      3. Türkçe yanıt ver
      4. Pratik ve uygulanabilir öneriler sun
      5. Teknik detaylara gir ama anlaşılır ol
      6. Kariyer yolu ve gelişim planı oluştur
      7. Eğitim önerileri ver (BTK Akademi, Udemy, Coursera)
      8. Proje önerileri sun
      9. İş fırsatları hakkında bilgi ver

      YANIT FORMATI:
      - Kısa ve öz ol
      - Madde halinde öneriler ver
      - Pratik adımlar sun
      - Motivasyonel ol ama gerçekçi kal
      - Her yanıtı seçilen alanla ilişkilendir`,
      
      education: `Sen Nebula Nexus'un eğitim danışmanı AI asistanısın. Yazılım geliştirme eğitimi konusunda uzmanlaşmışsın.

      KURALLAR:
      - Eğitim kaynakları öner
      - Öğrenme stratejileri sun
      - Kurs ve sertifika önerileri ver
      - Pratik öğrenme yöntemleri anlat
      - Motivasyonel ol ama gerçekçi kal
      - Türkçe yanıt ver`,
      
      technical: `Sen Nebula Nexus'un teknik destek AI asistanısın. Yazılım geliştirme teknik konularında uzmanlaşmışsın.

      KURALLAR:
      - Teknik problemleri çöz
      - Kod örnekleri ver
      - Debugging yardımı sağla
      - Best practice'ler öner
      - Teknoloji karşılaştırmaları yap
      - Türkçe yanıt ver ama teknik terimleri koru`
    };
    
    // Enhanced prompt with personality analysis
    const personalityAdaptation = generatePersonalityAdaptedPrompt(oceanScores, onetScores);
    const userPreferences = analyzeUserPreferences(context?.previousMessages || [], oceanScores);
    const timeContext = generateTimeBasedContext();
    const timeSuggestions = generateTimeBasedSuggestions(timeContext, selectedField);
    
    // Haftanın günü kontrolü
    const now = new Date();
    const dayOfWeek = now.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    let fullPrompt = `
${categoryPrompts[category as keyof typeof categoryPrompts]}

${personalityAdaptation}

ZAMAN BAZLI CONTEXT:
${timeContext.greetings[0]} ${selectedField} alanında size yardımcı olmaya hazırım!

GÜNÜN SAATİ: ${timeContext.period} (${timeContext.energyLevel} enerji seviyesi)
HAFTANIN GÜNÜ: ${isWeekend ? 'Hafta Sonu' : 'Hafta İçi'}

ZAMAN BAZLI ÖNERİLER:
${timeSuggestions.join('\n')}

KULLANICI TERCİHLERİ:
- İletişim Stili: ${userPreferences.communicationStyle}
- Detay Seviyesi: ${userPreferences.detailLevel}
- Öğrenme Stili: ${userPreferences.learningStyle}
- Odak Alanları: ${userPreferences.focusAreas.join(', ')}

KULLANICI KİŞİLİK ANALİZİ:
OCEAN Puanları (1-5 ölçeği):
- Açıklık: ${oceanScores.openness || 'Bilinmiyor'}
- Sorumluluk: ${oceanScores.conscientiousness || 'Bilinmiyor'}
- Dışadönüklük: ${oceanScores.extraversion || 'Bilinmiyor'}
- Uyumluluk: ${oceanScores.agreeableness || 'Bilinmiyor'}
- Nörotizm: ${oceanScores.neuroticism || 'Bilinmiyor'}

O*NET İlgi Alanları (1-5 ölçeği):
- Teknik: ${onetScores.technical || 'Bilinmiyor'}
- Analitik: ${onetScores.analytical || 'Bilinmiyor'}
- Yaratıcı: ${onetScores.creative || 'Bilinmiyor'}
- Sosyal: ${onetScores.social || 'Bilinmiyor'}

SEÇİLEN ALAN: ${selectedField}
SOHBET KATEGORİSİ: ${category}

KULLANICI MESAJI: ${userMessage}

ÖNCEKİ MESAJLAR: ${context?.previousMessages?.join('\n') || 'Yok'}

Lütfen yukarıdaki kişilik adaptasyonları, zaman bazlı context ve kullanıcı tercihlerini dikkate alarak yanıt ver. Yanıtın:
1. Kategoriye uygun olmalı
2. Kişilik özelliklerine uygun olmalı
3. İlgi alanlarını desteklemeli
4. Pratik ve uygulanabilir olmalı
5. Motivasyonel olmalı
6. Kullanıcının tercih ettiği detay seviyesinde olmalı
7. Günün saatine ve haftanın gününe uygun olmalı

Yanıtını Türkçe olarak ver.
`;

    // Retry logic for API quota issues
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}: Calling Gemini API...`);
        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Gemini API response received, length:', text.length);
        return text;
      } catch (error: any) {
        console.error(`❌ Gemini API Error (attempt ${attempt}):`, error);
        
        // If it's a quota error or service unavailable, wait and retry
        if ((error.message?.includes('429') || error.message?.includes('503')) && attempt < 3) {
          const waitTime = attempt * (error.message?.includes('503') ? 10 : 5); // Longer wait for 503
          console.log(`⏳ Waiting ${waitTime} seconds before retry... (${error.message?.includes('503') ? 'Service Unavailable' : 'Rate Limited'})`);
          await new Promise(resolve => setTimeout(resolve, waitTime * 1000));
          continue;
        }
        
        // For other errors or final attempt, return fallback response
        console.log('🔄 Using fallback response due to API error');
        return getFallbackResponse(userTopic, selectedField, oceanScores);
      }
    }
    
    console.log('🔄 Using fallback response after all attempts failed');
    return getFallbackResponse(userTopic, selectedField, oceanScores);
    
  } catch (error) {
    console.error('Chat with AI error:', error);
    return getFallbackResponse('general', selectedField, {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    });
  }
}

function getFallbackResponse(topic: string, field: string, oceanScores: any): string {
  const responses = {
    greeting: `Merhaba! ${field} alanında size nasıl yardımcı olabilirim? Kişilik analizinize göre size özel öneriler sunabilirim.`,
    
    career_path: `🎯 ${field} alanında kariyer yolunuz:
1. Temel becerileri öğrenin
2. Küçük projeler yapın
3. Portfolio oluşturun
4. İnternship/Staj arayın
5. Sürekli öğrenmeye devam edin

Kişilik özelliklerinize göre ${oceanScores.openness > 3.5 ? 'yaratıcı projeler' : 'sistematik yaklaşımlar'} size daha uygun olabilir.`,
    
    technology: `🛠️ ${field} için önerilen teknolojiler:
• Frontend: React, Vue, Angular
• Backend: Node.js, Python, Java
• Database: PostgreSQL, MongoDB
• DevOps: Docker, Kubernetes
• Cloud: AWS, Azure, GCP

Analitik becerileriniz yüksekse veri odaklı teknolojilere odaklanın.`,
    
    projects: `📁 ${field} için proje önerileri:
1. Todo App (Temel CRUD)
2. E-ticaret sitesi
3. Blog platformu
4. API geliştirme
5. Mobile app

${oceanScores.conscientiousness > 3.5 ? 'Detaylara önem veren projeler' : 'Hızlı prototip projeler'} size uygun olabilir.`,
    
    jobs: `💼 ${field} iş fırsatları:
• Junior Developer
• Frontend/Backend Developer
• Full Stack Developer
• DevOps Engineer
• Data Engineer

Sosyal becerileriniz yüksekse ekip çalışması gerektiren pozisyonlar size uygun.`,
    
    education: `📚 ${field} eğitim kaynakları:
• BTK Akademi (Ücretsiz)
• Udemy kursları
• Coursera sertifikaları
• YouTube eğitimleri
• GitHub örnekleri

${oceanScores.openness > 3.5 ? 'Yaratıcı kurslar' : 'Sistematik eğitimler'} size daha uygun olabilir.`,
    
    skills: `🎯 ${field} için gerekli beceriler:
• Programlama dilleri
• Framework bilgisi
• Veritabanı yönetimi
• Git versiyon kontrolü
• Problem çözme

Kişilik özelliklerinize göre ${oceanScores.extraversion > 3.5 ? 'ekip çalışması' : 'bağımsız çalışma'} becerilerinizi geliştirin.`,
    
    general: `🚀 ${field} alanında gelişmek için:
• Sürekli öğrenin
• Projeler yapın
• Topluluklara katılın
• Mentorluk alın
• Networking yapın

Kişilik analizinize göre size en uygun yaklaşımı benimseyin.`
  };
  
  return responses[topic as keyof typeof responses] || responses.general;
}

// Enhanced career path generation
export async function generateCareerPath(field: string, userLevel: string = 'beginner'): Promise<string> {
  const prompt = `
  ${field} alanında ${userLevel} seviyesi için detaylı bir kariyer yolu oluştur.
  
  Format:
  **Başlangıç Seviyesi (0-6 ay):**
  - Öğrenilecekler
  - Yapılacak projeler
  - Kaynaklar
  
  **Orta Seviye (6 ay-2 yıl):**
  - Geliştirilecek beceriler
  - Projeler
  - Sertifikalar
  
  **İleri Seviye (2+ yıl):**
  - Uzmanlaşma alanları
  - Liderlik
  - Sürekli gelişim
  
  **Zaman Çizelgesi:**
  - Her aşama için tahmini süreler
  - Milestone'lar
  - Başarı kriterleri
  `;
  
  try {
    const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text() || 'API yanıtı alınamadı.';
  } catch (error) {
    console.error('Career path generation error:', error);
    return `Üzgünüm, kariyer yolu oluşturulurken bir hata oluştu. ${field} alanında genel bir yol izleyebilirsiniz.`;
  }
}

// Skill assessment and recommendations
export async function assessSkills(field: string, currentSkills: string[]): Promise<string> {
  const prompt = `
  ${field} alanında kullanıcının mevcut becerileri: ${currentSkills.join(', ')}
  
  Bu becerilere göre:
  1. Eksik olan önemli becerileri belirle
  2. Geliştirilmesi gereken alanları öner
  3. Öncelik sırasına göre öğrenme planı oluştur
  4. Her beceri için öğrenme kaynakları öner
  
  Format:
  **Mevcut Durum Analizi:**
  - Güçlü yanlar
  - Geliştirilmesi gerekenler
  
  **Öğrenme Planı:**
  - Öncelik 1: [Beceri] - [Kaynak]
  - Öncelik 2: [Beceri] - [Kaynak]
  - Öncelik 3: [Beceri] - [Kaynak]
  
  **Önerilen Kaynaklar:**
  - Kurslar
  - Kitaplar
  - Projeler
  `;
  
  try {
    const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text() || 'API yanıtı alınamadı.';
  } catch (error) {
    console.error('Skill assessment error:', error);
    return `Üzgünüm, beceri değerlendirmesi yapılırken bir hata oluştu. ${field} alanında genel öneriler sunabilirim.`;
  }
}

// Project recommendations
export async function recommendProjects(field: string, skillLevel: string = 'beginner'): Promise<string> {
  const prompt = `
  ${field} alanında ${skillLevel} seviyesi için proje önerileri oluştur.
  
  Her proje için:
  - Proje adı ve açıklaması
  - Öğrenilecek teknolojiler
  - Tahmini süre
  - Zorluk seviyesi
  - Portfolio değeri
  
  Format:
  **Başlangıç Projeleri:**
  1. [Proje Adı]
     - Açıklama: [Detay]
     - Teknolojiler: [Liste]
     - Süre: [Tahmin]
     - Zorluk: [Seviye]
  
  **Orta Seviye Projeleri:**
  [Aynı format]
  
  **İleri Seviye Projeleri:**
  [Aynı format]
  
  **Portfolio İpuçları:**
  - Projeleri nasıl sunmalı
  - GitHub önerileri
  - Demo linkleri
  `;
  
  try {
    const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text() || 'API yanıtı alınamadı.';
  } catch (error) {
    console.error('Project recommendation error:', error);
    return `Üzgünüm, proje önerileri oluşturulurken bir hata oluştu. ${field} alanında genel proje fikirleri sunabilirim.`;
  }
}

// Job market analysis
export async function analyzeJobMarket(field: string): Promise<string> {
  const prompt = `
  ${field} alanındaki iş piyasası analizi yap.
  
  Analiz:
  - Mevcut pozisyon türleri
  - Gereksinimler ve beceriler
  - Maaş aralıkları (Türkiye)
  - Şirket türleri ve fırsatlar
  - İş bulma stratejileri
  - Gelecek trendleri
  
  Format:
  **Pozisyon Türleri:**
  - [Pozisyon]: [Açıklama]
  
  **Gereksinimler:**
  - Teknik beceriler
  - Deneyim seviyeleri
  - Sertifikalar
  
  **Maaş Aralıkları:**
  - Junior: [Aralık]
  - Mid-level: [Aralık]
  - Senior: [Aralık]
  
  **Şirket Türleri:**
  - Startup'lar
  - Büyük şirketler
  - Freelance fırsatları
  
  **İş Bulma Stratejileri:**
  - Networking
  - Portfolio
  - Online platformlar
  `;
  
  try {
    const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text() || 'API yanıtı alınamadı.';
  } catch (error) {
    console.error('Job market analysis error:', error);
    return `Üzgünüm, iş piyasası analizi yapılırken bir hata oluştu. ${field} alanında genel bilgiler sunabilirim.`;
  }
} 

export async function generateCareerRecommendations(
  oceanScores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  },
  onetScores: {
    technical: number;
    analytical: number;
    creative: number;
    social: number;
  },
  selectedField?: string
) {
  try {
    const model = genAI?.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
    KULLANICI KİŞİLİK ANALİZİ:
    OCEAN Puanları (1-5 ölçeği):
    - Açıklık: ${oceanScores.openness || 'Bilinmiyor'}
    - Sorumluluk: ${oceanScores.conscientiousness || 'Bilinmiyor'}
    - Dışadönüklük: ${oceanScores.extraversion || 'Bilinmiyor'}
    - Uyumluluk: ${oceanScores.agreeableness || 'Bilinmiyor'}
    - Nörotizm: ${oceanScores.neuroticism || 'Bilinmiyor'}

    O*NET İlgi Alanları (1-5 ölçeği):
    - Teknik: ${onetScores.technical || 'Bilinmiyor'}
    - Analitik: ${onetScores.analytical || 'Bilinmiyor'}
    - Yaratıcı: ${onetScores.creative || 'Bilinmiyor'}
    - Sosyal: ${onetScores.social || 'Bilinmiyor'}

    SEÇİLEN ALAN: ${selectedField || 'Genel Yazılım Geliştirme'}

    Bu kullanıcı için yazılım geliştirme alanında 3 kariyer önerisi ver. Her öneri için:
    1. Alan adı
    2. Güven skoru (0-1 arası)
    3. Neden bu alan uygun (kişilik özelliklerine göre)
    4. Öğrenme yolu
    5. Sonraki adımlar

    Yanıtı JSON formatında ver:
    {
      "recommendations": [
        {
          "field": "Alan Adı",
          "confidence": 0.85,
          "reasoning": "Neden uygun",
          "learningPath": "Öğrenme yolu",
          "nextSteps": "Sonraki adımlar"
        }
      ]
    }
    `;

    const result = await model?.generateContent(prompt);
    const response = await result?.response;
    return response?.text() || 'API yanıtı alınamadı.';
  } catch (error) {
    console.error('Career recommendations error:', error);
    return getFallbackResponse('general', selectedField || 'genel', oceanScores);
  }
} 