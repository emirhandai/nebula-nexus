export interface OnetQuestion {
  id: number;
  question: string;
  category: 'technical' | 'soft' | 'work_style' | 'work_context' | 'analytical' | 'creative' | 'social' | 'leadership';
  weight: number;
  options: {
    value: number;
    text: string;
  }[];
}

export const onetQuestions: OnetQuestion[] = [
  // Teknik Beceriler (Technical Skills)
  {
    id: 1,
    question: 'Yeni teknolojileri öğrenmek ve uygulamak konusunda ne kadar istekli hissediyorsunuz?',
    category: 'technical',
    weight: 1.2,
    options: [
      { value: 1, text: 'Hiç istekli değilim' },
      { value: 2, text: 'Az istekliyim' },
      { value: 3, text: 'Orta düzeyde istekliyim' },
      { value: 4, text: 'İstekliyim' },
      { value: 5, text: 'Çok istekliyim' }
    ]
  },
  {
    id: 2,
    question: 'Karmaşık problemleri analiz etme ve çözme konusunda kendinizi nasıl değerlendiriyorsunuz?',
    category: 'technical',
    weight: 1.3,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 3,
    question: 'Programlama dilleri öğrenme konusunda ne kadar hızlısınız?',
    category: 'technical',
    weight: 1.1,
    options: [
      { value: 1, text: 'Çok yavaşım' },
      { value: 2, text: 'Yavaşım' },
      { value: 3, text: 'Orta hızdayım' },
      { value: 4, text: 'Hızlıyım' },
      { value: 5, text: 'Çok hızlıyım' }
    ]
  },
  {
    id: 4,
    question: 'Sistem mimarisi ve tasarım konularında ne kadar bilgi sahibisiniz?',
    category: 'technical',
    weight: 1.0,
    options: [
      { value: 1, text: 'Hiç bilgim yok' },
      { value: 2, text: 'Az bilgim var' },
      { value: 3, text: 'Orta düzeyde bilgim var' },
      { value: 4, text: 'İyi bilgim var' },
      { value: 5, text: 'Çok iyi bilgim var' }
    ]
  },
  {
    id: 5,
    question: 'Veritabanı yönetimi ve SQL konularında ne kadar deneyimliyim?',
    category: 'technical',
    weight: 1.0,
    options: [
      { value: 1, text: 'Hiç deneyimim yok' },
      { value: 2, text: 'Az deneyimim var' },
      { value: 3, text: 'Orta düzeyde deneyimim var' },
      { value: 4, text: 'İyi deneyimim var' },
      { value: 5, text: 'Çok iyi deneyimim var' }
    ]
  },

  // Yumuşak Beceriler (Soft Skills)
  {
    id: 6,
    question: 'Takım halinde çalışırken diğer üyelerle ne kadar iyi iletişim kurabiliyorsunuz?',
    category: 'soft',
    weight: 1.0,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 7,
    question: 'Müşteri ihtiyaçlarını anlama ve çözüm sunma konusunda ne kadar başarılısınız?',
    category: 'soft',
    weight: 1.1,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  },
  {
    id: 8,
    question: 'Karmaşık teknik konuları basit bir dille açıklama konusunda ne kadar iyisiniz?',
    category: 'soft',
    weight: 1.0,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },

  // Çalışma Tarzı (Work Style)
  {
    id: 9,
    question: 'Projeleri zamanında tamamlama konusunda ne kadar başarılısınız?',
    category: 'work_style',
    weight: 1.1,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  },
  {
    id: 10,
    question: 'Detaylara dikkat etme ve hataları yakalama konusunda kendinizi nasıl değerlendiriyorsunuz?',
    category: 'work_style',
    weight: 1.2,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 11,
    question: 'Çoklu görev yapma ve birden fazla projeyi aynı anda yönetme konusunda ne kadar iyisiniz?',
    category: 'work_style',
    weight: 1.0,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },

  // Çalışma Ortamı (Work Context)
  {
    id: 12,
    question: 'Stresli durumlarda sakin kalma ve performansınızı koruma konusunda kendinizi nasıl değerlendiriyorsunuz?',
    category: 'work_context',
    weight: 0.9,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 13,
    question: 'Uzun saatler boyunca odaklanmış çalışma konusunda ne kadar dayanıklısınız?',
    category: 'work_context',
    weight: 0.8,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 14,
    question: 'Uzaktan çalışma ve bağımsız çalışma konusunda ne kadar rahatsınız?',
    category: 'work_context',
    weight: 0.9,
    options: [
      { value: 1, text: 'Hiç rahat değilim' },
      { value: 2, text: 'Az rahatım' },
      { value: 3, text: 'Orta düzeyde rahatım' },
      { value: 4, text: 'Rahatım' },
      { value: 5, text: 'Çok rahatım' }
    ]
  },

  // Analitik Beceriler (Analytical Skills)
  {
    id: 15,
    question: 'Veri analizi ve istatistiksel çıkarımlar yapma konusunda ne kadar iyisiniz?',
    category: 'analytical',
    weight: 1.1,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 16,
    question: 'Algoritma tasarımı ve optimizasyon konularında ne kadar deneyimliyim?',
    category: 'analytical',
    weight: 1.2,
    options: [
      { value: 1, text: 'Hiç deneyimim yok' },
      { value: 2, text: 'Az deneyimim var' },
      { value: 3, text: 'Orta düzeyde deneyimim var' },
      { value: 4, text: 'İyi deneyimim var' },
      { value: 5, text: 'Çok iyi deneyimim var' }
    ]
  },
  {
    id: 17,
    question: 'Matematiksel problemleri çözme konusunda ne kadar başarılısınız?',
    category: 'analytical',
    weight: 1.0,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  },

  // Yaratıcılık (Creativity)
  {
    id: 18,
    question: 'Yaratıcı çözümler üretme ve yenilikçi fikirler geliştirme konusunda ne kadar başarılısınız?',
    category: 'creative',
    weight: 1.1,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  },
  {
    id: 19,
    question: 'Kullanıcı arayüzü tasarımı ve kullanıcı deneyimi konularında ne kadar ilgilisiniz?',
    category: 'creative',
    weight: 1.0,
    options: [
      { value: 1, text: 'Hiç ilgili değilim' },
      { value: 2, text: 'Az ilgiliyim' },
      { value: 3, text: 'Orta düzeyde ilgiliyim' },
      { value: 4, text: 'İlgiliyim' },
      { value: 5, text: 'Çok ilgiliyim' }
    ]
  },
  {
    id: 20,
    question: 'Görsel tasarım ve estetik konularında ne kadar yetenekliyim?',
    category: 'creative',
    weight: 0.9,
    options: [
      { value: 1, text: 'Hiç yetenekli değilim' },
      { value: 2, text: 'Az yetenekliyim' },
      { value: 3, text: 'Orta düzeyde yetenekliyim' },
      { value: 4, text: 'Yetenekliyim' },
      { value: 5, text: 'Çok yetenekliyim' }
    ]
  },

  // Sosyal Beceriler (Social Skills)
  {
    id: 21,
    question: 'Eğitim verme ve başkalarına öğretme konusunda ne kadar iyisiniz?',
    category: 'social',
    weight: 0.9,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 22,
    question: 'Müzakere ve ikna etme konularında ne kadar başarılısınız?',
    category: 'social',
    weight: 0.8,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  },
  {
    id: 23,
    question: 'Çok kültürlü ortamlarda çalışma konusunda ne kadar rahatsınız?',
    category: 'social',
    weight: 0.8,
    options: [
      { value: 1, text: 'Hiç rahat değilim' },
      { value: 2, text: 'Az rahatım' },
      { value: 3, text: 'Orta düzeyde rahatım' },
      { value: 4, text: 'Rahatım' },
      { value: 5, text: 'Çok rahatım' }
    ]
  },

  // Liderlik (Leadership)
  {
    id: 24,
    question: 'Ekip liderliği yapma konusunda ne kadar deneyimliyim?',
    category: 'leadership',
    weight: 1.0,
    options: [
      { value: 1, text: 'Hiç deneyimim yok' },
      { value: 2, text: 'Az deneyimim var' },
      { value: 3, text: 'Orta düzeyde deneyimim var' },
      { value: 4, text: 'İyi deneyimim var' },
      { value: 5, text: 'Çok iyi deneyimim var' }
    ]
  },
  {
    id: 25,
    question: 'Stratejik kararlar alma ve uzun vadeli planlama konusunda ne kadar iyisiniz?',
    category: 'leadership',
    weight: 1.1,
    options: [
      { value: 1, text: 'Çok zayıfım' },
      { value: 2, text: 'Zayıfım' },
      { value: 3, text: 'Orta düzeydeyim' },
      { value: 4, text: 'İyiyim' },
      { value: 5, text: 'Çok iyiyim' }
    ]
  },
  {
    id: 26,
    question: 'Çatışma çözme ve problem yönetimi konusunda ne kadar başarılısınız?',
    category: 'leadership',
    weight: 0.9,
    options: [
      { value: 1, text: 'Hiç başarılı değilim' },
      { value: 2, text: 'Az başarılıyım' },
      { value: 3, text: 'Orta düzeyde başarılıyım' },
      { value: 4, text: 'Başarılıyım' },
      { value: 5, text: 'Çok başarılıyım' }
    ]
  }
];

