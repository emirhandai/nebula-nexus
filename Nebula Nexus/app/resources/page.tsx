'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Star, 
  Clock, 
  DollarSign, 
  Globe, 
  Award,
  Play,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Users,
  TrendingUp,
  Zap,
  Home,
  MapPin,
  Target,
  Lightbulb,
  GraduationCap,
  Code
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

interface Course {
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
  searchQuery: string; // Arama sorgusu
  platformUrl: string; // Platform ana sayfası
  searchUrl: string; // Arama URL'i
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
    searchUrl: string; // Arama URL'i
  };
}

interface UserData {
  id: string;
  selectedField?: string;
  oceanScores?: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number };
}

export default function ResourcesPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('recommended');

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (userData?.selectedField) {
      loadRecommendedCourses();
    } else {
      loadAllCourses();
    }
  }, [userData]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, selectedPlatform, selectedLevel, selectedCategory, sortBy]);

  const loadUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadRecommendedCourses = async () => {
    try {
      setIsLoadingCourses(true);
      const response = await fetch('/api/courses/fetch-btk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          field: userData?.selectedField || 'Full Stack Developer',
          limit: 20
        })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.courses) {
                     // BTK kurslarını öncelikle göster
           const btkCourses = data.courses.map((course: any) => ({
             ...course,
             platform: 'BTK Akademi',
             searchQuery: `${course.title} ${userData?.selectedField}`,
             platformUrl: 'https://www.btkakademi.gov.tr',
             searchUrl: `https://www.btkakademi.gov.tr/search?q=${encodeURIComponent(course.title)}`
           }));
          
          // Diğer platformlardan öneriler ekle
          const otherCourses = generateOtherPlatformCourses(userData?.selectedField || 'Full Stack Developer');
          
          setCourses([...btkCourses, ...otherCourses]);
        } else {
          // Fallback: sadece diğer platformlar
          const fallbackCourses = generateOtherPlatformCourses(userData?.selectedField || 'Full Stack Developer');
          setCourses(fallbackCourses);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      // Fallback: sadece diğer platformlar
      const fallbackCourses = generateOtherPlatformCourses(userData?.selectedField || 'Full Stack Developer');
      setCourses(fallbackCourses);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  const loadAllCourses = async () => {
    try {
      setIsLoadingCourses(true);
      // Sadece seçilen alan için kurslar göster
      const selectedField = userData?.selectedField || 'Full Stack Developer';
      const fieldCourses = generateOtherPlatformCourses(selectedField);
      setCourses(fieldCourses);
    } catch (error) {
      console.error('Error loading all courses:', error);
    } finally {
      setIsLoadingCourses(false);
    }
  };

  // Diğer platformlardan kurs önerileri oluştur
  const generateOtherPlatformCourses = (field: string): Course[] => {
    const platforms = [
      {
        name: 'Udemy',
        url: 'https://www.udemy.com',
        searchUrl: 'https://www.udemy.com/courses/search/?q=',
        icon: BookOpen,
        description: 'Online kurs platformu'
      },
      {
        name: 'Coursera',
        url: 'https://www.coursera.org',
        searchUrl: 'https://www.coursera.org/search?query=',
        icon: GraduationCap,
        description: 'Üniversite kursları'
      },
      {
        name: 'YouTube',
        url: 'https://www.youtube.com',
        searchUrl: 'https://www.youtube.com/results?search_query=',
        icon: Play,
        description: 'Video eğitimler'
      },
      {
        name: 'freeCodeCamp',
        url: 'https://www.freecodecamp.org',
        searchUrl: 'https://www.freecodecamp.org/search?query=',
        icon: Code,
        description: 'Ücretsiz kodlama'
      }
    ];

    const courseTemplates = [
      {
        title: `${field} Temel Eğitimi`,
        description: `${field} alanında temel kavramları öğrenin`,
        level: 'Başlangıç',
        duration: '4-6 hafta',
        category: 'Temel Eğitim'
      },
      {
        title: `${field} İleri Seviye`,
        description: `${field} konularında derinlemesine bilgi edinin`,
        level: 'İleri',
        duration: '8-12 hafta',
        category: 'İleri Eğitim'
      },
      {
        title: `${field} Proje Odaklı`,
        description: `${field} ile gerçek projeler geliştirin`,
        level: 'Orta',
        duration: '6-8 hafta',
        category: 'Proje Eğitimi'
      }
    ];

    const courses: Course[] = [];
    
    platforms.forEach((platform, platformIndex) => {
      courseTemplates.forEach((template, templateIndex) => {
        // Create unique ID by combining field, platform, and template index
        const uniqueId = `${field.replace(/\s+/g, '-')}-${platform.name}-${templateIndex}`;
        
        courses.push({
          id: uniqueId,
          title: template.title,
          description: template.description,
          platform: platform.name,
          category: template.category,
          level: template.level,
          duration: template.duration,
          language: 'Türkçe',
          price: platform.name === 'YouTube' || platform.name === 'freeCodeCamp' ? 0 : 50,
          rating: 4.5,
          instructor: 'Uzman Eğitmen',
          searchQuery: `${field} ${template.title}`,
          platformUrl: platform.url,
          searchUrl: `${platform.searchUrl}${encodeURIComponent(field)}`,
          tags: [field, template.category, platform.name],
          skills: [field, 'Programlama', 'Teknoloji'],
          certificate: platform.name !== 'YouTube',
          completionRate: 85,
          popularity: 'Yüksek',
          platformInfo: {
            name: platform.name,
            description: platform.description,
            url: platform.url,
            icon: platform.icon,
            searchUrl: platform.searchUrl
          }
        });
      });
    });

    return courses;
  };

  // Tüm platformlardan kurslar
  const generateAllPlatformCourses = (): Course[] => {
    const fields = ['Full Stack Developer', 'Backend Developer', 'Frontend Developer', 'DevOps Engineer', 'Data Scientist'];
    const allCourses: Course[] = [];
    
    fields.forEach(field => {
      const fieldCourses = generateOtherPlatformCourses(field);
      allCourses.push(...fieldCourses);
    });

    return allCourses;
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Arama filtresi
    if (searchTerm) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Platform filtresi
    if (selectedPlatform !== 'all') {
      filtered = filtered.filter(course => course.platform === selectedPlatform);
    }

    // Seviye filtresi
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => course.level === selectedLevel);
    }

    // Kategori filtresi
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory);
    }

    // Sıralama
    switch (sortBy) {
      case 'recommended':
        // BTK Akademi öncelikli
        filtered.sort((a, b) => {
          if (a.platform === 'BTK Akademi' && b.platform !== 'BTK Akademi') return -1;
          if (b.platform === 'BTK Akademi' && a.platform !== 'BTK Akademi') return 1;
          return b.rating - a.rating;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'duration':
        filtered.sort((a, b) => parseInt(a.duration) - parseInt(b.duration));
        break;
      case 'price':
        filtered.sort((a, b) => a.price - b.price);
        break;
    }

    setFilteredCourses(filtered);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'BTK Akademi':
        return <Award className="w-5 h-5 text-blue-500" />;
      case 'Udemy':
        return <BookOpen className="w-5 h-5 text-purple-500" />;
      case 'Coursera':
        return <GraduationCap className="w-5 h-5 text-blue-600" />;
      case 'YouTube':
        return <Play className="w-5 h-5 text-red-500" />;
      case 'freeCodeCamp':
        return <Code className="w-5 h-5 text-green-500" />;
      default:
        return <Globe className="w-5 h-5 text-gray-500" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Başlangıç':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Orta':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'İleri':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Temel Eğitim':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'İleri Eğitim':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'Proje Eğitimi':
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  // Platform'a git fonksiyonu
  const goToPlatform = (course: Course) => {
    if (course.platform === 'BTK Akademi') {
      window.open(course.platformUrl, '_blank');
      toast.success('BTK Akademi ana sayfasına yönlendiriliyorsunuz');
    } else {
      window.open(course.searchUrl, '_blank');
      toast.success(`${course.platform}'de arama yapılıyor`);
    }
  };

  // Platform'da ara fonksiyonu
  const searchOnPlatform = (course: Course) => {
    const searchUrl = course.searchUrl;
    window.open(searchUrl, '_blank');
    toast.success(`${course.platform}'de "${course.searchQuery}" aranıyor`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Giriş Yapın</h1>
          <p className="text-gray-300 mb-6">Bu sayfayı görüntülemek için giriş yapmanız gerekiyor.</p>
          <Link href="/auth/signin" className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg transition-colors">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
             {/* Header */}
       <div className="relative overflow-hidden">
         <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20"></div>
         <div className="relative z-10 container mx-auto px-4 py-12">
                       {/* Ana Sayfa Butonu */}
            <div className="flex justify-center mb-6">
              <Link href="/">
                <motion.button
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex items-center space-x-2 px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  <span>Ana Sayfa</span>
                </motion.button>
              </Link>
            </div>
           
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="text-center"
           >
             <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
               🎓 <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                 Eğitim Kaynakları
               </span>
             </h1>
             <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
               Kariyer yolculuğunuzda size rehberlik edecek en iyi eğitim kaynaklarını keşfedin
             </p>
            
            {/* Kişiselleştirilmiş mesaj */}
            {userData?.selectedField && (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/20">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Target className="w-6 h-6 text-purple-400" />
                  <h3 className="text-lg font-semibold text-white">
                    {userData.selectedField} Alanında Öneriler
                  </h3>
                </div>
                <p className="text-gray-300">
                  Seçtiğiniz alan için özel olarak seçilmiş eğitim kaynakları ve platformlar
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Ana İçerik */}
      <div className="container mx-auto px-4 pb-12">
        {/* Arama ve Filtreler */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl p-6 mb-8 border border-white/10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Arama */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Kurs ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filtre Butonu */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              <Filter className="w-5 h-5" />
              <span>Filtreler</span>
              {showFilters ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>

          {/* Filtreler */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Platform Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                  <select
                    value={selectedPlatform}
                    onChange={(e) => setSelectedPlatform(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="BTK Akademi">BTK Akademi</option>
                    <option value="Udemy">Udemy</option>
                    <option value="Coursera">Coursera</option>
                    <option value="YouTube">YouTube</option>
                    <option value="freeCodeCamp">freeCodeCamp</option>
                  </select>
                </div>

                {/* Seviye Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Seviye</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta">Orta</option>
                    <option value="İleri">İleri</option>
                  </select>
                </div>

                {/* Kategori Filtresi */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Kategori</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="all">Tümü</option>
                    <option value="Temel Eğitim">Temel Eğitim</option>
                    <option value="İleri Eğitim">İleri Eğitim</option>
                    <option value="Proje Eğitimi">Proje Eğitimi</option>
                  </select>
                </div>

                {/* Sıralama */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Sıralama</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="recommended">Önerilen</option>
                    <option value="rating">Puan</option>
                    <option value="duration">Süre</option>
                    <option value="price">Fiyat</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Kurslar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {isLoadingCourses ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-500/30 transition-all duration-300 hover:transform hover:scale-105"
                >
                  {/* Platform Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(course.platform)}
                      <span className="text-sm font-medium text-white">{course.platform}</span>
                    </div>
                    {course.platform === 'BTK Akademi' && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full border border-green-500/30">
                        ÜCRETSİZ
                      </span>
                    )}
                  </div>

                  {/* Kurs Başlığı */}
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Açıklama */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>

                  {/* Detaylar */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Seviye:</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getLevelColor(course.level)}`}>
                        {course.level}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Süre:</span>
                      <span className="text-white">{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">Kategori:</span>
                      <span className={`px-2 py-1 rounded-full text-xs border ${getCategoryColor(course.category)}`}>
                        {course.category}
                      </span>
                    </div>
                  </div>

                  {/* Butonlar */}
                  <div className="flex flex-col space-y-2">
                    {course.platform === 'BTK Akademi' ? (
                      <button
                        onClick={() => goToPlatform(course)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>BTK'ya Git</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => goToPlatform(course)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                        >
                          <Globe className="w-4 h-4" />
                          <span>{course.platform}'a Git</span>
                        </button>
                        <button
                          onClick={() => searchOnPlatform(course)}
                          className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors border border-white/20"
                        >
                          <Search className="w-4 h-4" />
                          <span>Bu Kursu Ara</span>
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* Sonuç Yok */}
          {!isLoadingCourses && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Kurs Bulunamadı</h3>
              <p className="text-gray-400">Arama kriterlerinizi değiştirmeyi deneyin.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
} 