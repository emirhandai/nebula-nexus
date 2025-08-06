'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  BookOpen, 
  MessageSquare, 
  Target, 
  Award,
  Calendar,
  Clock,
  CheckCircle,
  Play,
  Pause,
  BarChart3,
  Trophy,
  Star,
  Zap,
  Brain,
  Heart,
  Users,
  Activity
} from 'lucide-react';

interface ProgressData {
  tests: {
    completed: number;
    total: number;
    lastTestDate?: string;
    averageScore: number;
  };
  chats: {
    sessions: number;
    totalMessages: number;
    lastSessionDate?: string;
    averageSessionLength: number;
  };
  courses: {
    completed: number;
    inProgress: number;
    total: number;
    lastCourseDate?: string;
    completionRate: number;
  };
  achievements: {
    earned: number;
    total: number;
    recent: string[];
  };
  streak: {
    current: number;
    longest: number;
    lastActivity: string;
  };
}

interface ProgressTrackerProps {
  userId: string;
  onProgressUpdate?: (progress: ProgressData) => void;
}

export default function ProgressTracker({ userId, onProgressUpdate }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData>({
    tests: { completed: 0, total: 0, averageScore: 0 },
    chats: { sessions: 0, totalMessages: 0, averageSessionLength: 0 },
    courses: { completed: 0, inProgress: 0, total: 0, completionRate: 0 },
    achievements: { earned: 0, total: 0, recent: [] },
    streak: { current: 0, longest: 0, lastActivity: '' }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'tests' | 'chats' | 'courses' | 'achievements'>('overview');

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch real progress data from API
      const response = await fetch(`/api/user/progress?userId=${userId}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Transform API data to match ProgressData interface
        const realProgress: ProgressData = {
          tests: {
            completed: data.progress.oceanResults || 0,
            total: 5, // Fixed total tests available
            lastTestDate: data.progress.lastTestDate || null,
            averageScore: data.progress.averageScore || 0
          },
          chats: {
            sessions: data.progress.chatSessions || 0,
            totalMessages: data.progress.totalMessages || 0,
            lastSessionDate: data.progress.lastSessionDate || null,
            averageSessionLength: data.progress.averageSessionLength || 0
          },
          courses: {
            completed: data.progress.courseProgress || 0,
            inProgress: data.progress.coursesInProgress || 0,
            total: 8, // Fixed total courses available
            lastCourseDate: data.progress.lastCourseDate || null,
            completionRate: data.progress.courseCompletionRate || 0
          },
          achievements: {
            earned: data.progress.achievements || 0,
            total: 20, // Fixed total achievements available
            recent: data.progress.recentAchievements || []
          },
          streak: {
            current: data.progress.currentStreak || 0,
            longest: data.progress.longestStreak || 0,
            lastActivity: data.progress.lastActivity || new Date().toISOString()
          }
        };
        
        setProgress(realProgress);
        onProgressUpdate?.(realProgress);
      } else {
        console.error('Failed to load progress data:', data.error);
        // Fallback to empty data instead of mock
        const emptyProgress: ProgressData = {
          tests: { completed: 0, total: 5, averageScore: 0 },
          chats: { sessions: 0, totalMessages: 0, averageSessionLength: 0 },
          courses: { completed: 0, inProgress: 0, total: 8, completionRate: 0 },
          achievements: { earned: 0, total: 20, recent: [] },
          streak: { current: 0, longest: 0, lastActivity: new Date().toISOString() }
        };
        setProgress(emptyProgress);
        onProgressUpdate?.(emptyProgress);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      // Fallback to empty data instead of mock
      const emptyProgress: ProgressData = {
        tests: { completed: 0, total: 5, averageScore: 0 },
        chats: { sessions: 0, totalMessages: 0, averageSessionLength: 0 },
        courses: { completed: 0, inProgress: 0, total: 8, completionRate: 0 },
        achievements: { earned: 0, total: 20, recent: [] },
        streak: { current: 0, longest: 0, lastActivity: new Date().toISOString() }
      };
      setProgress(emptyProgress);
      onProgressUpdate?.(emptyProgress);
    } finally {
      setIsLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-400';
    if (percentage >= 60) return 'text-yellow-400';
    if (percentage >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getProgressBg = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  if (isLoading) {
    return (
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded"></div>
            <div className="h-3 bg-gray-700 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-2" />
              İlerleme Takibi
            </h3>
            <p className="text-gray-300">Kariyer yolculuğunuzdaki gelişiminizi takip edin</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{progress.streak.current}</div>
            <div className="text-sm text-gray-400">Günlük Seri</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-gray-800/50 p-4">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: BarChart3 },
            { id: 'tests', label: 'Testler', icon: Brain },
            { id: 'chats', label: 'Sohbetler', icon: MessageSquare },
            { id: 'courses', label: 'Eğitimler', icon: BookOpen },
            { id: 'achievements', label: 'Başarılar', icon: Trophy }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Overall Progress */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Brain className="w-6 h-6 text-blue-400" />
                </div>
                <div className="text-2xl font-bold text-white">{progress.tests.completed}</div>
                <div className="text-sm text-gray-400">Tamamlanan Test</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-2xl font-bold text-white">{progress.chats.sessions}</div>
                <div className="text-sm text-gray-400">Chat Oturumu</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-2xl font-bold text-white">{progress.courses.completed}</div>
                <div className="text-sm text-gray-400">Tamamlanan Kurs</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 text-center">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="text-2xl font-bold text-white">{progress.achievements.earned}</div>
                <div className="text-sm text-gray-400">Kazanılan Rozet</div>
              </div>
            </div>

            {/* Streak & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                  Günlük Seri
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Mevcut Seri</span>
                    <span className="text-white font-semibold">{progress.streak.current} gün</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">En Uzun Seri</span>
                    <span className="text-white font-semibold">{progress.streak.longest} gün</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Son Aktivite</span>
                    <span className="text-white font-semibold">{formatDate(progress.streak.lastActivity)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Activity className="w-5 h-5 text-green-400 mr-2" />
                  Son Aktiviteler
                </h4>
                <div className="space-y-3">
                  {progress.achievements.recent.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Award className="w-4 h-4 text-yellow-400" />
                      <span className="text-gray-300 text-sm">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'tests' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Test İstatistikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{progress.tests.completed}</div>
                  <div className="text-sm text-gray-400">Tamamlanan</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{progress.tests.averageScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-400">Ortalama Skor</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{progress.tests.total}</div>
                  <div className="text-sm text-gray-400">Toplam Test</div>
                </div>
              </div>
              {progress.tests.lastTestDate && (
                <div className="mt-4 text-center text-gray-400 text-sm">
                  Son test: {formatDate(progress.tests.lastTestDate)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'chats' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Chat İstatistikleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400">{progress.chats.sessions}</div>
                  <div className="text-sm text-gray-400">Toplam Oturum</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400">{progress.chats.totalMessages}</div>
                  <div className="text-sm text-gray-400">Toplam Mesaj</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400">{progress.chats.averageSessionLength}</div>
                  <div className="text-sm text-gray-400">Ort. Oturum</div>
                </div>
              </div>
              {progress.chats.lastSessionDate && (
                <div className="mt-4 text-center text-gray-400 text-sm">
                  Son oturum: {formatDate(progress.chats.lastSessionDate)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'courses' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Eğitim İlerlemesi</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Tamamlanan Kurslar</span>
                  <span className="text-white font-semibold">{progress.courses.completed}/{progress.courses.total}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${getProgressBg(progress.courses.completionRate)}`}
                    style={{ width: `${progress.courses.completionRate}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span>%{progress.courses.completionRate} tamamlandı</span>
                  <span>{progress.courses.inProgress} devam ediyor</span>
                </div>
              </div>
              {progress.courses.lastCourseDate && (
                <div className="mt-4 text-center text-gray-400 text-sm">
                  Son kurs: {formatDate(progress.courses.lastCourseDate)}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-white mb-4">Başarı Rozetleri</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400">{progress.achievements.earned}</div>
                  <div className="text-sm text-gray-400">Kazanılan</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-400">{progress.achievements.total}</div>
                  <div className="text-sm text-gray-400">Toplam</div>
                </div>
              </div>
              <div className="mt-6">
                <h5 className="text-white font-medium mb-3">Son Kazanılanlar</h5>
                <div className="space-y-2">
                  {progress.achievements.recent.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
                      <Award className="w-5 h-5 text-yellow-400" />
                      <span className="text-gray-300">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 