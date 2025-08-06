export interface Course {
  id: string;
  title: string;
  description: string;
  platform: string;
  category: string;
  level: string;
  duration: string;
  language: string;
  price: number;
  rating: number;
  instructor: string;
  url: string;
  tags: string[];
  skills: string[];
  certificate: boolean;
  completionRate: number;
  popularity: string;
  platformInfo?: {
    name: string;
    description: string;
    url: string;
    icon: React.ComponentType<{ className?: string }>;
  };
}

// BTK Akademi Kursları
export const btkCourses: Course[] = [
  // Frontend Development
  {
    id: 'btk-html-css',
    title: 'HTML ve CSS ile Web Tasarımı',
    description: 'Modern web tasarımının temellerini öğrenin. HTML5 ve CSS3 ile responsive web siteleri geliştirin.',
    platform: 'btk',
    category: 'frontend',
    level: 'beginner',
    duration: '40 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.8,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/html-ve-css-6290',
    tags: ['HTML', 'CSS', 'Web Tasarım', 'Responsive'],
    skills: ['HTML5', 'CSS3', 'Flexbox', 'Grid', 'Bootstrap'],
    certificate: true,
    completionRate: 78,
    popularity: 'high'
  },
  {
    id: 'btk-javascript',
    title: 'JavaScript ile Dinamik Web Sayfaları',
    description: 'JavaScript temelleri ve DOM manipülasyonu ile interaktif web sayfaları oluşturun.',
    platform: 'btk',
    category: 'frontend',
    level: 'intermediate',
    duration: '50 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.7,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/javascript-8099',
    tags: ['JavaScript', 'DOM', 'ES6', 'Web Development'],
    skills: ['JavaScript', 'DOM Manipulation', 'Event Handling', 'AJAX'],
    certificate: true,
    completionRate: 72,
    popularity: 'high'
  },
  {
    id: 'btk-react',
    title: 'React ile Modern Web Geliştirme',
    description: 'React kütüphanesi ile component-based modern web uygulamaları geliştirin.',
    platform: 'btk',
    category: 'frontend',
    level: 'advanced',
    duration: '60 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.9,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/react-ile-web-arayuz-gelistirme-8100',
    tags: ['React', 'JSX', 'Hooks', 'Redux'],
    skills: ['React', 'JSX', 'Hooks', 'State Management', 'Component Design'],
    certificate: true,
    completionRate: 68,
    popularity: 'high'
  },

  // Backend Development
  {
    id: 'btk-python',
    title: 'Python Programlama Dili',
    description: 'Python temellerinden ileri seviye konularına kadar kapsamlı Python eğitimi.',
    platform: 'btk',
    category: 'backend',
    level: 'beginner',
    duration: '45 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.8,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/python-programlama-dili-temel-seviye-8248',
    tags: ['Python', 'Programming', 'Backend', 'Scripting'],
    skills: ['Python Syntax', 'Data Structures', 'Functions', 'OOP'],
    certificate: true,
    completionRate: 75,
    popularity: 'high'
  },
  {
    id: 'btk-nodejs',
    title: 'Node.js ile Backend Geliştirme',
    description: 'JavaScript ile sunucu tarafı geliştirme. Express.js ve veritabanı entegrasyonu.',
    platform: 'btk',
    category: 'backend',
    level: 'intermediate',
    duration: '55 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.6,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/nodejs-ile-web-programlama-8674',
    tags: ['Node.js', 'Express', 'API', 'MongoDB'],
    skills: ['Node.js', 'Express.js', 'REST API', 'Database Integration'],
    certificate: true,
    completionRate: 70,
    popularity: 'high'
  },

  // Mobile Development
  {
    id: 'btk-flutter',
    title: 'Flutter ile Mobil Uygulama Geliştirme',
    description: 'Cross-platform mobil uygulamalar geliştirmek için Flutter framework\'ünü öğrenin.',
    platform: 'btk',
    category: 'mobile',
    level: 'intermediate',
    duration: '65 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.7,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/flutter-ile-mobil-uygulama-gelistirme-8950',
    tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform'],
    skills: ['Flutter', 'Dart', 'Widget Development', 'State Management'],
    certificate: true,
    completionRate: 65,
    popularity: 'medium'
  },

  // Data Science & AI
  {
    id: 'btk-data-science',
    title: 'Veri Bilimi ve Analitik',
    description: 'Python ile veri analizi, görselleştirme ve makine öğrenmesi temellerini öğrenin.',
    platform: 'btk',
    category: 'data',
    level: 'intermediate',
    duration: '70 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.8,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/veri-bilimi-ve-analitik-12400',
    tags: ['Data Science', 'Python', 'Analytics', 'Machine Learning'],
    skills: ['Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'Data Analysis'],
    certificate: true,
    completionRate: 62,
    popularity: 'high'
  },
  {
    id: 'btk-ai-basics',
    title: 'Yapay Zeka ve Makine Öğrenmesi Temelleri',
    description: 'AI kavramları, makine öğrenmesi algoritmaları ve pratik uygulamalar.',
    platform: 'btk',
    category: 'ai',
    level: 'intermediate',
    duration: '80 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.9,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/yapay-zeka-ve-makine-ogrenmesi-12500',
    tags: ['AI', 'Machine Learning', 'Deep Learning', 'Neural Networks'],
    skills: ['Machine Learning', 'Neural Networks', 'TensorFlow', 'Keras'],
    certificate: true,
    completionRate: 58,
    popularity: 'high'
  },

  // Cybersecurity
  {
    id: 'btk-cybersecurity',
    title: 'Siber Güvenlik Temelleri',
    description: 'Ağ güvenliği, güvenlik açıkları ve siber saldırılara karşı koruma yöntemleri.',
    platform: 'btk',
    category: 'security',
    level: 'intermediate',
    duration: '60 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.7,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/siber-guvenlik-temelleri-12600',
    tags: ['Cybersecurity', 'Network Security', 'Ethical Hacking', 'Security'],
    skills: ['Network Security', 'Penetration Testing', 'Risk Assessment', 'Security Tools'],
    certificate: true,
    completionRate: 67,
    popularity: 'medium'
  },

  // Database
  {
    id: 'btk-database',
    title: 'Veritabanı Yönetimi ve SQL',
    description: 'İlişkisel veritabanları, SQL sorguları ve veritabanı tasarımı prensiplerinini öğrenin.',
    platform: 'btk',
    category: 'database',
    level: 'beginner',
    duration: '40 saat',
    language: 'Turkish',
    price: 0,
    rating: 4.6,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/veritabani-yonetimi-ve-sql-11800',
    tags: ['SQL', 'Database', 'MySQL', 'PostgreSQL'],
    skills: ['SQL', 'Database Design', 'Query Optimization', 'Data Modeling'],
    certificate: true,
    completionRate: 74,
    popularity: 'high'
  }
];

// Diğer platform kursları (ikinci öncelik)
export const otherPlatformCourses: Course[] = [
  // Udemy Courses
  {
    id: 'udemy-react-complete',
    title: 'The Complete React Developer Course',
    description: 'React, Redux, Hooks ve modern JavaScript ile full-stack web development.',
    platform: 'udemy',
    category: 'frontend',
    level: 'intermediate',
    duration: '40 saat',
    language: 'English',
    price: 199,
    rating: 4.7,
    instructor: 'Andrew Mead',
    url: 'https://www.udemy.com/course/react-2nd-edition/',
    tags: ['React', 'Redux', 'JavaScript', 'Web Development'],
    skills: ['React', 'Redux', 'JavaScript ES6+', 'REST APIs'],
    certificate: true,
    completionRate: 82,
    popularity: 'high'
  },
  {
    id: 'udemy-python-complete',
    title: 'Complete Python Bootcamp',
    description: 'Sıfırdan ileri seviyeye Python programlama. Data Science ve web development dahil.',
    platform: 'udemy',
    category: 'backend',
    level: 'beginner',
    duration: '50 saat',
    language: 'English',
    price: 179,
    rating: 4.6,
    instructor: 'Jose Portilla',
    url: 'https://www.udemy.com/course/complete-python-bootcamp/',
    tags: ['Python', 'Data Science', 'Web Development', 'Programming'],
    skills: ['Python', 'Django', 'Flask', 'Data Analysis'],
    certificate: true,
    completionRate: 75,
    popularity: 'high'
  },

  // Coursera Courses
  {
    id: 'coursera-ml-andrew',
    title: 'Machine Learning Specialization',
    description: 'Stanford University\'den makine öğrenmesi temelleri ve uygulamaları.',
    platform: 'coursera',
    category: 'ai',
    level: 'intermediate',
    duration: '80 saat',
    language: 'English',
    price: 49,
    rating: 4.9,
    instructor: 'Andrew Ng',
    url: 'https://www.coursera.org/specializations/machine-learning-introduction',
    tags: ['Machine Learning', 'AI', 'Stanford', 'Deep Learning'],
    skills: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'Python'],
    certificate: true,
    completionRate: 68,
    popularity: 'high'
  }
];

