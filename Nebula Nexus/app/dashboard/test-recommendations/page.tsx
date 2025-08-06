'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  Lightbulb, 
  TrendingUp, 
  Calendar, 
  Target,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  BarChart3,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface TestRecommendation {
  category: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  actionItems: string[];
  expectedOutcome: string;
}

interface TestStats {
  totalTests: number;
  averageScore: string;
  lastTestDate: string;
  scoreTrends: any;
}

export default function TestRecommendationsPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [recommendations, setRecommendations] = useState<TestRecommendation[]>([]);
  const [testStats, setTestStats] = useState<TestStats | null>(null);
  const [nextTestDate, setNextTestDate] = useState<string>('');
  const [focusAreas, setFocusAreas] = useState<string[]>([]);
  const [overallAssessment, setOverallAssessment] = useState<string>('');
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadTestRecommendations();
    }
  }, [isAuthenticated, user]);

  const loadTestRecommendations = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/user/test-recommendations');
      if (response.ok) {
        const data = await response.json();
        setRecommendations(data.recommendations || []);
        setTestStats(data.testStats);
        setNextTestDate(data.nextTestDate);
        setFocusAreas(data.focusAreas || []);
        setOverallAssessment(data.overallAssessment);
      }
    } catch (error) {
      console.error('Error loading test recommendations:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertCircle className="w-5 h-5" />;
      case 'medium': return <Clock className="w-5 h-5" />;
      case 'low': return <CheckCircle className="w-5 h-5" />;
      default: return <Target className="w-5 h-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-400"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Lightbulb className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-gray-300 mb-6">Test önerilerini görüntülemek için lütfen giriş yapın.</p>
          <Link href="/auth/signin">
            <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
              Giriş Yap
            </button>
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
                Test Önerileri
              </h1>
              <p className="text-purple-200 text-lg">
                Kişiselleştirilmiş test önerileri ve gelişim planınız
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadTestRecommendations}
                disabled={isLoadingData}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/test" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Test Çöz
              </Link>
            </div>
          </div>
        </motion.div>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Test İstatistikleri */}
            {testStats && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <BarChart3 className="w-6 h-6 mr-3 text-purple-400" />
                  Test İstatistikleri
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Target className="w-5 h-5 text-purple-400" />
                      <span className="text-white font-semibold">Toplam Test</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{testStats.totalTests}</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <TrendingUp className="w-5 h-5 text-green-400" />
                      <span className="text-white font-semibold">Ortalama Skor</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{testStats.averageScore}/100</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-semibold">Son Test</span>
                    </div>
                    <div className="text-sm text-white">
                      {new Date(testStats.lastTestDate).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calendar className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-semibold">Sonraki Test</span>
                    </div>
                    <div className="text-sm text-white">
                      {nextTestDate ? new Date(nextTestDate).toLocaleDateString('tr-TR') : 'Belirlenmedi'}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Genel Değerlendirme */}
            {overallAssessment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Lightbulb className="w-6 h-6 mr-3 text-yellow-400" />
                  Genel Değerlendirme
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">{overallAssessment}</p>
              </motion.div>
            )}

            {/* Odaklanılacak Alanlar */}
            {focusAreas.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/30 backdrop-blur-md rounded-3xl border border-white/20 p-6"
              >
                <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-red-400" />
                  Odaklanılacak Alanlar
                </h2>
                <div className="flex flex-wrap gap-3">
                  {focusAreas.map((area, index) => (
                    <span
                      key={index}
                      className="px-4 py-2 bg-red-500/20 text-red-400 rounded-full border border-red-500/30 font-medium"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Öneriler */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                <Lightbulb className="w-8 h-8 mr-3 text-purple-400" />
                Kişiselleştirilmiş Öneriler
              </h2>
              
              {recommendations.length === 0 ? (
                <div className="text-center py-12">
                  <Lightbulb className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">Henüz öneri bulunmuyor. İlk testinizi çözerek öneriler alabilirsiniz.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {recommendations.map((recommendation, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="bg-black/30 backdrop-blur-md rounded-2xl border border-white/20 p-6 hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(recommendation.priority)}`}>
                            {getPriorityIcon(recommendation.priority)}
                            <span className="ml-1">{recommendation.priority.toUpperCase()}</span>
                          </span>
                          <h3 className="text-xl font-bold text-white mt-3">{recommendation.title}</h3>
                          <p className="text-sm text-purple-400 mt-1">{recommendation.category}</p>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">{recommendation.description}</p>
                      
                      <div className="mb-4">
                        <h4 className="text-white font-semibold mb-2">Eylem Adımları:</h4>
                        <ul className="space-y-2">
                          {recommendation.actionItems.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-start space-x-2 text-gray-300">
                              <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                        <h4 className="text-green-400 font-semibold mb-1">Beklenen Sonuç:</h4>
                        <p className="text-green-300 text-sm">{recommendation.expectedOutcome}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 