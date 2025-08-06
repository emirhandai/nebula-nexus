import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Try different ways to get user ID
    let userId = (session.user as any).id;
    
    if (!userId && session.user.email) {
      // If no ID, try to get user by email
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      userId = user?.id;
    }

    console.log('Career recommendations requested for user:', userId);
    console.log('Session user:', session.user);

    if (!userId) {
      console.error('User ID is undefined in session');
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }

    // Get user's career recommendations
    let recommendations = await prisma.careerRecommendation.findMany({
      where: { userId },
      orderBy: { confidence: 'desc' }
    });

    console.log('Existing recommendations found:', recommendations.length);

    // Get user's latest OCEAN test results
    const latestOceanResult = await prisma.oceanResult.findFirst({
      where: { userId },
      orderBy: { testDate: 'desc' }
    });

    console.log('Latest OCEAN result found:', !!latestOceanResult);

    // Get user's selected field
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { selectedField: true }
    });

    // If no recommendations exist but user has OCEAN scores, generate them
    if (recommendations.length === 0 && latestOceanResult && userId) {
      console.log('Generating new career recommendations...');
      recommendations = await generateCareerRecommendations(userId, latestOceanResult);
      console.log('Generated recommendations:', recommendations.length);
    }

    const response = {
      recommendations: recommendations.map(rec => ({
        id: rec.id,
        field: rec.field,
        confidence: rec.confidence,
        reasoning: rec.reasoning,
        createdAt: rec.createdAt
      })),
      oceanScores: latestOceanResult ? {
        openness: latestOceanResult.openness,
        conscientiousness: latestOceanResult.conscientiousness,
        extraversion: latestOceanResult.extraversion,
        agreeableness: latestOceanResult.agreeableness,
        neuroticism: latestOceanResult.neuroticism,
        testDate: latestOceanResult.testDate
      } : null,
      selectedField: user?.selectedField,
      totalRecommendations: recommendations.length
    };

    console.log('Sending response with', recommendations.length, 'recommendations');
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching career recommendations:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateCareerRecommendations(userId: string, oceanResult: any) {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = oceanResult;
  
  // Convert 1-5 scale to 0-100 scale (1=0, 2=25, 3=50, 4=75, 5=100)
  const convertTo100Scale = (score: number) => {
    if (score <= 1) return 0;
    if (score <= 2) return 25;
    if (score <= 3) return 50;
    if (score <= 4) return 75;
    return 100;
  };
  
  const oceanScores100 = {
    openness: convertTo100Scale(openness),
    conscientiousness: convertTo100Scale(conscientiousness),
    extraversion: convertTo100Scale(extraversion),
    agreeableness: convertTo100Scale(agreeableness),
    neuroticism: convertTo100Scale(neuroticism)
  };
  
  console.log('Original OCEAN scores (1-5):', { openness, conscientiousness, extraversion, agreeableness, neuroticism });
  console.log('Converted OCEAN scores (0-100):', oceanScores100);
  
  // Define career fields with their requirements
  const careerFields = [
    {
      field: 'AI & Machine Learning',
      requirements: { openness: 75, conscientiousness: 75, extraversion: 50, agreeableness: 50, neuroticism: 25 },
      reasoning: 'Yüksek açıklık ve sorumluluk skorlarınız, yaratıcı problem çözme ve sistematik düşünme gerektiren AI alanında başarılı olmanızı sağlar.',
      description: 'Yapay zeka ve makine öğrenmesi alanında yazılım geliştirme ve algoritma tasarlama.'
    },
    {
      field: 'Frontend Development',
      requirements: { openness: 50, conscientiousness: 75, extraversion: 75, agreeableness: 75, neuroticism: 50 },
      reasoning: 'Orta düzey dışadönüklük ve uyumluluk skorlarınız, kullanıcı deneyimi odaklı frontend geliştirmede avantaj sağlar.',
      description: 'Kullanıcı arayüzü tasarlama ve web uygulamalarının ön yüz kısmını geliştirme.'
    },
    {
      field: 'Mobile Development',
      requirements: { openness: 50, conscientiousness: 75, extraversion: 75, agreeableness: 50, neuroticism: 25 },
      reasoning: 'Yüksek sorumluluk ve dışadönüklük skorlarınız, mobil uygulama geliştirmede hem teknik hem de kullanıcı odaklı çalışmanızı sağlar.',
      description: 'iOS ve Android platformları için mobil uygulama geliştirme.'
    },
    {
      field: 'Cybersecurity',
      requirements: { openness: 75, conscientiousness: 100, extraversion: 25, agreeableness: 50, neuroticism: 0 },
      reasoning: 'Yüksek sorumluluk ve düşük nörotizm skorlarınız, detay odaklı ve stresli ortamlarda çalışmayı gerektiren siber güvenlik alanında başarılı olmanızı sağlar.',
      description: 'Bilgi sistemlerini güvenlik tehditlerine karşı koruma ve güvenlik çözümleri geliştirme.'
    },
    {
      field: 'Data Engineering',
      requirements: { openness: 75, conscientiousness: 75, extraversion: 50, agreeableness: 50, neuroticism: 25 },
      reasoning: 'Yüksek açıklık ve sorumluluk skorlarınız, büyük veri analizi ve sistem tasarımı gerektiren veri mühendisliği alanında avantaj sağlar.',
      description: 'Büyük veri sistemleri tasarlama ve veri işleme altyapıları geliştirme.'
    },
    {
      field: 'Backend Development',
      requirements: { openness: 50, conscientiousness: 75, extraversion: 50, agreeableness: 50, neuroticism: 25 },
      reasoning: 'Yüksek sorumluluk skorunuz, sistem tasarımı ve optimizasyon gerektiren backend geliştirmede başarılı olmanızı sağlar.',
      description: 'Sunucu tarafı uygulamalar geliştirme ve veritabanı yönetimi.'
    },
    {
      field: 'Full Stack Development',
      requirements: { openness: 75, conscientiousness: 75, extraversion: 75, agreeableness: 75, neuroticism: 25 },
      reasoning: 'Dengeli skorlarınız, hem frontend hem backend teknolojilerini kapsayan full stack geliştirmede esneklik sağlar.',
      description: 'Web uygulamalarının hem ön yüz hem de arka yüz kısmını geliştirme.'
    },
    {
      field: 'DevOps Engineering',
      requirements: { openness: 50, conscientiousness: 100, extraversion: 75, agreeableness: 50, neuroticism: 25 },
      reasoning: 'Yüksek sorumluluk skorunuz, sürekli entegrasyon ve dağıtım süreçlerini yönetmeyi gerektiren DevOps alanında başarılı olmanızı sağlar.',
      description: 'Yazılım geliştirme ve operasyon süreçlerini otomatikleştirme ve optimize etme.'
    }
  ];

  // Calculate match scores for each field
  const recommendations = careerFields.map(field => {
    const { requirements } = field;
    let totalMatch = 0;
    let maxPossible = 0;

    Object.entries(requirements).forEach(([trait, requiredScore]) => {
      const userScore = oceanScores100[trait as keyof typeof oceanScores100] || 0;
      // Calculate match based on how close the scores are
      const difference = Math.abs(userScore - requiredScore);
      const match = Math.max(0, 100 - difference);
      totalMatch += match;
      maxPossible += 100;
    });

    const confidence = Math.round((totalMatch / maxPossible) * 100);
    
    console.log(`Field: ${field.field}, Confidence: ${confidence}%`);
    
    return {
      userId,
      oceanResultId: oceanResult.id, // Eksik olan oceanResultId eklendi
      field: field.field,
      confidence,
      description: field.description, // Eksik olan description eklendi
      reasoning: field.reasoning,
      createdAt: new Date()
    };
  });

  // Sort by confidence and return all recommendations
  recommendations.sort((a, b) => b.confidence - a.confidence);
  
  console.log(`✅ ${recommendations.length} öneri oluşturuldu`);

  // Save to database
  const savedRecommendations = await Promise.all(
    recommendations.map(rec => 
      prisma.careerRecommendation.create({
        data: rec
      })
    )
  );

  return savedRecommendations;
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 400 });
    }
    
    const body = await request.json();
    const { field, confidence, reasoning, description, oceanResultId } = body;

    // Get latest ocean result if not provided
    let finalOceanResultId = oceanResultId;
    if (!finalOceanResultId) {
      const latestOceanResult = await prisma.oceanResult.findFirst({
        where: { userId },
        orderBy: { testDate: 'desc' }
      });
      
      if (!latestOceanResult) {
        return NextResponse.json({ error: 'No OCEAN test results found' }, { status: 400 });
      }
      
      finalOceanResultId = latestOceanResult.id;
    }

    // Create new career recommendation
    const recommendation = await prisma.careerRecommendation.create({
      data: {
        userId,
        oceanResultId: finalOceanResultId, // Eksik olan oceanResultId eklendi
        field,
        confidence,
        description: description || `${field} alanında kariyer önerisi`, // Eksik olan description eklendi
        reasoning
      }
    });

    return NextResponse.json({ success: true, recommendation });
  } catch (error) {
    console.error('Error creating career recommendation:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}