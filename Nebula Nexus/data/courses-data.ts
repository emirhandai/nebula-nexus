// Eğitim Platformu Veritabanı
// BTK Akademi, Udemy, Coursera ve diğer platformlardan kurslar

export interface Course {
  id: string;
  title: string;
  description: string;
  platform: 'btk' | 'udemy' | 'coursera' | 'edx' | 'freecodecamp' | 'khan' | 'youtube' | 'local';
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai' | 'devops' | 'data' | 'security' | 'game' | 'embedded';
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string; // "2 saat", "6 hafta", "3 ay"
  language: 'turkish' | 'english' | 'mixed';
  price: number; // 0 = ücretsiz
  rating: number; // 1-5
  instructor: string;
  url: string;
  image?: string;
  tags: string[];
  skills: string[];
  certificate: boolean;
  completionRate: number; // 0-100
  lastUpdated: string;
  popularity: 'high' | 'medium' | 'low';
}

export const courses: Course[] = [
  // BTK AKADEMİ KURSLARI
  {
    id: 'btk-html-css',
    title: 'HTML5 ve CSS3 ile Web Tasarımı',
    description: 'Modern web standartları ile responsive tasarım öğrenin',
    platform: 'btk',
    category: 'frontend',
    level: 'beginner',
    duration: '40 saat',
    language: 'turkish',
    price: 0,
    rating: 4.5,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/html5-ve-css3-ile-web-tasarimi-10569',
    tags: ['HTML5', 'CSS3', 'Web Tasarım', 'Responsive'],
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Web Standards'],
    certificate: true,
    completionRate: 85,
    lastUpdated: '2024-01-15',
    popularity: 'high'
  },
  {
    id: 'btk-javascript',
    title: 'JavaScript Programlama Dili',
    description: 'Modern JavaScript ile dinamik web uygulamaları geliştirin',
    platform: 'btk',
    category: 'frontend',
    level: 'intermediate',
    duration: '60 saat',
    language: 'turkish',
    price: 0,
    rating: 4.3,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/javascript-programlama-dili-10570',
    tags: ['JavaScript', 'ES6+', 'DOM', 'AJAX'],
    skills: ['JavaScript', 'ES6+', 'DOM Manipulation', 'AJAX'],
    certificate: true,
    completionRate: 78,
    lastUpdated: '2024-02-01',
    popularity: 'high'
  },
  {
    id: 'btk-react',
    title: 'React.js ile Modern Web Uygulamaları',
    description: 'React kütüphanesi ile single page application geliştirme',
    platform: 'btk',
    category: 'frontend',
    level: 'intermediate',
    duration: '80 saat',
    language: 'turkish',
    price: 0,
    rating: 4.6,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/react-js-ile-modern-web-uygulamalari-10571',
    tags: ['React', 'JSX', 'Hooks', 'State Management'],
    skills: ['React', 'JSX', 'Hooks', 'State Management'],
    certificate: true,
    completionRate: 72,
    lastUpdated: '2024-01-20',
    popularity: 'high'
  },
  {
    id: 'btk-python',
    title: 'Python Programlama Dili',
    description: 'Python ile programlama temelleri ve uygulama geliştirme',
    platform: 'btk',
    category: 'backend',
    level: 'beginner',
    duration: '50 saat',
    language: 'turkish',
    price: 0,
    rating: 4.4,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/python-programlama-dili-10572',
    tags: ['Python', 'Programlama', 'Algoritma', 'Veri Yapıları'],
    skills: ['Python', 'Algorithms', 'Data Structures', 'OOP'],
    certificate: true,
    completionRate: 82,
    lastUpdated: '2024-01-10',
    popularity: 'high'
  },
  {
    id: 'btk-django',
    title: 'Django Web Framework',
    description: 'Python Django ile web uygulamaları geliştirme',
    platform: 'btk',
    category: 'backend',
    level: 'intermediate',
    duration: '70 saat',
    language: 'turkish',
    price: 0,
    rating: 4.2,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/django-web-framework-10573',
    tags: ['Django', 'Python', 'Web Framework', 'Database'],
    skills: ['Django', 'Python', 'ORM', 'Database Design'],
    certificate: true,
    completionRate: 68,
    lastUpdated: '2024-01-25',
    popularity: 'medium'
  },
  {
    id: 'btk-mobile',
    title: 'Mobil Uygulama Geliştirme',
    description: 'React Native ile cross-platform mobil uygulama geliştirme',
    platform: 'btk',
    category: 'mobile',
    level: 'intermediate',
    duration: '90 saat',
    language: 'turkish',
    price: 0,
    rating: 4.1,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/mobil-uygulama-gelistirme-10574',
    tags: ['React Native', 'Mobile', 'Cross-platform', 'App Development'],
    skills: ['React Native', 'Mobile Development', 'Cross-platform', 'App Store'],
    certificate: true,
    completionRate: 65,
    lastUpdated: '2024-02-05',
    popularity: 'medium'
  },
  {
    id: 'btk-ai',
    title: 'Yapay Zeka ve Makine Öğrenmesi',
    description: 'Python ile yapay zeka ve makine öğrenmesi uygulamaları',
    platform: 'btk',
    category: 'ai',
    level: 'advanced',
    duration: '120 saat',
    language: 'turkish',
    price: 0,
    rating: 4.7,
    instructor: 'BTK Akademi',
    url: 'https://www.btkakademi.gov.tr/portal/course/yapay-zeka-ve-makine-ogrenmesi-10575',
    tags: ['AI', 'Machine Learning', 'Python', 'TensorFlow'],
    skills: ['Machine Learning', 'Python', 'TensorFlow', 'Data Science'],
    certificate: true,
    completionRate: 58,
    lastUpdated: '2024-01-30',
    popularity: 'high'
  },

  // UDEMY KURSLARI
  {
    id: 'udemy-react-complete',
    title: 'React - The Complete Guide (incl Hooks, React Router, Redux)',
    description: 'Learn React from scratch with hands-on projects',
    platform: 'udemy',
    category: 'frontend',
    level: 'intermediate',
    duration: '48 saat',
    language: 'english',
    price: 29.99,
    rating: 4.6,
    instructor: 'Maximilian Schwarzmüller',
    url: 'https://www.udemy.com/course/react-the-complete-guide-incl-redux/',
    tags: ['React', 'Redux', 'Hooks', 'React Router'],
    skills: ['React', 'Redux', 'Hooks', 'React Router'],
    certificate: true,
    completionRate: 75,
    lastUpdated: '2024-01-15',
    popularity: 'high'
  },
  {
    id: 'udemy-nodejs',
    title: 'Node.js, Express, MongoDB & More: The Complete Bootcamp',
    description: 'Master Node.js by building a real-world RESTful API and web app',
    platform: 'udemy',
    category: 'backend',
    level: 'intermediate',
    duration: '42 saat',
    language: 'english',
    price: 34.99,
    rating: 4.7,
    instructor: 'Jonas Schmedtmann',
    url: 'https://www.udemy.com/course/nodejs-express-mongodb-bootcamp/',
    tags: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    skills: ['Node.js', 'Express', 'MongoDB', 'REST API'],
    certificate: true,
    completionRate: 70,
    lastUpdated: '2024-01-20',
    popularity: 'high'
  },
  {
    id: 'udemy-python-ai',
    title: 'Python for Data Science and Machine Learning Bootcamp',
    description: 'Learn how to use NumPy, Pandas, Seaborn, Scikit-learn, and more!',
    platform: 'udemy',
    category: 'ai',
    level: 'intermediate',
    duration: '44 saat',
    language: 'english',
    price: 39.99,
    rating: 4.5,
    instructor: 'Jose Portilla',
    url: 'https://www.udemy.com/course/python-for-data-science-and-machine-learning-bootcamp/',
    tags: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
    skills: ['Python', 'Data Science', 'Machine Learning', 'Pandas'],
    certificate: true,
    completionRate: 68,
    lastUpdated: '2024-01-10',
    popularity: 'high'
  },
  {
    id: 'udemy-flutter',
    title: 'Flutter & Dart - The Complete Guide',
    description: 'A complete guide to the Flutter SDK & Flutter Framework for building native iOS and Android apps',
    platform: 'udemy',
    category: 'mobile',
    level: 'intermediate',
    duration: '37 saat',
    language: 'english',
    price: 24.99,
    rating: 4.6,
    instructor: 'Maximilian Schwarzmüller',
    url: 'https://www.udemy.com/course/learn-flutter-dart-to-build-ios-android-apps/',
    tags: ['Flutter', 'Dart', 'Mobile', 'Cross-platform'],
    skills: ['Flutter', 'Dart', 'Mobile Development', 'Cross-platform'],
    certificate: true,
    completionRate: 72,
    lastUpdated: '2024-01-25',
    popularity: 'high'
  },

  // COURSERA KURSLARI
  {
    id: 'coursera-machine-learning',
    title: 'Machine Learning',
    description: 'Stanford University course on machine learning fundamentals',
    platform: 'coursera',
    category: 'ai',
    level: 'advanced',
    duration: '11 hafta',
    language: 'english',
    price: 49,
    rating: 4.8,
    instructor: 'Andrew Ng',
    url: 'https://www.coursera.org/learn/machine-learning',
    tags: ['Machine Learning', 'Stanford', 'Andrew Ng', 'Algorithms'],
    skills: ['Machine Learning', 'Algorithms', 'Mathematics', 'Statistics'],
    certificate: true,
    completionRate: 45,
    lastUpdated: '2024-01-01',
    popularity: 'high'
  },
  {
    id: 'coursera-web-development',
    title: 'Web Design for Everybody: Basics of Web Development & Coding',
    description: 'University of Michigan course on web development fundamentals',
    platform: 'coursera',
    category: 'frontend',
    level: 'beginner',
    duration: '6 ay',
    language: 'english',
    price: 39,
    rating: 4.4,
    instructor: 'University of Michigan',
    url: 'https://www.coursera.org/specializations/web-design',
    tags: ['HTML', 'CSS', 'JavaScript', 'Web Design'],
    skills: ['HTML', 'CSS', 'JavaScript', 'Web Design'],
    certificate: true,
    completionRate: 78,
    lastUpdated: '2024-01-15',
    popularity: 'medium'
  },

  // FREECODECAMP KURSLARI
  {
    id: 'fcc-responsive-web',
    title: 'Responsive Web Design',
    description: 'Learn the languages that developers use to build webpages',
    platform: 'freecodecamp',
    category: 'frontend',
    level: 'beginner',
    duration: '300 saat',
    language: 'english',
    price: 0,
    rating: 4.5,
    instructor: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/responsive-web-design/',
    tags: ['HTML', 'CSS', 'Responsive Design', 'Web Development'],
    skills: ['HTML', 'CSS', 'Responsive Design', 'Web Development'],
    certificate: true,
    completionRate: 82,
    lastUpdated: '2024-01-20',
    popularity: 'high'
  },
  {
    id: 'fcc-javascript',
    title: 'JavaScript Algorithms and Data Structures',
    description: 'Learn JavaScript fundamentals and algorithms',
    platform: 'freecodecamp',
    category: 'frontend',
    level: 'intermediate',
    duration: '300 saat',
    language: 'english',
    price: 0,
    rating: 4.6,
    instructor: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/',
    tags: ['JavaScript', 'Algorithms', 'Data Structures', 'ES6'],
    skills: ['JavaScript', 'Algorithms', 'Data Structures', 'ES6'],
    certificate: true,
    completionRate: 75,
    lastUpdated: '2024-01-25',
    popularity: 'high'
  },

  // YOUTUBE KURSLARI
  {
    id: 'youtube-react-turkish',
    title: 'React.js Türkçe Eğitim Serisi',
    description: 'Kapsamlı React.js eğitimi Türkçe',
    platform: 'youtube',
    category: 'frontend',
    level: 'beginner',
    duration: '15 saat',
    language: 'turkish',
    price: 0,
    rating: 4.3,
    instructor: 'Prototürk',
    url: 'https://www.youtube.com/playlist?list=PL-HkwCrDvq7J_5Jhqjqjqjqjqjqjqjqjqj',
    tags: ['React', 'JavaScript', 'Türkçe', 'Eğitim'],
    skills: ['React', 'JavaScript', 'Frontend Development'],
    certificate: false,
    completionRate: 60,
    lastUpdated: '2024-01-10',
    popularity: 'medium'
  },
  {
    id: 'youtube-python-turkish',
    title: 'Python Programlama Dili Eğitimi',
    description: 'Sıfırdan Python öğrenin',
    platform: 'youtube',
    category: 'backend',
    level: 'beginner',
    duration: '20 saat',
    language: 'turkish',
    price: 0,
    rating: 4.4,
    instructor: 'BTK Akademi',
    url: 'https://www.youtube.com/playlist?list=PL-HkwCrDvq7J_5Jhqjqjqjqjqjqjqjqjqjqj',
    tags: ['Python', 'Programlama', 'Türkçe', 'Eğitim'],
    skills: ['Python', 'Programming', 'Backend Development'],
    certificate: false,
    completionRate: 65,
    lastUpdated: '2024-01-15',
    popularity: 'medium'
  }
];

