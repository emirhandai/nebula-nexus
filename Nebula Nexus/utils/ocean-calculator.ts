import { OceanScores, OceanQuestion } from '@/types';

export function calculateOceanScores(
  answers: Record<string, number>,
  questions: OceanQuestion[]
): OceanScores {
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  const categoryCounts = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  questions.forEach(question => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      let score = answer;
      
      // Reverse sorular için skoru tersine çevir
      if (question.reverse) {
        score = 6 - score; // 1-5 skalası için
      }
      
      scores[question.category] += score;
      categoryCounts[question.category]++;
    }
  });

  // Her kategori için ortalama hesapla ve 0-100 skalasına çevir
  Object.keys(scores).forEach(category => {
    const key = category as keyof OceanScores;
    if (categoryCounts[key] > 0) {
      const average = scores[key] / categoryCounts[key];
      // 1-5 skalasından 0-100 skalasına çevir
      scores[key] = Math.round((average - 1) * 25);
    }
  });

  return scores;
}

export function getPersonalityDescription(scores: OceanScores): {
  type: string;
  description: string;
  strengths: string[];
  areas: string[];
} {
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

  // Kişilik tipini belirle
  let type = '';
  let description = '';
  let strengths: string[] = [];
  let areas: string[] = [];

  // Açıklık analizi
  if (openness >= 70) {
    type += 'Yaratıcı ';
    strengths.push('Yenilikçi düşünme', 'Soyut kavramları anlama', 'Sanatsal ilgi');
  } else if (openness <= 30) {
    type += 'Pratik ';
    areas.push('Yeni deneyimlere açıklık', 'Soyut düşünme');
  }

  // Sorumluluk analizi
  if (conscientiousness >= 70) {
    type += 'Organize ';
    strengths.push('Planlama', 'Detay odaklılık', 'Güvenilirlik');
  } else if (conscientiousness <= 30) {
    type += 'Esnek ';
    areas.push('Organizasyon', 'Zaman yönetimi');
  }

  // Dışadönüklük analizi
  if (extraversion >= 70) {
    type += 'Sosyal ';
    strengths.push('İletişim becerileri', 'Liderlik', 'Enerji');
  } else if (extraversion <= 30) {
    type += 'İçedönük ';
    strengths.push('Derinlemesine düşünme', 'Odaklanma');
    areas.push('Sosyal etkileşim');
  }

  // Uyumluluk analizi
  if (agreeableness >= 70) {
    type += 'İşbirlikçi ';
    strengths.push('Takım çalışması', 'Empati', 'Uyumluluk');
  } else if (agreeableness <= 30) {
    type += 'Bağımsız ';
    strengths.push('Kararlılık', 'Objektiflik');
    areas.push('İşbirliği');
  }

  // Duygusal dengelilik analizi
  if (neuroticism <= 30) {
    type += 'Sakin ';
    strengths.push('Stres yönetimi', 'Duygusal denge');
  } else if (neuroticism >= 70) {
    type += 'Hassas ';
    strengths.push('Detay algısı', 'Duygusal farkındalık');
    areas.push('Stres yönetimi');
  }

  // Genel açıklama
  description = `${type.trim()} kişilik tipine sahipsiniz. Bu profil, yazılım alanında belirli uzmanlık alanlarına yönelmenizde size yardımcı olacaktır.`;

  return {
    type: type.trim(),
    description,
    strengths,
    areas
  };
}

export function getRecommendedFields(scores: OceanScores): string[] {
  const recommendations: string[] = [];
  const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;

  // Yapay Zeka ve Makine Öğrenmesi
  if (openness >= 60 && conscientiousness >= 50) {
    recommendations.push('Yapay Zeka ve Makine Öğrenmesi');
  }

  // Web Geliştirme
  if (extraversion >= 50 && agreeableness >= 50) {
    recommendations.push('Web Geliştirme');
  }

  // Mobil Uygulama Geliştirme
  if (extraversion >= 60 && openness >= 50) {
    recommendations.push('Mobil Uygulama Geliştirme');
  }

  // Siber Güvenlik
  if (conscientiousness >= 70 && neuroticism <= 40) {
    recommendations.push('Siber Güvenlik');
  }

  // Veri Bilimi
  if (openness >= 60 && conscientiousness >= 60) {
    recommendations.push('Veri Bilimi');
  }

  // Oyun Geliştirme
  if (openness >= 70 && extraversion >= 50) {
    recommendations.push('Oyun Geliştirme');
  }

  // DevOps
  if (conscientiousness >= 60 && neuroticism <= 50) {
    recommendations.push('DevOps ve Sistem Yönetimi');
  }

  // Blockchain
  if (openness >= 70 && neuroticism <= 40) {
    recommendations.push('Blockchain ve Kripto');
  }

  // IoT
  if (conscientiousness >= 60 && neuroticism <= 50) {
    recommendations.push('IoT ve Gömülü Sistemler');
  }

  // UI/UX
  if (agreeableness >= 60 && openness >= 50) {
    recommendations.push('UI/UX Tasarımı');
  }

  // Eğer hiç öneri yoksa, genel öneriler
  if (recommendations.length === 0) {
    recommendations.push('Web Geliştirme', 'Veri Bilimi');
  }

  return recommendations.slice(0, 3); // En fazla 3 öneri
} 