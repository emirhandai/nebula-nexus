import { NextRequest, NextResponse } from 'next/server';
import { getTopRecommendedFields, getFieldById } from '@/data/onet-data';
import { getOnetRecommendations } from '@/data/onet-questions';

export async function POST(request: NextRequest) {
  try {
    const { oceanScores, onetScores, userId } = await request.json();

    if (!oceanScores) {
      return NextResponse.json(
        { error: 'OCEAN skorları gerekli' },
        { status: 400 }
      );
    }

    // Validate OCEAN scores
    const requiredFields = ['openness', 'conscientiousness', 'extraversion', 'agreeableness', 'neuroticism'];
    for (const field of requiredFields) {
      if (typeof oceanScores[field] !== 'number' || oceanScores[field] < 0 || oceanScores[field] > 100) {
        return NextResponse.json(
          { error: `Geçersiz ${field} skoru` },
          { status: 400 }
        );
      }
    }

    // Analyze personality with O*NET data
    const topFields = getTopRecommendedFields(oceanScores, 5);
    
    // Calculate average score
    const averageScore = Math.round(
      (oceanScores.openness + oceanScores.conscientiousness + 
       oceanScores.extraversion + oceanScores.agreeableness + 
       oceanScores.neuroticism) / 5
    );

    // Enhanced analysis with O*NET scores
    let enhancedRecommendations = topFields;
    let onetInsights: string[] | null = null;

    if (onetScores) {
      // Validate O*NET scores
      const onetFields = ['technical', 'soft', 'work_style', 'work_context'];
      const isValidOnet = onetFields.every(field => 
        typeof onetScores[field] === 'number' && onetScores[field] >= 0 && onetScores[field] <= 100
      );

      if (isValidOnet) {
        // Get O*NET recommendations
        onetInsights = getOnetRecommendations(onetScores);
        
        // Enhance field recommendations with O*NET scores
        enhancedRecommendations = topFields.map(recommendation => {
          const field = recommendation.field;
          let enhancedScore = recommendation.matchScore;
          
          // Adjust score based on O*NET scores
          if (onetScores.technical >= 80 && field.category === 'ai') {
            enhancedScore += 10; // Boost AI fields for high technical skills
          }
          if (onetScores.soft >= 80 && field.category === 'frontend') {
            enhancedScore += 8; // Boost frontend for high soft skills
          }
          if (onetScores.work_style >= 80 && field.category === 'devops') {
            enhancedScore += 10; // Boost DevOps for high work style
          }
          if (onetScores.work_context >= 80 && field.category === 'mobile') {
            enhancedScore += 8; // Boost mobile for high adaptability
          }
          
          return {
            ...recommendation,
            matchScore: Math.min(100, enhancedScore),
            onetCompatibility: {
              technical: onetScores.technical >= 70 ? 'Yüksek' : onetScores.technical >= 50 ? 'Orta' : 'Düşük',
              soft: onetScores.soft >= 70 ? 'Yüksek' : onetScores.soft >= 50 ? 'Orta' : 'Düşük',
              work_style: onetScores.work_style >= 70 ? 'Yüksek' : onetScores.work_style >= 50 ? 'Orta' : 'Düşük',
              work_context: onetScores.work_context >= 70 ? 'Yüksek' : onetScores.work_context >= 50 ? 'Orta' : 'Düşük'
            }
          };
        }).sort((a, b) => b.matchScore - a.matchScore);
      }
    }

    // Generate detailed analysis
    const analysis = {
      oceanScores,
      onetScores,
      averageScore,
      personalityType: getPersonalityType(oceanScores),
      topRecommendations: enhancedRecommendations,
      careerInsights: generateCareerInsights(oceanScores, enhancedRecommendations, onetScores),
      developmentPlan: generateDevelopmentPlan(oceanScores, enhancedRecommendations[0], onetScores),
      marketTrends: getMarketTrends(enhancedRecommendations),
      onetInsights
    };

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('OCEAN analysis error:', error);
    return NextResponse.json(
      { error: 'Analiz sırasında bir hata oluştu' },
      { status: 500 }
    );
  }
}