// Helper functions
export const getCoursesByField = (field: string) => {
  // Map user selected fields to course categories
  const fieldMapping: { [key: string]: string } = {
    'Frontend Development': 'frontend',
    'Backend Development': 'backend',
    'Full Stack Development': 'fullstack',
    'Mobile Development': 'mobile',
    'AI/ML Development': 'ai',
    'DevOps Engineering': 'devops',
    'Data Science': 'data',
    'Cybersecurity': 'security',
    'Game Development': 'game',
    'Embedded Systems': 'embedded',
    // Direct category matches
    'frontend': 'frontend',
    'backend': 'backend',
    'fullstack': 'fullstack',
    'mobile': 'mobile',
    'ai': 'ai',
    'devops': 'devops',
    'data': 'data',
    'security': 'security',
    'game': 'game',
    'embedded': 'embedded'
  };

  const category = fieldMapping[field] || field;
  return courses.filter(course => course.category === category);
};

export const getCoursesByLevel = (level: string) => {
  return courses.filter(course => course.level === level);
};

export const getCoursesByPlatform = (platform: string) => {
  return courses.filter(course => course.platform === platform);
};

export const getFreeCourses = () => {
  return courses.filter(course => course.price === 0);
};

export const getTopRatedCourses = (limit: number = 10) => {
  return courses
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getPopularCourses = (limit: number = 10) => {
  return courses
    .filter(course => course.popularity === 'high')
    .sort((a, b) => b.completionRate - a.completionRate)
    .slice(0, limit);
};

export const searchCourses = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return courses.filter(course => 
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
    course.skills.some(skill => skill.toLowerCase().includes(lowerQuery))
  );
};

