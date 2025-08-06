export interface SoftwareField {
  id: string;
  name: string;
  title: string;
  description: string;
  category: 'frontend' | 'backend' | 'fullstack' | 'mobile' | 'ai' | 'devops' | 'data' | 'security' | 'game' | 'embedded';
  demand: 'high' | 'medium' | 'low';
  salary: {
    entry: number;
    mid: number;
    senior: number;
  };
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  requirements: {
    education: string[];
    experience: string[];
    certifications: string[];
  };
  personalityTraits: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  careerPath: {
    entry: string;
    mid: string;
    senior: string;
    lead: string;
  };
  companies: string[];
  courses: {
    beginner: string[];
    intermediate: string[];
    advanced: string[];
  };
}

export const softwareFields: SoftwareField[] = [
  {
    id: 'frontend',
    name: 'Frontend Development',
    title: 'Frontend Developer',
    description: 'Kullanıcı arayüzü geliştirme ve web teknolojileri',
    category: 'frontend',
    demand: 'high',
    salary: {
      entry: 35000,
      mid: 60000,
      senior: 95000
    },
    skills: {
      technical: ['HTML', 'CSS', 'JavaScript', 'React', 'Vue.js', 'Angular', 'TypeScript', 'Responsive Design'],
      soft: ['Kullanıcı Deneyimi', 'Yaratıcılık', 'Problem Çözme', 'Takım Çalışması', 'İletişim'],
      tools: ['VS Code', 'Chrome DevTools', 'Figma', 'Git', 'Webpack', 'Vite']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'Web Tasarımı', 'Bilgisayar Bilimleri'],
      experience: ['Web Development', 'UI/UX Design', 'JavaScript Frameworks', 'Responsive Design'],
      certifications: ['Google Web Developer', 'Microsoft Frontend Developer', 'AWS Frontend']
    },
    personalityTraits: {
      openness: 70,
      conscientiousness: 65,
      extraversion: 60,
      agreeableness: 70,
      neuroticism: 40
    },
    careerPath: {
      entry: 'Junior Frontend Developer',
      mid: 'Frontend Developer',
      senior: 'Senior Frontend Developer',
      lead: 'Frontend Team Lead'
    },
    companies: ['Google', 'Facebook', 'Netflix', 'Airbnb', 'Spotify', 'Uber', 'Microsoft'],
    courses: {
      beginner: ['HTML & CSS Fundamentals', 'JavaScript Basics', 'React Introduction', 'Web Design Principles'],
      intermediate: ['Advanced React', 'State Management', 'Performance Optimization', 'Testing'],
      advanced: ['Architecture Patterns', 'Micro Frontends', 'Advanced CSS', 'Web Performance']
    }
  },
  {
    id: 'backend',
    name: 'Backend Development',
    title: 'Backend Developer',
    description: 'Sunucu tarafı uygulama geliştirme ve veritabanı yönetimi',
    category: 'backend',
    demand: 'high',
    salary: {
      entry: 40000,
      mid: 70000,
      senior: 110000
    },
    skills: {
      technical: ['Node.js', 'Python', 'Java', 'C#', 'SQL', 'NoSQL', 'REST APIs', 'Microservices'],
      soft: ['Sistem Tasarımı', 'Problem Çözme', 'Analitik Düşünme', 'Dokümantasyon', 'Güvenlik'],
      tools: ['Docker', 'Kubernetes', 'PostgreSQL', 'MongoDB', 'Redis', 'AWS', 'Azure']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'Bilgisayar Bilimleri', 'Sistem Mühendisliği'],
      experience: ['Server Development', 'Database Design', 'API Development', 'System Architecture'],
      certifications: ['AWS Developer', 'Microsoft Azure Developer', 'Oracle Certified Professional']
    },
    personalityTraits: {
      openness: 65,
      conscientiousness: 80,
      extraversion: 45,
      agreeableness: 60,
      neuroticism: 35
    },
    careerPath: {
      entry: 'Junior Backend Developer',
      mid: 'Backend Developer',
      senior: 'Senior Backend Developer',
      lead: 'Backend Team Lead'
    },
    companies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Uber', 'Airbnb', 'Spotify'],
    courses: {
      beginner: ['Programming Fundamentals', 'Database Basics', 'API Development', 'Server Architecture'],
      intermediate: ['Advanced Backend', 'Microservices', 'Cloud Services', 'Security'],
      advanced: ['System Design', 'Scalability', 'Performance Optimization', 'DevOps Integration']
    }
  },
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    title: 'Full Stack Developer',
    description: 'Hem frontend hem backend geliştirme yetenekleri',
    category: 'fullstack',
    demand: 'high',
    salary: {
      entry: 45000,
      mid: 75000,
      senior: 120000
    },
    skills: {
      technical: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'MongoDB', 'Docker', 'AWS'],
      soft: ['Proje Yönetimi', 'Problem Çözme', 'İletişim', 'Öğrenme Hızı', 'Adaptasyon'],
      tools: ['VS Code', 'Git', 'Docker', 'Postman', 'Chrome DevTools', 'Terminal']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'Bilgisayar Bilimleri'],
      experience: ['Web Development', 'Full Stack Projects', 'Database Management', 'Deployment'],
      certifications: ['MERN Stack', 'MEAN Stack', 'Full Stack Web Development', 'AWS Solutions Architect']
    },
    personalityTraits: {
      openness: 75,
      conscientiousness: 70,
      extraversion: 55,
      agreeableness: 65,
      neuroticism: 40
    },
    careerPath: {
      entry: 'Junior Full Stack Developer',
      mid: 'Full Stack Developer',
      senior: 'Senior Full Stack Developer',
      lead: 'Full Stack Team Lead'
    },
    companies: ['Netflix', 'Airbnb', 'Uber', 'Spotify', 'Slack', 'Discord', 'GitHub'],
    courses: {
      beginner: ['Web Development Bootcamp', 'MERN Stack', 'Full Stack Fundamentals', 'Database Design'],
      intermediate: ['Advanced Full Stack', 'Cloud Deployment', 'Testing Strategies', 'Performance'],
      advanced: ['System Architecture', 'Scalable Applications', 'Advanced Patterns', 'Team Leadership']
    }
  },
  {
    id: 'mobile',
    name: 'Mobile Development',
    title: 'Mobile Developer',
    description: 'iOS ve Android uygulama geliştirme',
    category: 'mobile',
    demand: 'high',
    salary: {
      entry: 40000,
      mid: 70000,
      senior: 110000
    },
    skills: {
      technical: ['Swift', 'Kotlin', 'React Native', 'Flutter', 'Java', 'Objective-C', 'Mobile UI/UX'],
      soft: ['Kullanıcı Deneyimi', 'Yaratıcılık', 'Problem Çözme', 'Platform Bilgisi', 'Test Odaklılık'],
      tools: ['Xcode', 'Android Studio', 'Figma', 'Firebase', 'TestFlight', 'Google Play Console']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Yazılım Mühendisliği', 'Mobil Uygulama Geliştirme'],
      experience: ['Mobile Development', 'App Store Publishing', 'Cross-platform Development', 'UI/UX Design'],
      certifications: ['Apple Developer', 'Google Developer', 'React Native', 'Flutter']
    },
    personalityTraits: {
      openness: 70,
      conscientiousness: 65,
      extraversion: 60,
      agreeableness: 65,
      neuroticism: 45
    },
    careerPath: {
      entry: 'Junior Mobile Developer',
      mid: 'Mobile Developer',
      senior: 'Senior Mobile Developer',
      lead: 'Mobile Team Lead'
    },
    companies: ['Apple', 'Google', 'Facebook', 'Uber', 'Airbnb', 'Netflix', 'Spotify'],
    courses: {
      beginner: ['iOS Development', 'Android Development', 'React Native', 'Mobile UI Design'],
      intermediate: ['Advanced Mobile', 'Cross-platform', 'App Performance', 'Testing'],
      advanced: ['Mobile Architecture', 'Native Development', 'App Store Optimization', 'Team Leadership']
    }
  },
  {
    id: 'ai-ml',
    name: 'AI & Machine Learning',
    title: 'AI/ML Engineer',
    description: 'Yapay zeka ve makine öğrenmesi uygulamaları geliştirme',
    category: 'ai',
    demand: 'high',
    salary: {
      entry: 50000,
      mid: 85000,
      senior: 130000
    },
    skills: {
      technical: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'Deep Learning', 'NLP', 'Computer Vision'],
      soft: ['Analitik Düşünme', 'Araştırma', 'Problem Çözme', 'Matematik', 'Sürekli Öğrenme'],
      tools: ['Jupyter Notebook', 'Google Colab', 'AWS SageMaker', 'MLflow', 'Weights & Biases']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Matematik', 'İstatistik', 'Veri Bilimi', 'AI/ML'],
      experience: ['Machine Learning', 'Data Analysis', 'Model Development', 'Research'],
      certifications: ['Google TensorFlow', 'AWS Machine Learning', 'Microsoft AI Engineer', 'Deep Learning Specialization']
    },
    personalityTraits: {
      openness: 85,
      conscientiousness: 75,
      extraversion: 40,
      agreeableness: 55,
      neuroticism: 35
    },
    careerPath: {
      entry: 'Junior ML Engineer',
      mid: 'ML Engineer',
      senior: 'Senior ML Engineer',
      lead: 'AI/ML Team Lead'
    },
    companies: ['Google', 'OpenAI', 'Microsoft', 'Amazon', 'Meta', 'Tesla', 'NVIDIA'],
    courses: {
      beginner: ['Python for Data Science', 'Machine Learning Basics', 'Statistics', 'Linear Algebra'],
      intermediate: ['Deep Learning', 'NLP', 'Computer Vision', 'MLOps'],
      advanced: ['Advanced AI', 'Research Methods', 'Model Deployment', 'AI Ethics']
    }
  },
  {
    id: 'devops',
    name: 'DevOps Engineering',
    title: 'DevOps Engineer',
    description: 'Yazılım geliştirme ve operasyon süreçlerini otomatikleştirme',
    category: 'devops',
    demand: 'high',
    salary: {
      entry: 45000,
      mid: 75000,
      senior: 115000
    },
    skills: {
      technical: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'Linux', 'Scripting', 'Monitoring'],
      soft: ['Sistem Yönetimi', 'Problem Çözme', 'Otomasyon', 'Güvenlik', 'İşbirliği'],
      tools: ['Jenkins', 'GitLab CI', 'Prometheus', 'Grafana', 'Terraform', 'Ansible']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Sistem Mühendisliği', 'Network Engineering', 'IT'],
      experience: ['System Administration', 'Cloud Services', 'Automation', 'Infrastructure'],
      certifications: ['AWS DevOps', 'Azure DevOps', 'Kubernetes', 'Docker', 'Terraform']
    },
    personalityTraits: {
      openness: 65,
      conscientiousness: 85,
      extraversion: 45,
      agreeableness: 60,
      neuroticism: 30
    },
    careerPath: {
      entry: 'Junior DevOps Engineer',
      mid: 'DevOps Engineer',
      senior: 'Senior DevOps Engineer',
      lead: 'DevOps Team Lead'
    },
    companies: ['Amazon', 'Microsoft', 'Google', 'Netflix', 'Uber', 'Airbnb', 'Spotify'],
    courses: {
      beginner: ['Linux Administration', 'Docker Basics', 'Cloud Fundamentals', 'CI/CD Introduction'],
      intermediate: ['Kubernetes', 'Infrastructure as Code', 'Monitoring', 'Security'],
      advanced: ['Advanced DevOps', 'Site Reliability Engineering', 'Cloud Architecture', 'Team Leadership']
    }
  },
  {
    id: 'data-engineer',
    name: 'Data Engineering',
    title: 'Data Engineer',
    description: 'Büyük veri işleme ve veri pipeline\'ları oluşturma',
    category: 'data',
    demand: 'high',
    salary: {
      entry: 45000,
      mid: 75000,
      senior: 110000
    },
    skills: {
      technical: ['Python', 'SQL', 'Apache Spark', 'Hadoop', 'Kafka', 'Airflow', 'Data Warehousing', 'ETL'],
      soft: ['Veri Analizi', 'Sistem Tasarımı', 'Problem Çözme', 'İş Süreçleri Anlayışı', 'Dokümantasyon'],
      tools: ['Apache Kafka', 'Apache Airflow', 'Snowflake', 'BigQuery', 'Databricks', 'Tableau']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'İstatistik', 'Veri Bilimi', 'İşletme'],
      experience: ['ETL Development', 'Data Pipeline Design', 'Big Data Processing', 'Business Intelligence'],
      certifications: ['AWS Data Analytics', 'Google Data Engineer', 'Databricks Certified Associate']
    },
    personalityTraits: {
      openness: 75,
      conscientiousness: 80,
      extraversion: 45,
      agreeableness: 60,
      neuroticism: 30
    },
    careerPath: {
      entry: 'Junior Data Engineer',
      mid: 'Data Engineer',
      senior: 'Senior Data Engineer',
      lead: 'Data Engineering Lead'
    },
    companies: ['Google', 'Amazon', 'Microsoft', 'Netflix', 'Uber', 'Airbnb', 'Spotify'],
    courses: {
      beginner: ['SQL Fundamentals', 'Python for Data', 'Data Warehousing', 'ETL Basics'],
      intermediate: ['Big Data Processing', 'Apache Spark', 'Data Pipeline Design', 'Cloud Data Services'],
      advanced: ['Data Architecture', 'Real-time Processing', 'Data Governance', 'ML Pipeline Integration']
    }
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    title: 'Security Engineer',
    description: 'Bilgi güvenliği ve siber güvenlik uzmanlığı',
    category: 'security',
    demand: 'high',
    salary: {
      entry: 50000,
      mid: 80000,
      senior: 115000
    },
    skills: {
      technical: ['Network Security', 'Penetration Testing', 'Cryptography', 'Security Tools', 'Incident Response', 'Compliance'],
      soft: ['Analitik Düşünme', 'Detay Odaklılık', 'Problem Çözme', 'Güvenlik Farkındalığı', 'Sürekli Öğrenme'],
      tools: ['Wireshark', 'Metasploit', 'Nmap', 'Burp Suite', 'Snort', 'Splunk', 'ELK Stack']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Network Engineering', 'Cybersecurity', 'Information Systems'],
      experience: ['Security Analysis', 'Penetration Testing', 'Incident Response', 'Security Architecture'],
      certifications: ['CISSP', 'CEH', 'CompTIA Security+', 'OSCP', 'SANS GIAC']
    },
    personalityTraits: {
      openness: 65,
      conscientiousness: 90,
      extraversion: 40,
      agreeableness: 55,
      neuroticism: 30
    },
    careerPath: {
      entry: 'Security Analyst',
      mid: 'Security Engineer',
      senior: 'Senior Security Engineer',
      lead: 'Security Team Lead'
    },
    companies: ['CrowdStrike', 'Palo Alto Networks', 'FireEye', 'Rapid7', 'Splunk', 'Microsoft', 'Google'],
    courses: {
      beginner: ['Network Security', 'Security Fundamentals', 'Ethical Hacking', 'Cryptography'],
      intermediate: ['Penetration Testing', 'Incident Response', 'Security Architecture', 'Compliance'],
      advanced: ['Advanced Threat Hunting', 'Security Research', 'Red Team Operations', 'Security Leadership']
    }
  },
  {
    id: 'game-dev',
    name: 'Game Development',
    title: 'Game Developer',
    description: 'Video oyun geliştirme ve interaktif deneyim tasarımı',
    category: 'game',
    demand: 'medium',
    salary: {
      entry: 35000,
      mid: 60000,
      senior: 90000
    },
    skills: {
      technical: ['Unity', 'Unreal Engine', 'C#', 'C++', 'Game Physics', '3D Graphics', 'Game AI', 'Audio Programming'],
      soft: ['Yaratıcılık', 'Oyun Tasarımı', 'Problem Çözme', 'Takım Çalışması', 'Kullanıcı Deneyimi'],
      tools: ['Unity', 'Unreal Engine', 'Blender', 'Maya', 'Visual Studio', 'Git', 'Perforce']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Game Development', 'Computer Graphics', 'Digital Arts'],
      experience: ['Game Development', '3D Modeling', 'Game Design', 'Programming'],
      certifications: ['Unity Certified Developer', 'Unreal Engine', 'Game Development']
    },
    personalityTraits: {
      openness: 80,
      conscientiousness: 60,
      extraversion: 65,
      agreeableness: 70,
      neuroticism: 45
    },
    careerPath: {
      entry: 'Junior Game Developer',
      mid: 'Game Developer',
      senior: 'Senior Game Developer',
      lead: 'Game Development Lead'
    },
    companies: ['Epic Games', 'Unity Technologies', 'Electronic Arts', 'Ubisoft', 'Activision', 'Nintendo', 'Sony'],
    courses: {
      beginner: ['Game Development Fundamentals', 'Unity Basics', 'C# Programming', 'Game Design'],
      intermediate: ['Advanced Unity', '3D Graphics', 'Game Physics', 'Audio Programming'],
      advanced: ['Game Architecture', 'Performance Optimization', 'Multiplayer Development', 'Game AI']
    }
  },
  {
    id: 'embedded',
    name: 'Embedded Systems',
    title: 'Embedded Systems Engineer',
    description: 'Donanım ve yazılım entegrasyonu ile gömülü sistemler',
    category: 'embedded',
    demand: 'medium',
    salary: {
      entry: 40000,
      mid: 65000,
      senior: 95000
    },
    skills: {
      technical: ['C/C++', 'Assembly', 'Microcontrollers', 'RTOS', 'Digital Electronics', 'Signal Processing'],
      soft: ['Donanım Bilgisi', 'Problem Çözme', 'Detay Odaklılık', 'Sistem Anlayışı', 'Test Odaklılık'],
      tools: ['Arduino', 'Raspberry Pi', 'STM32', 'Eclipse', 'IAR', 'Oscilloscope', 'Logic Analyzer']
    },
    requirements: {
      education: ['Bilgisayar Mühendisliği', 'Elektronik Mühendisliği', 'Embedded Systems', 'Control Engineering'],
      experience: ['Microcontroller Programming', 'Hardware Design', 'Real-time Systems', 'Testing'],
      certifications: ['ARM Certified', 'Embedded Systems', 'IoT Development', 'Real-time Programming']
    },
    personalityTraits: {
      openness: 60,
      conscientiousness: 85,
      extraversion: 35,
      agreeableness: 55,
      neuroticism: 35
    },
    careerPath: {
      entry: 'Junior Embedded Engineer',
      mid: 'Embedded Systems Engineer',
      senior: 'Senior Embedded Engineer',
      lead: 'Embedded Systems Lead'
    },
    companies: ['Intel', 'ARM', 'Texas Instruments', 'STMicroelectronics', 'NXP', 'Samsung', 'Apple'],
    courses: {
      beginner: ['C Programming', 'Digital Electronics', 'Microcontrollers', 'Embedded Systems'],
      intermediate: ['RTOS', 'Real-time Programming', 'Hardware Design', 'Signal Processing'],
      advanced: ['Advanced Embedded', 'System Architecture', 'IoT Development', 'Team Leadership']
    }
  }
];