// Alan bazında kurs filtreleme
export const getBTKCoursesByField = (selectedField: string): Course[] => {
  const fieldMappings: { [key: string]: string[] } = {
    'Frontend Development': ['frontend'],
    'Backend Development': ['backend'],
    'Full Stack Development': ['frontend', 'backend'],
    'Mobile Development': ['mobile'],
    'AI & Machine Learning': ['ai', 'data'],
    'Data Science': ['data'],
    'Cybersecurity': ['security'],
    'Database Management': ['database']
  };

  const categories = fieldMappings[selectedField] || ['frontend', 'backend'];
  
  return btkCourses.filter(course => 
    categories.includes(course.category)
  );
};

// Tüm kursları getir (BTK öncelikli)
export const getAllCourses = (): Course[] => {
  return [...btkCourses, ...otherPlatformCourses.slice(0, 5)]; // İlk 5 ücretli kurs
};

// Platform ikonları
export const getPlatformIcon = (platform: string) => {
  const iconMap: { [key: string]: string } = {
    'btk': '🏛️',
    'udemy': '🎓',
    'coursera': '🏫',
    'edx': '📚',
    'freecodecamp': '💻'
  };
  
  return iconMap[platform] || '📖';
};

// Platform bilgileri
export const getPlatformInfo = (platform: string) => {
  const platformInfo: { [key: string]: { name: string; description: string; url: string } } = {
    'btk': {
      name: 'BTK Akademi',
      description: 'Türkiye\'nin resmi teknoloji eğitim platformu',
      url: 'https://www.btkakademi.gov.tr'
    },
    'udemy': {
      name: 'Udemy',
      description: 'Global online öğrenme platformu',
      url: 'https://www.udemy.com'
    },
    'coursera': {
      name: 'Coursera',
      description: 'Üniversite kalitesinde online kurslar',
      url: 'https://www.coursera.org'
    }
  };
  
  return platformInfo[platform] || {
    name: platform,
    description: 'Online eğitim platformu',
    url: '#'
  };
};