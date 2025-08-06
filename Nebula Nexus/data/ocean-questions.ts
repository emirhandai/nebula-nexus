import { OceanQuestion } from '@/lib/ocean-calculator';

export const oceanQuestions: OceanQuestion[] = [
  // Açıklık (Openness) Soruları
  {
    id: 'o1',
    text: 'Yeni deneyimler yaşamayı severim',
    category: 'openness',
    reverse: false
  },
  {
    id: 'o2',
    text: 'Soyut fikirler hakkında düşünmeyi severim',
    category: 'openness',
    reverse: false
  },
  {
    id: 'o3',
    text: 'Sanat ve estetik konularına ilgi duyarım',
    category: 'openness',
    reverse: false
  },
  {
    id: 'o4',
    text: 'Geleneksel yöntemleri tercih ederim',
    category: 'openness',
    reverse: true
  },
  {
    id: 'o5',
    text: 'Hayal kurmayı severim',
    category: 'openness',
    reverse: false
  },

  // Sorumluluk (Conscientiousness) Soruları
  {
    id: 'c1',
    text: 'İşlerimi düzenli ve planlı yaparım',
    category: 'conscientiousness',
    reverse: false
  },
  {
    id: 'c2',
    text: 'Detaylara dikkat ederim',
    category: 'conscientiousness',
    reverse: false
  },
  {
    id: 'c3',
    text: 'Sözümü tutarım',
    category: 'conscientiousness',
    reverse: false
  },
  {
    id: 'c4',
    text: 'Bazen işlerimi erteleyebilirim',
    category: 'conscientiousness',
    reverse: true
  },
  {
    id: 'c5',
    text: 'Hedeflerime ulaşmak için çok çalışırım',
    category: 'conscientiousness',
    reverse: false
  },

  // Dışadönüklük (Extraversion) Soruları
  {
    id: 'e1',
    text: 'İnsanlarla birlikte olmayı severim',
    category: 'extraversion',
    reverse: false
  },
  {
    id: 'e2',
    text: 'Sosyal ortamlarda enerjik hissederim',
    category: 'extraversion',
    reverse: false
  },
  {
    id: 'e3',
    text: 'Sessiz ve çekingen biriyim',
    category: 'extraversion',
    reverse: true
  },
  {
    id: 'e4',
    text: 'Liderlik rolünü üstlenmeyi severim',
    category: 'extraversion',
    reverse: false
  },
  {
    id: 'e5',
    text: 'Kalabalık ortamlarda rahat hissederim',
    category: 'extraversion',
    reverse: false
  },

  // Uyumluluk (Agreeableness) Soruları
  {
    id: 'a1',
    text: 'Başkalarının duygularına önem veririm',
    category: 'agreeableness',
    reverse: false
  },
  {
    id: 'a2',
    text: 'İnsanlara güvenirim',
    category: 'agreeableness',
    reverse: false
  },
  {
    id: 'a3',
    text: 'Çatışmalardan kaçınırım',
    category: 'agreeableness',
    reverse: false
  },
  {
    id: 'a4',
    text: 'Bazen başkalarını eleştiririm',
    category: 'agreeableness',
    reverse: true
  },
  {
    id: 'a5',
    text: 'Yardımsever biriyim',
    category: 'agreeableness',
    reverse: false
  },

  // Duygusal Denge (Neuroticism) Soruları
  {
    id: 'n1',
    text: 'Endişeli biriyim',
    category: 'neuroticism',
    reverse: false
  },
  {
    id: 'n2',
    text: 'Stresli durumlarda sakin kalırım',
    category: 'neuroticism',
    reverse: true
  },
  {
    id: 'n3',
    text: 'Mükemmeliyetçiyim',
    category: 'neuroticism',
    reverse: false
  },
  {
    id: 'n4',
    text: 'Kendime güvenim yüksek',
    category: 'neuroticism',
    reverse: true
  },
  {
    id: 'n5',
    text: 'Duygusal dalgalanmalar yaşarım',
    category: 'neuroticism',
    reverse: false
  }
];

