'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  Target, 
  BookOpen, 
  Users, 
  TrendingUp,
  Star,
  CheckCircle,
  Clock,
  Award,
  Brain,
  ChevronRight,
  ChevronDown,
  Search,
  Download,
  Share2,
  Bookmark,
  Rocket,
  RefreshCw,
  GraduationCap,
  Code,
  Database,
  Globe,
  Smartphone,
  Shield,
  Zap,
  Lightbulb,
  Trophy,
  Calendar,
  MapPin,
  ArrowRight,
  Play,
  ExternalLink,
  Plus,
  Minus,
  Eye,
  EyeOff,
  Home
} from 'lucide-react';
import { useAuth } from '@/app/contexts/AuthContext';
import { useNotificationManager } from '@/components/ui/NotificationSystem';
import LoadingIndicators from '@/components/ui/LoadingIndicators';

interface LevelBasedCareerPath {
  id: string;
  level: string;
  field: string;
  title: string;
  description: string;
  duration: string;
  estimatedSalary: string;
  demand: string;
  skills: string[];
  modules: Module[];
  certifications: Certification[];
  nextLevel: string;
  completionCriteria: string;
  progress: number;
  isCompleted: boolean;
  roadmapId: string;
}

interface Module {
  title: string;
  duration: string;
  description: string;
  topics: string[];
  resources: Resource[];
  projects: Project[];
  milestones: Milestone[];
}

interface Resource {
  title: string;
  type: string;
  platform: string;
  duration: string;
  price: string;
  url: string;
  description: string;
}

interface Project {
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: string;
  technologies: string[];
}

interface Milestone {
  title: string;
  description: string;
  criteria: string;
  estimatedTime: string;
}

interface Certification {
  name: string;
  issuer: string;
  cost: string;
  duration: string;
  url: string;
}

const LEVELS = [
  { id: 'beginner', name: 'Başlangıç', color: 'from-green-500 to-emerald-500', duration: '3-6 ay' },
  { id: 'intermediate', name: 'Orta', color: 'from-yellow-500 to-orange-500', duration: '6-12 ay' },
  { id: 'advanced', name: 'İleri', color: 'from-red-500 to-pink-500', duration: '12-18 ay' }
];

