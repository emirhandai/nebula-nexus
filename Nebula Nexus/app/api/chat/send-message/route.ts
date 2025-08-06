import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { message, sessionId, context } = await request.json();

    if (!message || !sessionId) {
      return NextResponse.json(
        { error: 'Message and sessionId are required' },
        { status: 400 }
      );
    }

    console.log('📨 Received message:', message);
    console.log('🆔 Session ID:', sessionId);
    console.log('📋 Context:', context);

    // Session'ı kontrol et
    console.log('🔍 Checking session...');
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      include: { messages: true }
    });

    if (!session) {
      console.log('❌ Session not found');
      return NextResponse.json(
        { error: 'Chat session not found' },
        { status: 404 }
      );
    }

    console.log('✅ Session found, user ID:', session.userId);

    // Kullanıcı mesajını kaydet
    console.log('💾 Saving user message...');
    const userMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        content: message,
        role: 'user',
        timestamp: new Date()
      }
    });
    console.log('✅ User message saved with ID:', userMessage.id);

    // AI yanıtını oluştur
    console.log('🤖 Generating AI response...');
    const aiResponse = generateAIResponse(message, context);
    console.log('✅ AI response generated:', aiResponse);

    // AI mesajını kaydet
    console.log('💾 Saving AI message...');
    const aiMessage = await prisma.chatMessage.create({
      data: {
        sessionId: sessionId,
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }
    });
    console.log('✅ AI message saved with ID:', aiMessage.id);

    // Session'ı güncelle
    console.log('🔄 Updating chat session...');
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() }
    });
    console.log('✅ Chat session updated');

    console.log('✅ API completed successfully');
    return NextResponse.json({
      success: true,
      response: aiResponse,
      messageId: aiMessage.id
    });
  } catch (error: any) {
    console.error('❌ Error sending message:', error);
    console.error('Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack
    });
    return NextResponse.json(
      { error: 'Failed to send message', details: error?.message || 'Unknown error' },
      { status: 500 }
    );
  }
}

function generateAIResponse(message: string, context?: any): string {
  const lowerMessage = message.toLowerCase();
  
  // OCEAN skorlarına göre kişiselleştirilmiş yanıtlar
  if (context?.oceanScores) {
    const scores = context.oceanScores;
    
    // Açıklık (Openness) yüksekse
    if (scores.openness > 70) {
      if (lowerMessage.includes('yapay zeka') || lowerMessage.includes('ai') || lowerMessage.includes('machine learning')) {
        return "Harika! Yüksek açıklık skorunuz, yaratıcı problem çözme ve yenilikçi teknolojilerle çalışmaya çok uygun. AI/ML alanında başarılı olabilirsiniz. Python, TensorFlow ve PyTorch ile başlayabilirsiniz. Hangi AI konusu size daha çekici geliyor?";
      }
    }
    
    // Sorumluluk (Conscientiousness) yüksekse
    if (scores.conscientiousness > 70) {
      if (lowerMessage.includes('devops') || lowerMessage.includes('sistem') || lowerMessage.includes('deployment')) {
        return "Mükemmel! Yüksek sorumluluk skorunuz, sistem yönetimi ve sürekli entegrasyon süreçlerinde mükemmeliyetçilik göstereceğinizi belirtiyor. DevOps alanında Docker, Kubernetes ve CI/CD pipeline\'ları öğrenmenizi öneririm.";
      }
    }
    
    // Dışadönüklük (Extraversion) yüksekse
    if (scores.extraversion > 70) {
      if (lowerMessage.includes('yönetici') || lowerMessage.includes('lider') || lowerMessage.includes('ekip')) {
        return "Harika! Yüksek dışadönüklük skorunuz, ekip liderliği ve müşteri iletişimi konularında başarılı olacağınızı işaret ediyor. Product Manager veya Technical Lead pozisyonları size çok uygun olabilir.";
      }
    }
  }

  // Genel yanıtlar
  if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam')) {
    return "Merhaba! 👋 Yazılım kariyeriniz hakkında size nasıl yardımcı olabilirim? Hangi alan hakkında bilgi almak istiyorsunuz?";
  }
  
  if (lowerMessage.includes('yazılım') || lowerMessage.includes('programlama')) {
    return "Yazılım geliştirme harika bir kariyer seçimi! Hangi alan size daha çekici geliyor? Web geliştirme, mobil uygulama, yapay zeka, siber güvenlik veya başka bir alan?";
  }
  
  if (lowerMessage.includes('web') || lowerMessage.includes('frontend') || lowerMessage.includes('backend')) {
    return "Web geliştirme çok popüler bir alan! Frontend için HTML, CSS, JavaScript ve React öğrenmenizi, backend için Node.js, Python veya Java öneririm. Hangi taraf size daha çekici geliyor?";
  }
  
  if (lowerMessage.includes('mobil') || lowerMessage.includes('android') || lowerMessage.includes('ios')) {
    return "Mobil uygulama geliştirme çok heyecan verici! Android için Kotlin/Java, iOS için Swift öğrenmenizi öneririm. React Native ile her iki platform için de geliştirme yapabilirsiniz. Hangi platformu tercih edersiniz?";
  }
  
  if (lowerMessage.includes('güvenlik') || lowerMessage.includes('siber')) {
    return "Siber güvenlik çok önemli ve dinamik bir alan! Ağ güvenliği, uygulama güvenliği veya penetrasyon testi konularından hangisi size daha çekici geliyor?";
  }
  
  if (lowerMessage.includes('veri') || lowerMessage.includes('data')) {
    return "Veri bilimi çok değerli bir alan! Python, SQL, istatistik ve makine öğrenmesi temellerini öğrenmenizi öneririm. Hangi veri analizi konusu size daha çekici geliyor?";
  }
  
  if (lowerMessage.includes('oyun') || lowerMessage.includes('game')) {
    return "Oyun geliştirme yaratıcılık gerektiren bir alan! Unity (C#) veya Unreal Engine (C++) ile başlayabilirsiniz. Hangi tür oyunlar geliştirmek istiyorsunuz?";
  }
  
  if (lowerMessage.includes('blockchain') || lowerMessage.includes('kripto')) {
    return "Blockchain teknolojisi geleceğin teknolojisi! Solidity, Ethereum ve akıllı kontratlar öğrenmenizi öneririm. DeFi, NFT veya başka bir blockchain alanı size çekici geliyor mu?";
  }
  
  if (lowerMessage.includes('teşekkür') || lowerMessage.includes('sağol')) {
    return "Rica ederim! 😊 Başka bir konuda yardıma ihtiyacınız olursa sormaktan çekinmeyin. Yazılım kariyerinizde başarılar dilerim!";
  }

  // Varsayılan yanıt
  return "İlginç bir soru! Yazılım dünyasında herkesin kendine özgü bir yolu var. Senin ilgi alanların ve hedeflerin neler? Hangi teknolojiler seni daha çok heyecanlandırıyor?";
} 