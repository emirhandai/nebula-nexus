'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/app/contexts/AuthContext';
import { 
  TestTube, 
  TrendingUp, 
  Calendar, 
  Clock,
  BarChart3,
  Target,
  RefreshCw,
  Trash2,
  Eye,
  Download,
  Home
} from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  id: string;
  testDate: string;
  testDuration: number;
  questionsAnswered: number;
  scores: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  averageScore: number;
  recommendedFields: string[];
}

interface TestSummary {
  totalTests: number;
  averageDuration: number;
  lastTestDate: string | null;
  improvement: number;
}

export default function TestHistoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [tests, setTests] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<TestSummary | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [selectedTest, setSelectedTest] = useState<TestResult | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [testToDelete, setTestToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadTestHistory();
    }
  }, [isAuthenticated, user]);

  const loadTestHistory = async () => {
    try {
      setIsLoadingData(true);
      const response = await fetch('/api/user/test-history');
      if (response.ok) {
        const data = await response.json();
        setTests(data.data.tests);
        setSummary(data.data.summary);
      }
    } catch (error) {
      console.error('Error loading test history:', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleDeleteTest = async (testId: string) => {
    try {
      const response = await fetch(`/api/user/test-history?testId=${testId}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setTests(tests.filter(t => t.id !== testId));
        setShowDeleteModal(false);
        setTestToDelete(null);
        // Reload summary
        loadTestHistory();
      }
    } catch (error) {
      console.error('Error deleting test:', error);
    }
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return 'text-green-400';
    if (score >= 2.5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreLevel = (score: number) => {
    if (score >= 4) return 'Yüksek';
    if (score >= 2.5) return 'Orta';
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
            <TestTube className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Giriş Gerekli</h2>
          <p className="text-purple-200 mb-8">Test geçmişini görmek için lütfen giriş yapın.</p>
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
                Test Geçmişi
              </h1>
              <p className="text-purple-200 text-lg">
                OCEAN kişilik testlerinizin geçmişi ve analizi
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={loadTestHistory}
                disabled={isLoadingData}
                className="bg-white/10 border border-white/20 text-white px-4 py-2 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingData ? 'animate-spin' : ''}`} />
              </button>
              <Link href="/test" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300">
                Yeni Test
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Summary Stats */}
        {summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Toplam Test</p>
                    <p className="text-white text-2xl font-bold">{summary.totalTests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Ortalama Süre</p>
                    <p className="text-white text-2xl font-bold">{formatDuration(summary.averageDuration)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">İyileşme</p>
                    <p className={`text-2xl font-bold ${summary.improvement >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {summary.improvement >= 0 ? '+' : ''}{summary.improvement.toFixed(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mr-4">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-purple-200 text-sm">Son Test</p>
                    <p className="text-white text-sm">
                      {summary.lastTestDate ? formatDate(summary.lastTestDate) : 'Henüz test yok'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Test Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Tests List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-semibold text-white mb-4">Testler</h3>
            <div className="space-y-3">
              {tests.length > 0 ? (
                tests.map((test) => (
                  <motion.div
                    key={test.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-4 cursor-pointer transition-all duration-300 hover:bg-white/20 ${
                      selectedTest?.id === test.id ? 'bg-white/20 border-purple-500/50' : ''
                    }`}
                    onClick={() => setSelectedTest(test)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">
                        Test #{test.id.slice(-8)}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setTestToDelete(test.id);
                          setShowDeleteModal(true);
                        }}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-purple-300">
                        Ortalama: {test.averageScore.toFixed(1)}
                      </span>
                      <span className="text-purple-400">
                        {formatDate(test.testDate)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-purple-400 mt-1">
                      <span>{test.questionsAnswered} soru</span>
                      <span>{formatDuration(test.testDuration)}</span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <TestTube className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                  <p className="text-purple-200">Henüz test geçmişi yok</p>
                  <p className="text-purple-300 text-sm">İlk testinizi çözün</p>
                </div>
              )}
            </div>
          </div>

          {/* Test Details */}
          <div className="lg:col-span-2">
            {selectedTest ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-white">
                    Test Detayları
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-purple-300">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(selectedTest.testDate)}</span>
                  </div>
                </div>

                {/* Test Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-200 text-sm">Ortalama Skor</p>
                    <p className="text-white text-2xl font-bold">{selectedTest.averageScore.toFixed(1)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-200 text-sm">Süre</p>
                    <p className="text-white text-2xl font-bold">{formatDuration(selectedTest.testDuration)}</p>
                  </div>
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-purple-200 text-sm">Sorular</p>
                    <p className="text-white text-2xl font-bold">{selectedTest.questionsAnswered}</p>
                  </div>
                </div>

                {/* OCEAN Scores */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-white mb-4">OCEAN Skorları</h4>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(selectedTest.scores).map(([trait, score]) => (
                      <div key={trait} className="text-center">
                        <div className="relative w-20 h-20 mx-auto mb-3">
                          <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
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
                            <span className={`text-lg font-bold ${getScoreColor(score)}`}>{score}</span>
                          </div>
                        </div>
                        <div className="text-sm font-medium text-white">
                          {trait === 'openness' ? 'Açıklık' :
                           trait === 'conscientiousness' ? 'Sorumluluk' :
                           trait === 'extraversion' ? 'Dışadönüklük' :
                           trait === 'agreeableness' ? 'Uyumluluk' : 'Nörotizm'}
                        </div>
                        <div className={`text-xs ${getScoreColor(score)}`}>
                          {getScoreLevel(score)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Fields */}
                {selectedTest.recommendedFields.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Önerilen Alanlar</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedTest.recommendedFields.map((field, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-200 text-sm"
                        >
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-12 text-center">
                <TestTube className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  Test Seçin
                </h3>
                <p className="text-purple-200">
                  Detayları görmek için sol taraftan bir test seçin
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-semibold text-white mb-4">
                Testi Sil
              </h3>
              <p className="text-purple-200 mb-6">
                Bu testi kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setTestToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white hover:bg-white/20 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={() => testToDelete && handleDeleteTest(testToDelete)}
                  className="flex-1 px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300 hover:bg-red-500/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
} 