export default function CareerRoadmapPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotificationManager();
  
  const [userData, setUserData] = useState<any>(null);
  const [selectedField, setSelectedField] = useState<string>('');
  const [currentLevel, setCurrentLevel] = useState<string>('beginner');
  const [careerPath, setCareerPath] = useState<LevelBasedCareerPath | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set<string>());
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [nextLevelData, setNextLevelData] = useState<any>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      const response = await fetch(`/api/user/profile?userId=${user?.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
        setSelectedField(data.selectedField || '');
        
        if (data.selectedField) {
          await loadCurrentLevelPath(data.selectedField);
        }
      } else {
        console.error('Failed to load user profile:', response.status);
        addNotification({
          type: 'warning',
          title: 'Veri Yükleme Hatası',
          message: 'Kullanıcı profili yüklenirken bir hata oluştu.'
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      addNotification({
        type: 'warning',
        title: 'Veri Yükleme Hatası',
        message: 'Kullanıcı verileri yüklenirken bir hata oluştu.'
      });
    }
  };

  const loadCurrentLevelPath = async (field: string) => {
    try {
      // Check if user has a current level path
      const response = await fetch('/api/career-roadmap/user-roadmaps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        const roadmaps = await response.json();
        
        // Add null checks for roadmaps array and category property
        const currentPath = Array.isArray(roadmaps) 
          ? roadmaps.find((r: any) => r?.category?.includes?.(field))
          : null;
        
        if (currentPath) {
          // Parse modules and certifications from JSON strings or use as-is if already parsed
          const parsedPath = {
            ...currentPath,
            skills: Array.isArray(currentPath.skills) 
              ? currentPath.skills 
              : (typeof currentPath.skills === 'string' ? JSON.parse(currentPath.skills) : []),
            modules: Array.isArray(currentPath.modules) 
              ? currentPath.modules 
              : (typeof currentPath.modules === 'string' ? JSON.parse(currentPath.modules) : []),
            certifications: Array.isArray(currentPath.certifications) 
              ? currentPath.certifications 
              : (typeof currentPath.certifications === 'string' ? JSON.parse(currentPath.certifications) : [])
          };
          setCareerPath(parsedPath);
          setCurrentLevel(currentPath.difficulty);
        } else {
          // Generate new path for current level
          await generateLevelPath(field, currentLevel);
        }
      } else {
        console.error('Failed to load user roadmaps:', response.status);
        // If no roadmaps found, generate new path
        await generateLevelPath(field, currentLevel);
      }
    } catch (error) {
      console.error('Error loading current level path:', error);
      // If error occurs, generate new path
      await generateLevelPath(field, currentLevel);
    }
  };

  const generateLevelPath = async (field: string, level: string) => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/career-roadmap/level-based', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          level,
          field,
          oceanScores: userData?.oceanScores
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Add null checks for careerPath and its properties
        if (result?.careerPath) {
          // Parse modules and certifications from JSON strings or use as-is if already parsed
          const parsedPath = {
            ...result.careerPath,
            skills: Array.isArray(result.careerPath.skills) 
              ? result.careerPath.skills 
              : (typeof result.careerPath.skills === 'string' ? JSON.parse(result.careerPath.skills) : []),
            modules: Array.isArray(result.careerPath.modules) 
              ? result.careerPath.modules 
              : (typeof result.careerPath.modules === 'string' ? JSON.parse(result.careerPath.modules) : []),
            certifications: Array.isArray(result.careerPath.certifications) 
              ? result.careerPath.certifications 
              : (typeof result.careerPath.certifications === 'string' ? JSON.parse(result.careerPath.certifications) : [])
          };
          setCareerPath(parsedPath);
          addNotification({
            type: 'success',
            title: 'Kariyer Yolu Oluşturuldu',
            message: `${level} seviye ${field} yolu başarıyla oluşturuldu.`
          });
        } else {
          throw new Error('Invalid response structure from API');
        }
      } else {
        const errorText = await response.text();
        console.error('Failed to generate career path:', response.status, errorText);
        throw new Error(`Failed to generate career path: ${response.status}`);
      }
    } catch (error) {
      console.error('Error generating level path:', error);
      addNotification({
        type: 'warning',
        title: 'Oluşturma Hatası',
        message: 'Kariyer yolu oluşturulurken bir hata oluştu.'
      });
    } finally {
      setIsGenerating(false);
    }
  };



  const handleItemComplete = async (itemId: string, itemType: 'milestone' | 'course') => {
    try {
      const response = await fetch('/api/career-roadmap/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          roadmapId: careerPath?.roadmapId,
          action: `complete_${itemType}`,
          itemId,
          itemType
        })
      });

      if (response.ok) {
        const result = await response.json();
        
        // Update career path with new progress
        setCareerPath(prev => prev ? {
          ...prev,
          progress: result.progress,
          isCompleted: result.isLevelCompleted
        } : null);

        if (result.isLevelCompleted) {
          setShowLevelUpModal(true);
          setNextLevelData({
            currentLevel: result.currentLevel,
            nextLevel: result.nextLevel,
            field: result.field
          });
        }

        addNotification({
          type: 'success',
          title: 'İlerleme Kaydedildi',
          message: `${itemType === 'milestone' ? 'Kilometre taşı' : 'Kurs'} tamamlandı!`
        });
      }
    } catch (error) {
      console.error('Error completing item:', error);
             addNotification({
         type: 'warning',
         title: 'Hata',
         message: 'İlerleme kaydedilirken bir hata oluştu.'
       });
    }
  };

  const handleLevelUp = async () => {
    if (!nextLevelData) return;

    setShowLevelUpModal(false);
    setCurrentLevel(nextLevelData.nextLevel);
    await generateLevelPath(nextLevelData.field, nextLevelData.nextLevel);
  };

  const toggleModule = (moduleTitle: string) => {
    const newExpanded = new Set(expandedModules);
    if (newExpanded.has(moduleTitle)) {
      newExpanded.delete(moduleTitle);
    } else {
      newExpanded.add(moduleTitle);
    }
    setExpandedModules(newExpanded);
  };



  const getLevelColor = (level: string) => {
    const levelData = LEVELS.find(l => l.id === level);
    return levelData ? levelData.color : 'from-green-500 to-emerald-500';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <LoadingIndicators />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Target className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-gray-300 mb-6">Kariyer yol haritasını görüntülemek için lütfen giriş yapın.</p>
          <Link href="/auth/signin">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
              Giriş Yap
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Test tamamlanmış mı kontrol et
  const hasCompletedTest = userData?.oceanScores && 
    userData.oceanScores.openness > 0 && 
    userData.oceanScores.conscientiousness > 0 && 
    userData.oceanScores.extraversion > 0 && 
    userData.oceanScores.agreeableness > 0 && 
    userData.oceanScores.neuroticism > 0;

  // userData henüz yüklenmemişse yükleniyor göster
  if (!userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Target className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-4">Kullanıcı Verileri Yükleniyor...</h2>
          <p className="text-gray-300 mb-6">Kullanıcı bilgileriniz yükleniyor...</p>
          <LoadingIndicators />
        </div>
      </div>
    );
  }

  if (!hasCompletedTest) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Target className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Test Gerekli</h2>
          <p className="text-gray-300 mb-6">
            Kişiselleştirilmiş kariyer yol haritası oluşturmak için önce OCEAN kişilik testini tamamlamanız gerekiyor.
          </p>
          <Link href="/test">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
              Testi Çöz
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Alan seçimi yoksa dashboard'a yönlendir
  if (!selectedField) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Target className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Alan Seçimi Gerekli</h2>
          <p className="text-gray-300 mb-6">
            Kariyer yol haritası oluşturmak için önce dashboard'da size en uygun alanı seçmeniz gerekiyor.
          </p>
          <Link href="/dashboard">
            <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200">
              Dashboard'a Git
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Kariyer yolu yükleniyor veya henüz oluşturulmamış
  if (!careerPath || isGenerating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <Target className="w-16 h-16 text-cyan-400 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-white mb-4">
            {isGenerating ? 'Kariyer Yolu Oluşturuluyor...' : 'Kariyer Yolu Yükleniyor...'}
          </h2>
          <p className="text-gray-300 mb-6">
            {isGenerating 
              ? 'Kişiselleştirilmiş kariyer yol haritanız oluşturuluyor. Bu işlem birkaç dakika sürebilir.'
              : 'Kariyer yol haritanız yükleniyor...'
            }
          </p>
          <LoadingIndicators />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
             {/* Home Button */}
       <div className="fixed top-4 right-4 z-50">
         <Link href="/">
           <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
             <Home className="w-5 h-5 text-white" />
             <span className="text-white font-medium">Ana Sayfa</span>
           </button>
         </Link>
       </div>

      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative bg-black/30 backdrop-blur-md border-b border-white/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                  Seviye Bazlı Kariyer Yolu
                </h1>
                {selectedField && (
                  <p className="text-sm text-gray-300 flex items-center space-x-2">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span>Alan: {selectedField}</span>
                    {currentLevel && (
                      <>
                        <span className="text-gray-500">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${getLevelColor(currentLevel)} text-white`}>
                          {LEVELS.find(l => l.id === currentLevel)?.name}
                        </span>
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {isGenerating && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-3 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 px-4 py-2 rounded-xl border border-cyan-400/30"
                >
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-cyan-400 border-t-transparent"></div>
                  <span className="text-sm text-cyan-400 font-medium">AI Yolu Oluşturuluyor...</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Career Path Content */}
        {careerPath && (
          <div className="space-y-8">
            {/* Path Overview */}
            <div className="bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-2xl flex items-center justify-center">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">{careerPath.title}</h2>
                      <p className="text-gray-300 text-lg">{careerPath.description}</p>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-white font-semibold">İlerleme</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{careerPath.progress}%</div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${careerPath.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <Clock className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-semibold">Süre</span>
                      </div>
                      <div className="text-2xl font-bold text-white">{careerPath.duration}</div>
                      <p className="text-gray-400 text-sm">Tahmini süre</p>
                    </div>



                    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-semibold">Talep</span>
                      </div>
                      <div className="text-2xl font-bold text-white capitalize">{careerPath.demand}</div>
                      <p className="text-gray-400 text-sm">Piyasa talebi</p>
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-4">Gerekli Beceriler</h3>
                    <div className="flex flex-wrap gap-2">
                      {careerPath.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 text-cyan-400 rounded-full text-sm border border-cyan-400/30"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

                         {/* Modules */}
             <div className="space-y-6">
               <h3 className="text-2xl font-bold text-white">Öğrenme Modülleri</h3>
               {careerPath.modules && careerPath.modules.length > 0 ? (
                 careerPath.modules.map((module, moduleIndex) => (
                <motion.div
                  key={moduleIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: moduleIndex * 0.1 }}
                  className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden"
                >
                  <button
                    onClick={() => toggleModule(module.title)}
                    className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xl font-bold text-white">{module.title}</h4>
                        <p className="text-gray-300">{module.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-gray-400">{module.duration}</span>
                      {expandedModules.has(module.title) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedModules.has(module.title) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 space-y-6">
                          {/* Topics */}
                          <div>
                            <h5 className="text-lg font-semibold text-white mb-3">Konular</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {module.topics.map((topic, index) => (
                                <div key={index} className="flex items-center space-x-2 text-gray-300">
                                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                                  <span>{topic}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Resources */}
                          <div>
                            <h5 className="text-lg font-semibold text-white mb-3">Kaynaklar</h5>
                            <div className="space-y-3">
                              {module.resources.map((resource, index) => (
                                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h6 className="text-white font-semibold mb-2">{resource.title}</h6>
                                      <p className="text-gray-300 text-sm mb-3">{resource.description}</p>
                                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                                        <span className="flex items-center space-x-1">
                                          <Clock className="w-4 h-4" />
                                          <span>{resource.duration}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                          <span className="font-bold text-green-400">{resource.price}</span>
                                        </span>
                                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
                                          {resource.platform}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <button
                                        onClick={() => handleItemComplete(`resource-${index}`, 'course')}
                                        className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                                      >
                                        <CheckCircle className="w-5 h-5" />
                                      </button>
                                      <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-colors"
                                      >
                                        <ExternalLink className="w-5 h-5" />
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Projects */}
                          <div>
                            <h5 className="text-lg font-semibold text-white mb-3">Projeler</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {module.projects.map((project, index) => (
                                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                  <h6 className="text-white font-semibold mb-2">{project.title}</h6>
                                  <p className="text-gray-300 text-sm mb-3">{project.description}</p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                        project.difficulty === 'kolay' ? 'bg-green-500/20 text-green-400' :
                                        project.difficulty === 'orta' ? 'bg-yellow-500/20 text-yellow-400' :
                                        'bg-red-500/20 text-red-400'
                                      }`}>
                                        {project.difficulty}
                                      </span>
                                      <span className="text-gray-400 text-sm">{project.estimatedTime}</span>
                                    </div>
                                    <button
                                      onClick={() => handleItemComplete(`project-${index}`, 'milestone')}
                                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Milestones */}
                          <div>
                            <h5 className="text-lg font-semibold text-white mb-3">Kilometre Taşları</h5>
                            <div className="space-y-3">
                              {module.milestones.map((milestone, index) => (
                                <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h6 className="text-white font-semibold mb-2">{milestone.title}</h6>
                                      <p className="text-gray-300 text-sm mb-2">{milestone.description}</p>
                                      <p className="text-gray-400 text-sm mb-2">Kriterler: {milestone.criteria}</p>
                                      <span className="text-gray-400 text-sm">{milestone.estimatedTime}</span>
                                    </div>
                                    <button
                                      onClick={() => handleItemComplete(`milestone-${index}`, 'milestone')}
                                      className="p-2 bg-green-500/20 hover:bg-green-500/30 text-green-400 rounded-lg transition-colors"
                                    >
                                      <CheckCircle className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                                 </motion.div>
               ))
               ) : (
                 <div className="text-center py-8">
                   <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                   <p className="text-gray-400">Henüz modül bulunmuyor.</p>
                 </div>
               )}
             </div>

                         {/* Certifications */}
             {careerPath.certifications && careerPath.certifications.length > 0 && (
              <div className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6">
                <h3 className="text-2xl font-bold text-white mb-6">Önerilen Sertifikalar</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {careerPath.certifications.map((cert, index) => (
                    <div key={index} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <h4 className="text-white font-semibold mb-2">{cert.name}</h4>
                      <p className="text-gray-300 text-sm mb-3">{cert.issuer}</p>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-400 font-bold">{cert.cost}</span>
                        <span className="text-gray-400">{cert.duration}</span>
                      </div>
                      <a
                        href={cert.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <span>Detaylar</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Level Up Modal */}
        <AnimatePresence>
          {showLevelUpModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-black/80 backdrop-blur-md rounded-3xl border border-white/20 p-8 max-w-md w-full text-center"
              >
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-4">Tebrikler! 🎉</h2>
                <p className="text-gray-300 mb-6">
                  {nextLevelData?.currentLevel} seviyesini başarıyla tamamladınız! 
                  Şimdi {nextLevelData?.nextLevel} seviyesine geçebilirsiniz.
                </p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowLevelUpModal(false)}
                    className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors"
                  >
                    Daha Sonra
                  </button>
                  <button
                    onClick={handleLevelUp}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white rounded-xl transition-colors"
                  >
                    Sonraki Seviyeye Geç
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
} 