// Analysis functions
export const analyzePersonalityForField = (oceanScores: any, field: SoftwareField) => {
  const userTraits = oceanScores;
  const fieldTraits = field.personalityTraits;
  
  // Calculate compatibility score (0-100)
  let compatibilityScore = 0;
  let totalWeight = 0;

  // Weight each trait based on field requirements
  const traitWeights = {
    openness: 1.2,      // Important for creative fields
    conscientiousness: 1.0, // Standard weight
    extraversion: 0.8,  // Less important for technical fields
    agreeableness: 0.9, // Important for teamwork
    neuroticism: 0.7    // Lower is better for most fields
  };
  
  Object.keys(userTraits).forEach(trait => {
    const weight = traitWeights[trait as keyof typeof traitWeights] || 1.0;
    const userScore = userTraits[trait];
    const fieldScore = fieldTraits[trait as keyof typeof fieldTraits];
    
    // Calculate similarity (inverse of difference)
    const difference = Math.abs(userScore - fieldScore);
    const similarity = Math.max(0, 100 - difference);
    
    compatibilityScore += similarity * weight;
    totalWeight += weight;
  });
  
  return Math.round(compatibilityScore / totalWeight);
};

const getFieldStrengths = (userScores: any, fieldTraits: any) => {
  const strengths: string[] = [];
  
  Object.keys(userScores).forEach(trait => {
    const userScore = userScores[trait];
    const fieldScore = fieldTraits[trait];
    
    if (userScore >= fieldScore - 10) {
      strengths.push(trait);
    }
  });
  
  return strengths;
};

