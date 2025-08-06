export interface CareerStage {
  id: string;
  name: string;
  duration: string; // "3-6 ay", "6-12 ay" gibi
  description: string;
  skills: string[];
  projects: string[];
  resources: {
    type: 'course' | 'book' | 'video' | 'platform' | 'tool' | 'certification' | 'documentation';
    name: string;
    url?: string;
    description: string;
  }[];
}

export interface CareerRoadmap {
  fieldName: string;
  stages: CareerStage[];
  totalDuration: string;
  overview: string;
  prerequisites: string[];
}

export const careerRoadmaps: CareerRoadmap[] = [
  {
    fieldName: "Yapay Zeka & Makine Öğrenmesi",
    totalDuration: "2-3 yıl",
    overview: "Matematik temellerinden başlayarak, derin öğrenme ve AI modelleri geliştirmeye kadar uzanan kapsamlı bir yol haritası.",
    prerequisites: [
      "Temel matematik bilgisi (kalkülüs, lineer cebir)",
      "Python programlama temelleri",
      "İstatistik bilgisi"
    ],
    stages: [
      {
        id: "ai_foundation",
        name: "Temel Matematik ve Programlama",
        duration: "3-6 ay",
        description: "AI için gerekli matematik temelleri ve Python programlama becerileri",
        skills: [
          "Python programlama",
          "NumPy, Pandas kütüphaneleri",
          "Lineer cebir",
          "Kalkülüs",
          "Olasılık ve istatistik"
        ],
        projects: [
          "Veri analizi projesi",
          "Basit istatistiksel analizler",
          "Matematik hesaplamaları"
        ],
        resources: [
          {
            type: "course",
            name: "Python for Data Science",
            url: "https://www.coursera.org/learn/python-data-science",
            description: "Coursera'da Python veri bilimi kursu"
          },
          {
            type: "book",
            name: "Linear Algebra Done Right",
            description: "Lineer cebir için temel kitap"
          },
          {
            type: "platform",
            name: "Khan Academy",
            description: "Matematik temelleri için ücretsiz kaynak"
          }
        ]
      },
      {
        id: "ai_ml_basics",
        name: "Makine Öğrenmesi Temelleri",
        duration: "6-12 ay",
        description: "Klasik makine öğrenmesi algoritmaları ve uygulamaları",
        skills: [
          "Scikit-learn",
          "Makine öğrenmesi algoritmaları",
          "Model değerlendirme",
          "Feature engineering",
          "Cross-validation"
        ],
        projects: [
          "Sınıflandırma projesi",
          "Regresyon analizi",
          "Clustering uygulaması"
        ],
        resources: [
          {
            type: "course",
            name: "Machine Learning by Andrew Ng",
            url: "https://www.coursera.org/learn/machine-learning",
            description: "Stanford'un ünlü ML kursu"
          },
          {
            type: "book",
            name: "Hands-On Machine Learning",
            description: "Pratik ML kitabı"
          }
        ]
      },
      {
        id: "ai_deep_learning",
        name: "Derin Öğrenme",
        duration: "6-12 ay",
        description: "Neural networks, CNN, RNN ve transformer modelleri",
        skills: [
          "TensorFlow/PyTorch",
          "Neural networks",
          "CNN, RNN, LSTM",
          "Transformer modelleri",
          "GPU kullanımı"
        ],
        projects: [
          "Görüntü sınıflandırma",
          "NLP projesi",
          "Recommendation system"
        ],
        resources: [
          {
            type: "course",
            name: "Deep Learning Specialization",
            url: "https://www.coursera.org/specializations/deep-learning",
            description: "Andrew Ng'nin derin öğrenme serisi"
          },
          {
            type: "book",
            name: "Deep Learning by Ian Goodfellow",
            description: "Derin öğrenme teorisi"
          }
        ]
      },
      {
        id: "ai_advanced",
        name: "İleri Seviye AI",
        duration: "6-12 ay",
        description: "Generative AI, reinforcement learning ve araştırma",
        skills: [
          "Generative AI",
          "Reinforcement Learning",
          "Model deployment",
          "MLOps",
          "Araştırma metodları"
        ],
        projects: [
          "Chatbot geliştirme",
          "Image generation",
          "Research paper implementation"
        ],
        resources: [
          {
            type: "course",
            name: "CS224N: NLP with Deep Learning",
            description: "Stanford NLP kursu"
          },
          {
            type: "platform",
            name: "Papers With Code",
            description: "Araştırma makaleleri ve kodlar"
          }
        ]
      }
    ]
  },
  {
    fieldName: "Siber Güvenlik",
    totalDuration: "2-3 yıl",
    overview: "Ağ güvenliğinden penetrasyon testine, dijital adli analizden güvenlik mimarisine kadar kapsamlı siber güvenlik eğitimi.",
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "Ağ teknolojileri temelleri",
      "Linux komut satırı"
    ],
    stages: [
      {
        id: "cyber_networking",
        name: "Ağ Teknolojileri ve Güvenlik",
        duration: "6-12 ay",
        description: "TCP/IP, routing, switching ve temel ağ güvenliği",
        skills: [
          "TCP/IP protokolleri",
          "Network routing",
          "Firewall yapılandırması",
          "VPN teknolojileri",
          "Network monitoring"
        ],
        projects: [
          "Basit ağ kurulumu",
          "Firewall yapılandırması",
          "Network analizi"
        ],
        resources: [
          {
            type: "course",
            name: "Cisco CCNA",
            description: "Ağ teknolojileri sertifikası"
          },
          {
            type: "book",
            name: "Computer Networks",
            description: "Ağ teknolojileri kitabı"
          }
        ]
      },
      {
        id: "cyber_penetration",
        name: "Penetrasyon Testi",
        duration: "6-12 ay",
        description: "Güvenlik açıklarını tespit etme ve raporlama",
        skills: [
          "Kali Linux",
          "Metasploit",
          "Nmap",
          "Wireshark",
          "OWASP Top 10"
        ],
        projects: [
          "Web uygulama güvenlik testi",
          "Network penetrasyon testi",
          "Social engineering"
        ],
        resources: [
          {
            type: "course",
            name: "OSCP Certification",
            description: "Offensive Security sertifikası"
          },
          {
            type: "platform",
            name: "HackTheBox",
            description: "Pratik penetrasyon testi platformu"
          }
        ]
      },
      {
        id: "cyber_forensics",
        name: "Dijital Adli Analiz",
        duration: "6-12 ay",
        description: "Dijital kanıt toplama, analiz ve raporlama",
        skills: [
          "Disk imaging",
          "Memory forensics",
          "Network forensics",
          "Mobile forensics",
          "Legal procedures"
        ],
        projects: [
          "Disk analizi",
          "Memory dump analizi",
          "Network log analizi"
        ],
        resources: [
          {
            type: "course",
            name: "SANS FOR508",
            description: "İleri seviye adli analiz kursu"
          },
          {
            type: "tool",
            name: "Autopsy",
            description: "Açık kaynak adli analiz aracı"
          }
        ]
      },
      {
        id: "cyber_advanced",
        name: "İleri Seviye Güvenlik",
        duration: "6-12 ay",
        description: "Güvenlik mimarisi, incident response ve threat hunting",
        skills: [
          "Security architecture",
          "Incident response",
          "Threat hunting",
          "SIEM tools",
          "Security automation"
        ],
        projects: [
          "Güvenlik mimarisi tasarımı",
          "Incident response planı",
          "Threat intelligence"
        ],
        resources: [
          {
            type: "certification",
            name: "CISSP",
            description: "Güvenlik yöneticiliği sertifikası"
          },
          {
            type: "course",
            name: "SANS SEC504",
            description: "Hacker teknikleri kursu"
          }
        ]
      }
    ]
  },
  {
    fieldName: "Web Geliştirme",
    totalDuration: "1-2 yıl",
    overview: "Frontend'den backend'e, veritabanından deployment'a kadar tam kapsamlı web geliştirme eğitimi.",
    prerequisites: [
      "Temel bilgisayar bilgisi",
      "İngilizce okuma yazma",
      "Problem çözme becerisi"
    ],
    stages: [
      {
        id: "web_frontend_basics",
        name: "Frontend Temelleri",
        duration: "3-6 ay",
        description: "HTML, CSS ve JavaScript ile temel web geliştirme",
        skills: [
          "HTML5",
          "CSS3",
          "JavaScript ES6+",
          "Responsive design",
          "Git version control"
        ],
        projects: [
          "Kişisel portfolyo sitesi",
          "Responsive landing page",
          "Basit JavaScript oyunu"
        ],
        resources: [
          {
            type: "course",
            name: "The Complete Web Developer Bootcamp",
            description: "Udemy'de kapsamlı web geliştirme kursu"
          },
          {
            type: "platform",
            name: "freeCodeCamp",
            description: "Ücretsiz web geliştirme eğitimi"
          }
        ]
      },
      {
        id: "web_frontend_advanced",
        name: "İleri Frontend",
        duration: "3-6 ay",
        description: "Modern JavaScript framework'leri ve state management",
        skills: [
          "React.js",
          "Vue.js veya Angular",
          "TypeScript",
          "State management (Redux/Vuex)",
          "Build tools (Webpack/Vite)"
        ],
        projects: [
          "React e-ticaret uygulaması",
          "Vue.js dashboard",
          "SPA uygulaması"
        ],
        resources: [
          {
            type: "course",
            name: "React - The Complete Guide",
            description: "Max Schwarzmüller'in React kursu"
          },
          {
            type: "documentation",
            name: "React Official Docs",
            description: "Resmi React dokümantasyonu"
          }
        ]
      },
      {
        id: "web_backend",
        name: "Backend Geliştirme",
        duration: "6-12 ay",
        description: "Server-side programlama ve veritabanı yönetimi",
        skills: [
          "Node.js/Express",
          "Python/Django veya PHP/Laravel",
          "SQL ve NoSQL veritabanları",
          "RESTful API design",
          "Authentication & Authorization"
        ],
        projects: [
          "REST API geliştirme",
          "Full-stack web uygulaması",
          "Authentication sistemi"
        ],
        resources: [
          {
            type: "course",
            name: "Node.js API Masterclass",
            description: "Node.js backend geliştirme"
          },
          {
            type: "book",
            name: "Designing Data-Intensive Applications",
            description: "Veritabanı tasarımı"
          }
        ]
      },
      {
        id: "web_devops",
        name: "DevOps ve Deployment",
        duration: "3-6 ay",
        description: "CI/CD, cloud deployment ve performans optimizasyonu",
        skills: [
          "Docker",
          "AWS/Azure/GCP",
          "CI/CD pipelines",
          "Performance optimization",
          "Security best practices"
        ],
        projects: [
          "Docker containerization",
          "Cloud deployment",
          "CI/CD pipeline kurulumu"
        ],
        resources: [
          {
            type: "course",
            name: "Docker Mastery",
            description: "Docker container teknolojileri"
          },
          {
            type: "platform",
            name: "AWS Free Tier",
            description: "AWS ücretsiz deneme"
          }
        ]
      }
    ]
  }
];

// Alan adına göre yol haritası getirme
export function getCareerRoadmap(fieldName: string): CareerRoadmap | undefined {
  return careerRoadmaps.find(roadmap => roadmap.fieldName === fieldName);
}

// Tüm yol haritalarını getirme
export function getAllCareerRoadmaps(): CareerRoadmap[] {
  return careerRoadmaps;
} 