export const getRecommendedCourses = (userField: string, userLevel: string = 'beginner') => {
  const fieldCourses = getCoursesByField(userField);
  
  // Prioritize by level, then by rating, then by completion rate
  return fieldCourses
    .sort((a, b) => {
      // Level priority
      const levelOrder = { beginner: 0, intermediate: 1, advanced: 2 };
      const aLevel = levelOrder[a.level as keyof typeof levelOrder];
      const bLevel = levelOrder[b.level as keyof typeof levelOrder];
      
      if (aLevel !== bLevel) {
        return aLevel - bLevel;
      }
      
      // Rating priority
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      
      // Completion rate priority
      return b.completionRate - a.completionRate;
    })
    .slice(0, 10);
};

export const getCourseById = (id: string) => {
  return courses.find(course => course.id === id);
};

export const getPlatformInfo = (platform: string) => {
  const platformInfo = {
    btk: {
      name: 'BTK Akademi',
      description: 'Türkiye Cumhuriyeti Bilgi Teknolojileri ve İletişim Kurumu',
      url: 'https://www.btkakademi.gov.tr',
      logo: '/platforms/btk-logo.png',
      features: ['Ücretsiz', 'Türkçe', 'Sertifika', 'Resmi']
    },
    udemy: {
      name: 'Udemy',
      description: 'Online öğrenme platformu',
      url: 'https://www.udemy.com',
      logo: '/platforms/udemy-logo.png',
      features: ['Ücretli', 'İngilizce', 'Sertifika', 'Geniş Katalog']
    },
    coursera: {
      name: 'Coursera',
      description: 'Üniversite düzeyinde online kurslar',
      url: 'https://www.coursera.org',
      logo: '/platforms/coursera-logo.png',
      features: ['Ücretli', 'İngilizce', 'Sertifika', 'Akademik']
    },
    freecodecamp: {
      name: 'freeCodeCamp',
      description: 'Ücretsiz kodlama eğitimi',
      url: 'https://www.freecodecamp.org',
      logo: '/platforms/fcc-logo.png',
      features: ['Ücretsiz', 'İngilizce', 'Sertifika', 'Pratik Odaklı']
    },
    youtube: {
      name: 'YouTube',
      description: 'Video tabanlı eğitim',
      url: 'https://www.youtube.com',
      logo: '/platforms/youtube-logo.png',
      features: ['Ücretsiz', 'Çok Dilli', 'Sertifika Yok', 'Geniş İçerik']
    }
  };
  
  return platformInfo[platform as keyof typeof platformInfo];
}; 