const getFieldWeaknesses = (userScores: any, fieldTraits: any) => {
  const weaknesses: string[] = [];
  
  Object.keys(userScores).forEach(trait => {
    const userScore = userScores[trait];
    const fieldScore = fieldTraits[trait];
    
    if (userScore < fieldScore - 15) {
      weaknesses.push(trait);
    }
  });
  
  return weaknesses;
};

const getFieldRecommendations = (userScores: any, fieldTraits: any, field: SoftwareField) => {
  const strengths = getFieldStrengths(userScores, fieldTraits);
  const weaknesses = getFieldWeaknesses(userScores, fieldTraits);
  
  return {
    strengths: strengths.map(s => field.skills.soft.find(skill => skill.toLowerCase().includes(s)) || s),
    weaknesses: weaknesses.map(w => field.skills.soft.find(skill => skill.toLowerCase().includes(w)) || w),
    developmentAreas: field.courses.beginner.slice(0, 3)
  };
};

export const getTopRecommendedFields = (oceanScores: any, limit: number = 3) => {
  const recommendations = softwareFields.map(field => {
    const matchScore = analyzePersonalityForField(oceanScores, field);
    const analysis = getFieldRecommendations(oceanScores, field.personalityTraits, field);
    
    return {
      field,
      matchScore,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      developmentAreas: analysis.developmentAreas
    };
  });
  
  // Sort by match score and return top recommendations
  return recommendations
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);
};

export const getFieldById = (id: string) => {
  return softwareFields.find(field => field.id === id);
};

export const getFieldsByCategory = (category: string) => {
  return softwareFields.filter(field => field.category === category);
}; 