export const softwareFields = [
  {
    name: 'Yapay Zeka ve Makine Öğrenmesi',
    description: 'Algoritmalar, veri analizi ve akıllı sistemler geliştirme',
    category: 'AI/ML',
    requiredSkills: ['Python', 'Matematik', 'İstatistik', 'Algoritma'],
    personalityTraits: ['Açıklık', 'Sorumluluk', 'Analitik Düşünme'],
    averageSalary: 85000,
    jobGrowth: 15,
    demandLevel: 'high' as const
  },
  {
    name: 'Web Geliştirme',
    description: 'Web siteleri ve web uygulamaları geliştirme',
    category: 'Development',
    requiredSkills: ['HTML/CSS', 'JavaScript', 'React/Vue', 'Node.js'],
    personalityTraits: ['Dışadönüklük', 'Uyumluluk', 'Yaratıcılık'],
    averageSalary: 70000,
    jobGrowth: 12,
    demandLevel: 'high' as const
  },
  {
    name: 'Mobil Uygulama Geliştirme',
    description: 'iOS ve Android uygulamaları geliştirme',
    category: 'Development',
    requiredSkills: ['Swift/Kotlin', 'React Native', 'UI/UX', 'Mobile Design'],
    personalityTraits: ['Dışadönüklük', 'Yaratıcılık', 'Kullanıcı Odaklılık'],
    averageSalary: 75000,
    jobGrowth: 10,
    demandLevel: 'high' as const
  },
  {
    name: 'Siber Güvenlik',
    description: 'Bilgi güvenliği ve siber tehditlere karşı koruma',
    category: 'Security',
    requiredSkills: ['Network Security', 'Penetration Testing', 'Linux', 'Cryptography'],
    personalityTraits: ['Sorumluluk', 'Detay Odaklılık', 'Analitik Düşünme'],
    averageSalary: 90000,
    jobGrowth: 18,
    demandLevel: 'high' as const
  },
  {
    name: 'Veri Bilimi',
    description: 'Büyük veri analizi ve veri odaklı karar verme',
    category: 'Data',
    requiredSkills: ['Python', 'R', 'SQL', 'Statistics', 'Machine Learning'],
    personalityTraits: ['Açıklık', 'Sorumluluk', 'Analitik Düşünme'],
    averageSalary: 80000,
    jobGrowth: 14,
    demandLevel: 'high' as const
  },
  {
    name: 'Oyun Geliştirme',
    description: 'Video oyunları ve interaktif deneyimler geliştirme',
    category: 'Gaming',
    requiredSkills: ['C++/C#', 'Unity/Unreal', 'Game Design', '3D Modeling'],
    personalityTraits: ['Yaratıcılık', 'Dışadönüklük', 'Hayal Gücü'],
    averageSalary: 65000,
    jobGrowth: 8,
    demandLevel: 'medium' as const
  },
  {
    name: 'DevOps ve Sistem Yönetimi',
    description: 'Yazılım geliştirme ve operasyon süreçlerini otomatize etme',
    category: 'Operations',
    requiredSkills: ['Linux', 'Docker', 'Kubernetes', 'CI/CD', 'Cloud Platforms'],
    personalityTraits: ['Sorumluluk', 'Sistem Düşüncesi', 'Problem Çözme'],
    averageSalary: 85000,
    jobGrowth: 12,
    demandLevel: 'high' as const
  },
  {
    name: 'Blockchain ve Kripto',
    description: 'Dağıtık defter teknolojileri ve kripto para uygulamaları',
    category: 'Emerging',
    requiredSkills: ['Solidity', 'JavaScript', 'Cryptography', 'Smart Contracts'],
    personalityTraits: ['Açıklık', 'İnovasyon', 'Risk Alma'],
    averageSalary: 95000,
    jobGrowth: 20,
    demandLevel: 'medium' as const
  },
  {
    name: 'IoT ve Gömülü Sistemler',
    description: 'Akıllı cihazlar ve gömülü sistemler geliştirme',
    category: 'Hardware',
    requiredSkills: ['C/C++', 'Python', 'Electronics', 'Microcontrollers'],
    personalityTraits: ['Sorumluluk', 'Detay Odaklılık', 'Teknik Merak'],
    averageSalary: 75000,
    jobGrowth: 10,
    demandLevel: 'medium' as const
  },
  {
    name: 'UI/UX Tasarımı',
    description: 'Kullanıcı arayüzü ve kullanıcı deneyimi tasarımı',
    category: 'Design',
    requiredSkills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping'],
    personalityTraits: ['Yaratıcılık', 'Empati', 'Kullanıcı Odaklılık'],
    averageSalary: 70000,
    jobGrowth: 11,
    demandLevel: 'high' as const
  }
]; 
