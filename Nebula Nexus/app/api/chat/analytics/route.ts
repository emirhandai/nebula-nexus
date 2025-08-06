import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { userId, messages, analysisType } = await request.json();
    
    if (!userId || !messages) {
      return NextResponse.json(
        { success: false, error: 'UserId ve messages gerekli' },
        { status: 400 }
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

    let prompt = '';
    
    switch (analysisType) {
      case 'mood_analysis':
        prompt = `
        Bu sohbet mesajlarını analiz et ve kullanıcının ruh halini değerlendir:
        
        ${messages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
        
        Lütfen şu formatta yanıt ver:
        {
          "mood": "positive/neutral/negative",
          "emotions": ["mutlu", "kaygılı", "hevesli"],
          "suggestions": ["Motivasyon desteği ver", "Daha fazla teknik detay sor"],
          "confidence": 0.85
        }
        `;
        break;

      case 'topic_analysis':
        prompt = `
        Bu sohbet mesajlarından ana konuları ve kullanıcının ilgi alanlarını çıkar:
        
        ${messages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
        
        Lütfen şu formatta yanıt ver:
        {
          "mainTopics": ["kariyer", "python", "web geliştirme"],
          "interests": ["backend", "AI", "startup"],
          "skillLevel": "beginner/intermediate/advanced",
          "nextSteps": ["React öğren", "Portfolio oluştur"],
          "resources": ["kurs linki", "makale öneri"]
        }
        `;
        break;

      case 'progress_tracking':
        prompt = `
        Bu kullanıcının sohbet geçmişinden öğrenme ilerlemesini analiz et:
        
        ${messages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
        
        Lütfen şu formatta yanıt ver:
        {
          "learningProgress": {
            "completedTopics": ["HTML", "CSS"],
            "currentFocus": "JavaScript",
            "strugglingWith": ["asenkron programlama"],
            "improvedSkills": ["problem çözme"]
          },
          "recommendations": ["Daha fazla pratik yap", "Proje geliştir"],
          "achievementScore": 75
        }
        `;
        break;

      case 'smart_suggestions':
        prompt = `
        Bu sohbet geçmişine dayanarak kullanıcıya akıllı öneriler oluştur:
        
        ${messages.map((msg: any) => `${msg.sender}: ${msg.content}`).join('\n')}
        
        Lütfen şu formatta yanıt ver:
        {
          "quickActions": [
            {"text": "Python projesi başlat", "category": "practical"},
            {"text": "Portfolio gözden geçir", "category": "career"}
          ],
          "followUpQuestions": [
            "Hangi framework'ü öğrenmek istiyorsun?",
            "Proje fikrin var mı?"
          ],
          "personalizedTips": [
            "Günlük kod yazma alışkanlığı edin",
            "GitHub'da aktif ol"
          ]
        }
        `;
        break;

      default:
        return NextResponse.json(
          { success: false, error: 'Geçersiz analiz tipi' },
          { status: 400 }
        );
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysisResult;
    try {
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      analysisResult = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, error: 'AI yanıtı işlenemiyor' },
        { status: 500 }
      );
    }

    // Analiz sonuçlarını veritabanına kaydet
    await prisma.activityLog.create({
      data: {
        userId,
        type: 'chat_analysis',
        description: `${analysisType} analizi tamamlandı`,
        details: JSON.stringify(analysisResult)
      }
    });

    return NextResponse.json({
      success: true,
      analysis: analysisResult,
      analysisType
    });

  } catch (error) {
    console.error('Chat analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Analiz hatası' },
      { status: 500 }
    );
  }
}