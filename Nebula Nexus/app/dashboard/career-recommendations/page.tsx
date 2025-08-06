'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  Target, 
  TrendingUp, 
  BookOpen, 
  Star,
  ArrowRight,
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface CareerRecommendation {
  id: string;
  field: string;
  confidence: number;
  reasoning: string;
  createdAt: string;
}

interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
  testDate: string;
}

export default function CareerRecommendationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
  const [oceanScores, setOceanScores] = useState<OceanScores | null>(null);
  const [selectedField, setSelectedField] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCareerRecommendations();
    }
  }, [isAuthenticated, user]);

  const loadCareerRecommendations = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/user/career-recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.data.recommendations);
        setOceanScores(data.data.oceanScores);
        setSelectedField(data.data.selectedField || '');
      }
    } catch (error) {
      console.error('Error loading career recommendations:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getFieldIcon = (field: string) => {
    const fieldIcons: { [key: string]: React.ReactNode } = {
      'AI & Machine Learning': <TrendingUp className="w-6 h-6" />,
      'Frontend Development': <BookOpen className="w-6 h-6" />,
      'Backend Development': <Target className="w-6 h-6" />,
      'Mobile Development': <Users className="w-6 h-6" />,
      'Data Science': <Star className="w-6 h-6" />,
      'Cybersecurity': <AlertCircle className="w-6 h-6" />,
      'DevOps': <CheckCircle className="w-6 h-6" />,
    };
    return fieldIcons[field] || <Target className="w-6 h-6" />;
  };

  const getFieldColor = (field: string) => {
    const fieldColors: { [key: string]: string } = {
      'AI & Machine Learning': 'from-purple-500 to-pink-500',
      'Frontend Development': 'from-blue-500 to-cyan-500',
      'Backend Development': 'from-green-500 to-emerald-500',
      'Mobile Development': 'from-orange-500 to-red-500',
      'Data Science': 'from-indigo-500 to-purple-500',
      'Cybersecurity': 'from-red-500 to-pink-500',
      'DevOps': 'from-yellow-500 to-orange-500',
    };
    return fieldColors[field] || 'from-gray-500 to-gray-600';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 0.8) return 'Yüksek';
    if (confidence >= 0.6) return 'Orta';
    return 'Düşük';
  };

  if (isLoading || isLoadingData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
          <p className="text-purple-200 text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-purple-200 mb-8">Kariyer önerilerini görmek için lütfen giriş yapın.</p>
          <Link href="/auth/signin" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Giriş Yap
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
            <Home className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ana Sayfa</span>
          </button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Kariyer Önerileri
              </h1>
              <p className="text-purple-200 text-lg">
                Kişilik testinize göre size özel kariyer önerileri
              </p>
            </div>
            <Link href="/test" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Testi Yenile
            </Link>
          </div>
        </motion.div>

        {/* OCEAN Scores Summary */}
        {oceanScores && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <h3 className="text-xl font-semibold text-white mb-4">OCEAN Kişilik Profili</h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {Object.entries(oceanScores).filter(([key]) => key !== 'testDate').map(([trait, score]) => (
                  <div key={trait} className="text-center">
                    <div className="relative w-16 h-16 mx-auto mb-3">
                      <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#374151"
                          strokeWidth="2"
                        />
                        <path
                          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          fill="none"
                          stroke="#8B5CF6"
                          strokeWidth="2"
                          strokeDasharray={`${(score / 5) * 100}, 100`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-bold text-white">{score}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-white">
                      {trait === 'openness' ? 'Açıklık' :
                       trait === 'conscientiousness' ? 'Sorumluluk' :
                       trait === 'extraversion' ? 'Dışadönüklük' :
                       trait === 'agreeableness' ? 'Uyumluluk' : 'Nörotizm'}
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center mt-4">
                <p className="text-purple-300 text-sm">
                  Test Tarihi: {new Date(oceanScores.testDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Selected Field */}
        {selectedField && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-green-300 mb-2">
                    Seçili Kariyer Alanı
                  </h3>
                  <p className="text-green-200 text-lg">{selectedField}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Career Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h3 className="text-2xl font-semibold text-white mb-6">Önerilen Kariyer Alanları</h3>
          
          {recommendations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((recommendation, index) => (
                <motion.div
                  key={recommendation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 bg-gradient-to-r ${getFieldColor(recommendation.field)} rounded-xl flex items-center justify-center mr-4`}>
                      {getFieldIcon(recommendation.field)}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{recommendation.field}</h4>
                      <div className="flex items-center">
                        <span className={`text-sm font-medium ${getConfidenceColor(recommendation.confidence)}`}>
                          {getConfidenceText(recommendation.confidence)} Uyum
                        </span>
                        <span className="text-purple-300 text-sm ml-2">
                          {Math.round(recommendation.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-purple-200 text-sm mb-4 line-clamp-3">
                    {recommendation.reasoning}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-purple-300 text-xs">
                      {new Date(recommendation.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    <Link href={`/career-roadmap?field=${encodeURIComponent(recommendation.field)}`}>
                      <button className="flex items-center text-purple-300 hover:text-white transition-colors text-sm">
                        Detaylar
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white mb-2">Henüz Öneri Yok</h4>
              <p className="text-purple-200 mb-6">
                Kariyer önerileri almak için önce OCEAN kişilik testini tamamlayın.
              </p>
              <Link href="/test">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                  Testi Çöz
                </button>
              </Link>
            </div>
          )}
        </motion.div>

        {/* Action Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <Link href="/chat">
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-6 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">AI Danışman</h4>
                  <p className="text-blue-200 text-sm">Kariyer hakkında sorular sorun</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/career-roadmap">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Kariyer Yolu</h4>
                  <p className="text-green-200 text-sm">Detaylı yol haritası görün</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/resources">
            <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 p-6 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 cursor-pointer">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-white">Eğitim Kaynakları</h4>
                  <p className="text-orange-200 text-sm">Önerilen kursları keşfedin</p>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 