function getPersonalityType(scores: any) {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;
  
  // Normalize scores to 1-5 scale if they're in 0-100 range
  const normalizedScores = {
    openness: openness > 5 ? Math.round((openness / 100) * 5 * 10) / 10 : openness,
    conscientiousness: conscientiousness > 5 ? Math.round((conscientiousness / 100) * 5 * 10) / 10 : conscientiousness,
    extraversion: extraversion > 5 ? Math.round((extraversion / 100) * 5 * 10) / 10 : extraversion,
    agreeableness: agreeableness > 5 ? Math.round((agreeableness / 100) * 5 * 10) / 10 : agreeableness,
    neuroticism: neuroticism > 5 ? Math.round((neuroticism / 100) * 5 * 10) / 10 : neuroticism
  };

  // Enhanced personality type classification based on OCEAN scores
  if (normalizedScores.openness > 4 && normalizedScores.conscientiousness > 4) {
    return {
      type: 'Yaratıcı Mükemmeliyetçi',
      description: 'Yenilikçi fikirler üretir ve bunları sistematik şekilde uygular. Detaylara önem verirken yaratıcı çözümler geliştirir.',
      strengths: ['Yaratıcılık', 'Organizasyon', 'Problem Çözme', 'İnovasyon'],
      weaknesses: ['Aşırı mükemmeliyetçilik', 'Zaman yönetimi'],
      idealFields: ['AI/ML Research', 'Software Architecture', 'Innovation Management', 'Technical Leadership']
    };
  } else if (normalizedScores.extraversion > 4 && normalizedScores.agreeableness > 4) {
    return {
      type: 'Sosyal Lider',
      description: 'İnsanlarla iyi iletişim kurar ve takım çalışmasında başarılıdır. Motivasyonu yüksek ve empatik bir lider.',
      strengths: ['İletişim', 'Liderlik', 'Takım Çalışması', 'Motivasyon'],
      weaknesses: ['Teknik detaylara odaklanma', 'Bireysel çalışma'],
      idealFields: ['Technical Lead', 'Product Manager', 'Team Leadership', 'Customer Success']
    };
  } else if (normalizedScores.conscientiousness > 4 && normalizedScores.neuroticism < 2) {
    return {
      type: 'Güvenilir Uzman',
      description: 'Detaylara önem verir ve stres altında bile performans gösterir. Sistematik ve güvenilir çalışma tarzı.',
      strengths: ['Güvenilirlik', 'Detay Odaklılık', 'Stres Yönetimi', 'Sistematik Yaklaşım'],
      weaknesses: ['Esneklik', 'Hızlı değişim'],
      idealFields: ['DevOps', 'Security', 'Quality Assurance', 'System Administration']
    };
  } else if (normalizedScores.openness > 4 && normalizedScores.extraversion > 4) {
    return {
      type: 'Yenilikçi Maceracı',
      description: 'Yeni deneyimler arar ve yaratıcı çözümler üretir. Risk almayı sever ve sürekli öğrenmeye açık.',
      strengths: ['Yaratıcılık', 'Adaptasyon', 'Risk Alma', 'Öğrenme Açıklığı'],
      weaknesses: ['Süreklilik', 'Detay odaklılık'],
      idealFields: ['Game Development', 'Startup', 'Innovation', 'Research & Development']
    };
  } else if (normalizedScores.agreeableness > 4 && normalizedScores.neuroticism < 2) {
    return {
      type: 'Dengeli İşbirlikçi',
      description: 'Çevresiyle uyumlu çalışır ve sakin bir yaklaşım sergiler. İşbirliği odaklı ve stabil.',
      strengths: ['Uyumluluk', 'Sakinlik', 'İşbirliği', 'Stabilite'],
      weaknesses: ['Liderlik', 'Rekabetçilik'],
      idealFields: ['Support Engineering', 'Documentation', 'Training', 'Quality Assurance']
    };
  } else {
    return {
      type: 'Benzersiz Profil',
      description: 'Kendine özgü bir kişilik profiline sahipsiniz. Farklı alanlarda başarılı olabilir.',
      strengths: ['Özgünlük', 'Esneklik', 'Potansiyel', 'Adaptasyon'],
      weaknesses: ['Odaklanma', 'Uzmanlaşma'],
      idealFields: ['Full Stack Development', 'Generalist Roles', 'Consulting', 'Entrepreneurship']
    };
  }
}