export const calculateOnetScores = (answers: number[]) => {
  const scores = {
    technical: 0,
    soft: 0,
    work_style: 0,
    work_context: 0,
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0
  };

  const weights = {
    technical: 0,
    soft: 0,
    work_style: 0,
    work_context: 0,
    analytical: 0,
    creative: 0,
    social: 0,
    leadership: 0
  };

  onetQuestions.forEach((question, index) => {
    if (answers[index] !== undefined) {
      const category = question.category;
      scores[category] += answers[index] * question.weight;
      weights[category] += question.weight;
    }
  });

  // Normalize scores to 0-100 range
  const normalizedScores: any = {};
  Object.keys(scores).forEach(category => {
    const key = category as keyof typeof scores;
    normalizedScores[key] = weights[key] > 0 ? Math.round((scores[key] / weights[key]) * 20) : 0;
  });

  return normalizedScores;
};

export const getOnetRecommendations = (scores: any) => {
  const recommendations: string[] = [];

  if (scores.technical >= 80) {
    recommendations.push("Yüksek teknik becerileriniz AI/ML, Backend Development gibi teknik alanlarda başarılı olmanızı sağlar.");
  } else if (scores.technical < 60) {
    recommendations.push("Teknik becerilerinizi geliştirmek için daha fazla pratik yapmanız önerilir.");
  }

  if (scores.soft >= 80) {
    recommendations.push("Güçlü yumuşak becerileriniz Project Management, Team Leadership gibi alanlarda avantaj sağlar.");
  } else if (scores.soft < 60) {
    recommendations.push("İletişim ve takım çalışması becerilerinizi geliştirmeniz önerilir.");
  }

  if (scores.work_style >= 80) {
    recommendations.push("Mükemmeliyetçi çalışma tarzınız DevOps, Security gibi alanlarda çok değerli.");
  }

  if (scores.work_context >= 80) {
    recommendations.push("Adaptasyon becerileriniz hızlı değişen teknoloji ortamında büyük avantaj.");
  }

  if (scores.analytical >= 80) {
    recommendations.push("Güçlü analitik becerileriniz Data Science, Research alanlarında başarılı olmanızı sağlar.");
  }

  if (scores.creative >= 80) {
    recommendations.push("Yaratıcılığınız UI/UX Design, Game Development gibi alanlarda çok değerli.");
  }

  if (scores.social >= 80) {
    recommendations.push("Sosyal becerileriniz Customer Success, Training alanlarında avantaj sağlar.");
  }

  if (scores.leadership >= 80) {
    recommendations.push("Liderlik becerileriniz Technical Lead, Product Manager pozisyonlarında çok değerli.");
  }

  return recommendations;
}; 