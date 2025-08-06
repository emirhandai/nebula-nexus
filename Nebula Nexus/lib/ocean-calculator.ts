export interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

export interface OceanQuestion {
  id: string;
  text: string;
  category: keyof OceanScores;
  reverse: boolean;
}

export function calculateOceanScores(answers: number[], questions: OceanQuestion[]): OceanScores {
  const scores = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  const traitCounts = {
    openness: 0,
    conscientiousness: 0,
    extraversion: 0,
    agreeableness: 0,
    neuroticism: 0
  };

  questions.forEach((question, index) => {
    const answer = answers[index];
    if (answer !== undefined) {
      const trait = question.category;
      const value = question.reverse ? (6 - answer) : answer;
      
      scores[trait] += value;
      traitCounts[trait]++;
    }
  });

  // Ortalama skorları hesapla
  Object.keys(scores).forEach(trait => {
    const key = trait as keyof OceanScores;
    if (traitCounts[key] > 0) {
      scores[key] = Math.round((scores[key] / traitCounts[key]) * 10) / 10;
    }
  });

  return scores;
}

export function getPersonalityDescription(scores: OceanScores): string {
  const descriptions: string[] = [];

  if (scores.openness >= 4) {
    descriptions.push("Yaratıcı ve yenilikçi düşünürsünüz");
  } else if (scores.openness <= 2) {
    descriptions.push("Geleneksel ve pratik yaklaşımları tercih edersiniz");
  }

  if (scores.conscientiousness >= 4) {
    descriptions.push("Organize ve sorumluluk sahibisiniz");
  } else if (scores.conscientiousness <= 2) {
    descriptions.push("Esnek ve spontane bir yapınız var");
  }

  if (scores.extraversion >= 4) {
    descriptions.push("Sosyal ve enerjik bir kişiliğe sahipsiniz");
  } else if (scores.extraversion <= 2) {
    descriptions.push("Sakin ve içe dönük bir yapınız var");
  }

  if (scores.agreeableness >= 4) {
    descriptions.push("İşbirlikçi ve anlayışlısınız");
  } else if (scores.agreeableness <= 2) {
    descriptions.push("Rekabetçi ve doğrudan iletişim kurarsınız");
  }

  if (scores.neuroticism >= 4) {
    descriptions.push("Duygusal hassasiyetiniz yüksek");
  } else if (scores.neuroticism <= 2) {
    descriptions.push("Duygusal olarak dengeli ve sakin bir yapınız var");
  }

  return descriptions.join(". ") + ".";
}

export function getRecommendedFields(scores: OceanScores): string[] {
  const recommendations: string[] = [];

  // Yüksek açıklık -> Yaratıcı alanlar
  if (scores.openness >= 4) {
    recommendations.push("Yapay Zeka & Makine Öğrenmesi");
    recommendations.push("Oyun Geliştirme");
    recommendations.push("AR/VR Geliştirme");
  }

  // Yüksek sorumluluk -> Detay odaklı alanlar
  if (scores.conscientiousness >= 4) {
    recommendations.push("Siber Güvenlik");
    recommendations.push("DevOps");
    recommendations.push("Veri Bilimi");
  }

  // Yüksek dışadönüklük -> Sosyal alanlar
  if (scores.extraversion >= 4) {
    recommendations.push("Proje Yönetimi");
    recommendations.push("Ürün Yönetimi");
    recommendations.push("Müşteri İlişkileri");
  }

  // Yüksek uyumluluk -> İşbirlikçi alanlar
  if (scores.agreeableness >= 4) {
    recommendations.push("Takım Liderliği");
    recommendations.push("Mentorluk");
    recommendations.push("Topluluk Yönetimi");
  }

  // Düşük nevrotiklik -> Stresli alanlar
  if (scores.neuroticism <= 2) {
    recommendations.push("Sistem Yönetimi");
    recommendations.push("Kritik Sistemler");
    recommendations.push("7/24 Destek");
  }

  // Genel öneriler
  if (scores.openness >= 3 && scores.conscientiousness >= 3) {
    recommendations.push("Web Geliştirme");
    recommendations.push("Mobil Geliştirme");
  }

  if (scores.conscientiousness >= 4 && scores.neuroticism <= 3) {
    recommendations.push("Blockchain Geliştirme");
    recommendations.push("IoT Geliştirme");
  }

  // Tekrarları kaldır ve en popüler 5 tanesini döndür
  return [...new Set(recommendations)].slice(0, 5);
} 