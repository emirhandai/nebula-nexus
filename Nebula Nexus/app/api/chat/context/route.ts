import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, message, conversationHistory } = await request.json();

    if (!userId || !message) {
      return NextResponse.json(
        { success: false, error: 'UserId ve message gerekli' },
        { status: 400 }
      );
    }

    // Kullanıcı profilini al
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        oceanResults: {
          orderBy: { testDate: 'desc' },
          take: 1
        },
        careerRecommendations: {
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        progressTracking: true,
        activityLogs: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Kullanıcı bulunamadı' },
        { status: 404 }
      );
    }

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

    // Kullanıcı profilini hazırla
    const userProfile = {
      name: user.name,
      selectedField: user.selectedField,
      oceanScores: user.oceanResults[0] ? {
        openness: user.oceanResults[0].openness,
        conscientiousness: user.oceanResults[0].conscientiousness,
        extraversion: user.oceanResults[0].extraversion,
        agreeableness: user.oceanResults[0].agreeableness,
        neuroticism: user.oceanResults[0].neuroticism
      } : null,
      careerRecommendations: user.careerRecommendations.slice(0, 2),
      recentActivities: user.activityLogs.map(log => log.description)
    };

    const contextPrompt = `
    Sen Nebula Nexus platformunun AI danışmanısın. Kullanıcıyla doğal, samimi ve yardımcı bir şekilde konuş.
    
    KULLANICI PROFİLİ:
    - İsim: ${userProfile.name}
    - Seçili Alan: ${userProfile.selectedField || 'Henüz seçilmemiş'}
    - OCEAN Skorları: ${userProfile.oceanScores ? JSON.stringify(userProfile.oceanScores) : 'Test yapılmamış'}
    - Kariyer Önerileri: ${userProfile.careerRecommendations.map(rec => rec.field).join(', ')}
    - Son Aktiviteler: ${userProfile.recentActivities.join(', ')}
    
    SOHBET GEÇMİŞİ:
    ${conversationHistory.slice(-5).map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
    
    KULLANICI MESAJI: ${message}
    
    YANIT KURALLARI:
    1. Türkçe yanıt ver
    2. Kişiselleştirilmiş tavsiyeler ver (OCEAN skorlarını kullan)
    3. Kullanıcının alanına uygun örnekler ver
    4. Destekleyici ve motivasyonel ol
    5. Gerekirse somut adımlar öner
    6. Emojiler kullanabilirsin ama abartma
    7. Uzun mesajları paragraflarla böl
    
    OCEAN SKORLARINA GÖRE YAKLAŞIM:
    ${userProfile.oceanScores ? `
    - Açıklık (${userProfile.oceanScores.openness}): ${userProfile.oceanScores.openness > 3.5 ? 'Yeni teknolojiler ve yaratıcı çözümler öner' : 'Kanıtlanmış yöntemler ve adım adım rehberler ver'}
    - Sorumluluk (${userProfile.oceanScores.conscientiousness}): ${userProfile.oceanScores.conscientiousness > 3.5 ? 'Detaylı planlar ve organize yaklaşımlar öner' : 'Basit, uygulanabilir adımlar ver'}
    - Dışadönüklük (${userProfile.oceanScores.extraversion}): ${userProfile.oceanScores.extraversion > 3.5 ? 'Takım çalışması ve networking öner' : 'Bireysel çalışma ve kişisel projeler öner'}
    - Uyumluluk (${userProfile.oceanScores.agreeableness}): ${userProfile.oceanScores.agreeableness > 3.5 ? 'İş birliği ve mentörlük öner' : 'Rekabetçi ortamlar ve liderlik öner'}
    - Nörotizm (${userProfile.oceanScores.neuroticism}): ${userProfile.oceanScores.neuroticism > 3.5 ? 'Stres yönetimi ve destek sistemleri öner' : 'Zorlayıcı projeler ve yeni deneyimler öner'}
    ` : 'OCEAN testi yapılmamış, genel tavsiyeler ver'}
    
    Lütfen sadece yanıt ver, JSON formatı veya başka format kullanma.
    `;

    const result = await model.generateContent(contextPrompt);
    const response = await result.response;
    const aiResponse = response.text();

    // Yanıtı veritabanına kaydet
    await prisma.chatSession.upsert({
      where: { 
        userId_id: {
          userId: userId,
          id: 'default-session'
        }
      },
      update: {
        lastMessage: message,
        updatedAt: new Date()
      },
      create: {
        id: 'default-session',
        userId: userId,
        title: 'AI Sohbet',
        lastMessage: message,
        messageCount: 1
      }
    });

    return NextResponse.json({
      success: true,
      response: aiResponse,
      userProfile: {
        name: userProfile.name,
        field: userProfile.selectedField,
        hasOceanScores: !!userProfile.oceanScores
      }
    });

  } catch (error) {
    console.error('Context chat error:', error);
    return NextResponse.json(
      { success: false, error: 'Sohbet hatası' },
      { status: 500 }
    );
  }
}