function generateCareerInsights(scores: any, topFields: any[], onetScores?: any) {
  const insights: string[] = [];
  
  // OCEAN-based insights
  if (scores.openness > 70) {
    insights.push('Yüksek açıklık skorunuz, yaratıcı ve yenilikçi alanlarda başarılı olacağınızı gösteriyor.');
  }
  
  if (scores.conscientiousness > 70) {
    insights.push('Güçlü sorumluluk özelliğiniz, detay odaklı ve sistematik çalışma gerektiren alanlarda avantaj sağlar.');
  }
  
  if (scores.extraversion > 70) {
    insights.push('Yüksek dışadönüklük skorunuz, ekip çalışması ve liderlik pozisyonlarında başarılı olacağınızı işaret ediyor.');
  }
  
  if (scores.agreeableness > 70) {
    insights.push('Güçlü uyumluluk özelliğiniz, müşteri odaklı ve işbirliği gerektiren alanlarda değerli.');
  }
  
  if (scores.neuroticism < 30) {
    insights.push('Düşük duygusal dengesizlik skorunuz, stresli ortamlarda bile performans gösterebileceğinizi belirtiyor.');
  }

  // O*NET-based insights
  if (onetScores) {
    if (onetScores.technical >= 80) {
      insights.push('Yüksek teknik becerileriniz, karmaşık teknoloji alanlarında başarılı olmanızı sağlar.');
    }
    
    if (onetScores.soft >= 80) {
      insights.push('Güçlü yumuşak becerileriniz, ekip liderliği ve müşteri ilişkilerinde avantaj sağlar.');
    }
    
    if (onetScores.work_style >= 80) {
      insights.push('Mükemmeliyetçi çalışma tarzınız, kalite odaklı alanlarda çok değerli.');
    }
    
    if (onetScores.work_context >= 80) {
      insights.push('Yüksek adaptasyon becerileriniz, hızlı değişen teknoloji ortamında büyük avantaj.');
    }
  }

  return insights;
}

function generateDevelopmentPlan(scores: any, topField: any, onetScores?: any) {
  const plan = {
    shortTerm: [] as string[],
    mediumTerm: [] as string[],
    longTerm: [] as string[],
    focusAreas: [] as string[],
  };

  // Personality-based development areas
  if (scores.openness < 60) {
    plan.shortTerm.push('Yeni teknolojileri öğrenmeye daha fazla zaman ayırın');
    plan.focusAreas.push('Açıklık');
  }
  
  if (scores.conscientiousness < 60) {
    plan.shortTerm.push('Proje yönetimi ve organizasyon becerilerinizi geliştirin');
    plan.focusAreas.push('Sorumluluk');
  }
  
  if (scores.extraversion < 50) {
    plan.mediumTerm.push('İletişim ve takım çalışması becerilerinizi güçlendirin');
    plan.focusAreas.push('Dışadönüklük');
  }

  // O*NET-based development areas
  if (onetScores) {
    if (onetScores.technical < 70) {
      plan.shortTerm.push('Teknik becerilerinizi geliştirmek için pratik projeler yapın');
      plan.focusAreas.push('Teknik Beceriler');
    }
    
    if (onetScores.soft < 70) {
      plan.mediumTerm.push('İletişim ve problem çözme becerilerinizi geliştirin');
      plan.focusAreas.push('Yumuşak Beceriler');
    }
    
    if (onetScores.work_style < 70) {
      plan.shortTerm.push('Çalışma alışkanlıklarınızı ve organizasyon becerilerinizi iyileştirin');
      plan.focusAreas.push('Çalışma Tarzı');
    }
  }

  // Field-specific recommendations
  if (topField) {
    plan.longTerm.push(`${topField.field.name} alanında uzmanlaşmak için sürekli öğrenme planı oluşturun`);
    plan.mediumTerm.push(`${topField.field.skills.technical.slice(0, 3).join(', ')} teknolojilerini öğrenin`);
  }

  return plan;
}

function getMarketTrends(topFields: any[]) {
  const trends: any[] = [];
  
  topFields.forEach(field => {
    if (field.field.demand === 'high') {
      trends.push(`${field.field.name} alanında yüksek talep var ve maaşlar yükseliyor.`);
    } else if (field.field.demand === 'medium') {
      trends.push(`${field.field.name} alanında orta düzeyde talep var, rekabet artıyor.`);
    }
  });

  return trends;
} 