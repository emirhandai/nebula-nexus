'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { 
  User, 
  Users,
  Brain, 
  Target, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  BookOpen,
  Award,
  TestTube,
  GraduationCap,
  Sparkles,
  Activity,
  Trophy,
  Target as TargetIcon,
  Clock,
  Star,
  Calendar,
  BarChart3,
  Zap,
  Target as TargetIcon2,
  MessageSquare,
  BookOpen as BookOpen2,
  CheckCircle as CheckCircle2,
  Download
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Radar, Line } from 'react-chartjs-2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);


interface CareerRecommendation {
  id: string;
  field: string;
  confidence: number;
  reasoning: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  image?: string;
  oceanScores?: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  lastTestDate?: string;
  careerMatchPercentage?: number;
  selectedField?: string;
  careerRecommendations?: CareerRecommendation[];
}

interface ProgressData {
  testCompleted: boolean;
  fieldSelected: boolean;
  coursesCompleted: number;
  totalCourses: number;
  chatSessions: number;
  achievementPoints: number;
  level: number;
  nextLevelPoints: number;
  currentLevelPoints: number;
}

interface RecentActivity {
  id: string;
  type: 'test_completed' | 'field_selected' | 'course_completed' | 'chat_session' | 'achievement_earned';
  title: string;
  description: string;
  timestamp: Date;
  icon: React.ReactNode;
  color: string;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  earned: boolean;
  progress?: number;
  maxProgress?: number;
}

interface CareerGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number;
  status: 'not_started' | 'in_progress' | 'completed';
}

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [hasCompletedTest, setHasCompletedTest] = useState(false);
  const [selectedField, setSelectedField] = useState<string>('');
  const [availableFields, setAvailableFields] = useState<CareerRecommendation[]>([]);
  const [progressData, setProgressData] = useState<ProgressData>({
    testCompleted: false,
    fieldSelected: false,
    coursesCompleted: 0,
    totalCourses: 10,
    chatSessions: 0,
    achievementPoints: 0,
    level: 1,
    nextLevelPoints: 100,
    currentLevelPoints: 0
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([]);

  // Helper function to convert score to 5-point scale if needed
  const convertToFivePointScale = (score: number): number => {
    // If score is already in 5-point scale (0-5), return as is
    if (score <= 5) {
      return Math.round(score * 10) / 10; // Round to 1 decimal place
    }
    // If score is in 100-point scale (0-100), convert to 5-point scale
    return Math.round((score / 100) * 5 * 10) / 10;
  };

  // Load user data and progress
  useEffect(() => {
    const loadData = async () => {
      setIsLoadingData(true);
      try {
        await loadUserData();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Load career recommendations when user data is loaded and test is completed
  useEffect(() => {
    if (userData?.id && hasCompletedTest && !selectedField) {
      console.log('Loading career recommendations...');
      loadCareerRecommendations();
    }
  }, [userData?.id, hasCompletedTest, selectedField]);





  const loadUserData = async () => {
    try {
      console.log('Loading user data...');
      
      // Get user email from session using NextAuth
      const sessionResponse = await fetch('/api/auth/session');
      console.log('Session response status:', sessionResponse.status);
      
      if (!sessionResponse.ok) {
        console.error('Session response not ok:', sessionResponse.status);
        const sessionError = await sessionResponse.json();
        console.error('Session error:', sessionError);
        return;
      }
      
      const sessionData = await sessionResponse.json();
      console.log('Session data:', sessionData);
      console.log('Session user:', sessionData.user);
      console.log('Session user email:', sessionData.user?.email);
      
      if (!sessionData.user?.email) {
        console.error('No user email in session - redirecting to login');
        window.location.href = '/auth/signin';
        return;
      }

      // Get user by email
      const userResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(sessionData.user.email)}`);
      console.log('User response status:', userResponse.status);
      
      if (userResponse.ok) {
        const data = await userResponse.json();
        console.log('User data loaded:', data);
        setUserData(data);
        
        // Only set selectedField if it's actually selected by user, not just from database
        const actualSelectedField = data.selectedField && data.selectedField.trim() !== '' ? data.selectedField : '';
        setSelectedField(actualSelectedField);
        console.log('Selected field from database:', data.selectedField, 'Actual selected field:', actualSelectedField);
        
        // Check test completion after user data is loaded
        const hasValidScores = data.oceanScores && 
          typeof data.oceanScores.openness === 'number' && 
          typeof data.oceanScores.conscientiousness === 'number' && 
          typeof data.oceanScores.extraversion === 'number' && 
          typeof data.oceanScores.agreeableness === 'number' && 
          typeof data.oceanScores.neuroticism === 'number';
        
        console.log('Checking OCEAN scores validity...');
        console.log('data.oceanScores:', data.oceanScores);
        console.log('typeof data.oceanScores:', typeof data.oceanScores);
        
        if (data.oceanScores) {
          console.log('OCEAN scores exist, checking individual scores:');
          console.log('openness:', data.oceanScores.openness, 'type:', typeof data.oceanScores.openness);
          console.log('conscientiousness:', data.oceanScores.conscientiousness, 'type:', typeof data.oceanScores.conscientiousness);
          console.log('extraversion:', data.oceanScores.extraversion, 'type:', typeof data.oceanScores.extraversion);
          console.log('agreeableness:', data.oceanScores.agreeableness, 'type:', typeof data.oceanScores.agreeableness);
          console.log('neuroticism:', data.oceanScores.neuroticism, 'type:', typeof data.oceanScores.neuroticism);
        } else {
          console.log('No OCEAN scores found in data');
        }
        
        if (hasValidScores) {
          setHasCompletedTest(true);
          console.log('✅ Test completed, ocean scores:', data.oceanScores);
        } else {
          setHasCompletedTest(false);
          console.log('❌ Latest OCEAN result found: false - No valid scores or test not completed');
          console.log('❌ hasValidScores evaluation result:', hasValidScores);
        }
        
        // Load other data that depends on user data
        if (data.id) {
          await loadProgressData(data.id);
          await loadRecentActivities(data.id);
          await loadAchievements(data.id);
          await loadCareerGoals(data.id);
        }
      } else {
        console.error('Failed to load user data:', userResponse.status);
        const errorData = await userResponse.json();
        console.error('Error data:', errorData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Kullanıcı bilgileri yüklenirken hata oluştu');
    }
  };

  const loadCareerRecommendations = async () => {
    try {
      if (userData?.id) {
        console.log('Loading career recommendations for user:', userData.id);
        
        // Simple fetch without complex error handling
        const response = await fetch('/api/user/career-recommendations');
        const data = await response.json();
        
        console.log('API Response:', data);
        
        if (data.success && data.data && data.data.recommendations) {
          setAvailableFields(data.data.recommendations);
          console.log('Career recommendations loaded:', data.data.recommendations.length);
        } else {
          console.log('No recommendations in response');
          setAvailableFields([]);
        }
      }
    } catch (error) {
      console.error('Error loading career recommendations:', error);
      setAvailableFields([]);
    }
  };

  const loadProgressData = async (userId?: string) => {
    try {
      const targetUserId = userId || userData?.id;
      if (targetUserId) {
        console.log('🔄 Loading progress data for user:', targetUserId);
        const response = await fetch(`/api/user/progress?userId=${targetUserId}`);
        console.log('📊 Progress response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Progress data received:', data);
          
          // Use selectedField from userData instead of state variable
          const actualSelectedField = !!(userData?.selectedField && userData.selectedField.trim() !== '');
          const updatedProgressData = {
            ...data,
            fieldSelected: actualSelectedField
          };
          console.log('📊 Setting progress data:', updatedProgressData);
          console.log('📊 Selected field check:', { 
            userDataSelectedField: userData?.selectedField, 
            actualSelectedField, 
            fieldSelected: actualSelectedField 
          });
          setProgressData(updatedProgressData);
        } else {
          console.error('❌ Failed to load progress data:', response.status);
          const actualSelectedField = !!(userData?.selectedField && userData.selectedField.trim() !== '');
          const fallbackData = {
            testCompleted: hasCompletedTest,
            fieldSelected: actualSelectedField,
            coursesCompleted: 0,
            totalCourses: 0,
            chatSessions: 0,
            achievementPoints: 0,
            level: 1,
            nextLevelPoints: 100,
            currentLevelPoints: 0
          };
          console.log('📊 Using fallback progress data:', fallbackData);
          setProgressData(fallbackData);
        }
      }
    } catch (error) {
      console.error('Error loading progress data:', error);
      const actualSelectedField = !!(userData?.selectedField && userData.selectedField.trim() !== '');
      setProgressData({
        testCompleted: hasCompletedTest,
        fieldSelected: actualSelectedField,
        coursesCompleted: 0,
        totalCourses: 0,
        chatSessions: 0,
        achievementPoints: 0,
        level: 1,
        nextLevelPoints: 100,
        currentLevelPoints: 0
      });
    }
  };

  const loadRecentActivities = async (userId?: string) => {
    try {
      const targetUserId = userId || userData?.id;
      if (targetUserId) {
        const response = await fetch(`/api/user/recent-activities?userId=${targetUserId}`);
        if (response.ok) {
          const activities = await response.json();
          
          // Convert API response to component format
          const formattedActivities: RecentActivity[] = activities.map((activity: any) => ({
            id: activity.id,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            timestamp: new Date(activity.timestamp),
            icon: getActivityIcon(activity.icon),
            color: activity.color
          }));
          
          setRecentActivities(formattedActivities);
        } else {
          console.error('Failed to load recent activities');
          setRecentActivities([]);
        }
      }
    } catch (error) {
      console.error('Error loading recent activities:', error);
      setRecentActivities([]);
    }
  };

  const loadAchievements = async (userId?: string) => {
    try {
      const targetUserId = userId || userData?.id;
      if (targetUserId) {
        const response = await fetch(`/api/user/achievements?userId=${targetUserId}`);
        if (response.ok) {
          const achievements = await response.json();
          
          // Convert API response to component format
          const formattedAchievements: Achievement[] = achievements.map((achievement: any) => ({
            id: achievement.id,
            title: achievement.title,
            description: achievement.description,
            icon: getAchievementIcon(achievement.icon),
            color: achievement.color,
            earned: achievement.earned,
            progress: achievement.progress,
            maxProgress: achievement.maxProgress
          }));
          
          setAchievements(formattedAchievements);
        } else {
          console.error('Failed to load achievements');
          setAchievements([]);
        }
      }
    } catch (error) {
      console.error('Error loading achievements:', error);
      setAchievements([]);
    }
  };

  // Helper functions to convert icon strings to React components
  const getActivityIcon = (iconName: string) => {
    switch (iconName) {
      case 'TestTube':
        return <TestTube className="w-4 h-4" />;
      case 'Target':
        return <Target className="w-4 h-4" />;
      case 'MessageSquare':
        return <MessageSquare className="w-4 h-4" />;
      case 'Award':
        return <Award className="w-4 h-4" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'TestTube':
        return <TestTube className="w-5 h-5" />;
      case 'Target':
        return <Target className="w-5 h-5" />;
      case 'MessageSquare':
        return <MessageSquare className="w-5 h-5" />;
      case 'Award':
        return <Award className="w-5 h-5" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5" />;
      default:
        return <Star className="w-5 h-5" />;
    }
  };

  const loadCareerGoals = async (userId?: string) => {
    try {
      const targetUserId = userId || userData?.id;
      if (targetUserId) {
        const response = await fetch(`/api/user/career-goals?userId=${targetUserId}`);
        if (response.ok) {
          const goals = await response.json();
          // Ensure goals are in the correct format
          const formattedGoals = Array.isArray(goals) ? goals.map(goal => ({
            ...goal,
            targetDate: new Date(goal.targetDate || Date.now())
          })) : [];
          setCareerGoals(formattedGoals);
        } else {
          console.error('Failed to load career goals:', response.status);
          setCareerGoals([]);
        }
      }
    } catch (error) {
      console.error('Error loading career goals:', error);
      setCareerGoals([]);
    }
  };

  const calculateAchievementPoints = async (userId: string): Promise<number> => {
    try {
      const response = await fetch(`/api/user/achievement-points?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.points || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error calculating achievement points:', error);
      return 0;
    }
  };

  const calculateCareerMatch = (scores: UserData['oceanScores'], selectedField: string): number => {
    if (!scores) return 50; // Default match if no scores available
    
    // Field-specific scoring based on OCEAN traits (converted to 5-point scale)
    const fieldRequirements: { [key: string]: { [key: string]: number } } = {
      'AI & Machine Learning': { openness: 4, conscientiousness: 3.5, extraversion: 2, agreeableness: 2.5, neuroticism: 1.5 },
      'Frontend Development': { openness: 3, conscientiousness: 3.5, extraversion: 2.5, agreeableness: 3, neuroticism: 2 },
      'Mobile Development': { openness: 3.25, conscientiousness: 3.75, extraversion: 3, agreeableness: 2.75, neuroticism: 1.75 },
      'Cybersecurity': { openness: 3.5, conscientiousness: 4, extraversion: 2, agreeableness: 2.25, neuroticism: 1.25 },
      'Data Engineering': { openness: 3.75, conscientiousness: 3.75, extraversion: 2.25, agreeableness: 2.5, neuroticism: 1.5 },
      'Backend Development': { openness: 3.25, conscientiousness: 3.75, extraversion: 2.25, agreeableness: 2.75, neuroticism: 1.75 },
      'Full Stack Development': { openness: 3.5, conscientiousness: 3.75, extraversion: 2.75, agreeableness: 3, neuroticism: 1.75 }
    };

    const requirements = fieldRequirements[selectedField];
    if (!requirements) return 50; // Default match for unknown fields

    let totalMatch = 0;
    let maxPossible = 0;

    Object.entries(requirements).forEach(([trait, requiredScore]) => {
      const userScore = convertToFivePointScale(scores[trait as keyof typeof scores] || 0);
      const match = Math.max(0, 5 - Math.abs(userScore - requiredScore));
      totalMatch += match;
      maxPossible += 5;
    });

    return Math.round((totalMatch / maxPossible) * 100);
  };

  const exportToPDF = async () => {
    if (!userData || !userData.oceanScores) {
      toast.error('OCEAN test sonuçları bulunamadı');
      return;
    }

    try {
      toast.loading('PDF hazırlanıyor...');
      
      // Create PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Header
      pdf.setFontSize(24);
      pdf.setTextColor(30, 30, 30);
      pdf.text('OCEAN Kişilik Analizi Raporu', pageWidth / 2, 30, { align: 'center' });
      
      // User info
      pdf.setFontSize(12);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Kullanıcı: ${userData.name}`, 20, 50);
      pdf.text(`Tarih: ${new Date().toLocaleDateString('tr-TR')}`, 20, 60);
      pdf.text(`Test Tarihi: ${userData.lastTestDate ? new Date(userData.lastTestDate).toLocaleDateString('tr-TR') : 'Belirtilmemiş'}`, 20, 70);
      
      // OCEAN Scores
      pdf.setFontSize(16);
      pdf.setTextColor(30, 30, 30);
      pdf.text('OCEAN Kişilik Skorları', 20, 95);
      
      const traits = [
        { key: 'openness', label: 'Açıklık', description: 'Yeni deneyimlere açıklık ve yaratıcılık' },
        { key: 'conscientiousness', label: 'Sorumluluk', description: 'Düzenlilik, disiplin ve güvenilirlik' },
        { key: 'extraversion', label: 'Dışadönüklük', description: 'Sosyal etkileşim ve enerji seviyesi' },
        { key: 'agreeableness', label: 'Uyumluluk', description: 'İşbirliği ve empati yeteneği' },
        { key: 'neuroticism', label: 'Nörotizm', description: 'Duygusal kararlılık ve stres yönetimi' }
      ];
      
      let yPosition = 110;
      traits.forEach((trait) => {
        const score = convertToFivePointScale(userData.oceanScores![trait.key as keyof typeof userData.oceanScores]);
        
        pdf.setFontSize(14);
        pdf.setTextColor(30, 30, 30);
        pdf.text(`${trait.label}: ${score}/5`, 25, yPosition);
        
        pdf.setFontSize(10);
        pdf.setTextColor(80, 80, 80);
        pdf.text(trait.description, 25, yPosition + 8);
        
        // Progress bar
        const barWidth = 100;
        const barHeight = 4;
        const barX = pageWidth - barWidth - 25;
        const barY = yPosition - 3;
        
        // Background
        pdf.setFillColor(230, 230, 230);
        pdf.rect(barX, barY, barWidth, barHeight, 'F');
        
        // Progress
        pdf.setFillColor(59, 130, 246);
        pdf.rect(barX, barY, (score / 5) * barWidth, barHeight, 'F');
        
        yPosition += 25;
      });
      
      // Career recommendations
      if (userData?.careerRecommendations && userData.careerRecommendations.length > 0) {
        yPosition += 20;
        pdf.setFontSize(16);
        pdf.setTextColor(30, 30, 30);
        pdf.text('Kariyer Önerileri', 20, yPosition);
        yPosition += 15;
        
        userData.careerRecommendations.slice(0, 3).forEach((rec, index) => {
          pdf.setFontSize(12);
          pdf.setTextColor(30, 30, 30);
          pdf.text(`${index + 1}. ${rec.field}`, 25, yPosition);
          
          pdf.setFontSize(10);
          pdf.setTextColor(80, 80, 80);
          const confidence = Math.round(rec.confidence * 100);
          pdf.text(`Uyum: %${confidence}`, 25, yPosition + 8);
          
          // Wrap description text
          const description = rec.reasoning || '';
          const splitDescription = pdf.splitTextToSize(description, pageWidth - 50);
          pdf.text(splitDescription.slice(0, 2), 25, yPosition + 16); // Max 2 lines
          
          yPosition += 35;
        });
      }
      
      // Footer
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text('Bu rapor Nebula Nexus AI sistemi tarafından oluşturulmuştur.', pageWidth / 2, pageHeight - 15, { align: 'center' });
      
      // Save PDF
      const fileName = `OCEAN_Raporu_${userData.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      toast.dismiss();
      toast.success('PDF başarıyla indirildi!');
      
    } catch (error) {
      console.error('PDF export error:', error);
      toast.dismiss();
      toast.error('PDF oluşturulurken hata oluştu');
    }
  };

  const generateFieldRecommendations = async (scores: UserData['oceanScores']) => {
    try {
      // Use Gemini analysis for recommendations
      const analysisResponse = await fetch('/api/ocean/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oceanScores: scores,
          userId: user?.id
        }),
      });

      if (analysisResponse.ok) {
        const analysis = await analysisResponse.json();
        if (analysis.analysis && analysis.analysis.topRecommendations) {
          return analysis.analysis.topRecommendations.map((rec: { field: { name: string } }) => rec.field.name);
        }
      }
      
      // If Gemini analysis fails, return empty array - no fallback recommendations
      console.warn('Gemini analysis failed, no recommendations available');
      return [];
    } catch (error) {
      console.error('Error getting Gemini recommendations:', error);
      return [];
    }
  };

  // Enhanced field selection
  const handleFieldSelection = async (field: string) => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          selectedField: field
        })
      });

      if (response.ok) {
        // Activity log oluştur
        try {
          await fetch('/api/user/activity-log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: user?.id,
              type: 'field_selected',
              title: 'Kariyer Alanı Seçildi',
              description: `${field} alanını seçtiniz ve kariyer yolculuğunuza başladınız.`,
              data: JSON.stringify({ selectedField: field })
            })
          });
        } catch (activityError) {
          console.error('Error creating activity log:', activityError);
        }

        setSelectedField(field);
        setUserData(prev => prev ? { ...prev, selectedField: field } : null);
        setProgressData(prev => ({ ...prev, fieldSelected: true, achievementPoints: prev.achievementPoints + 30 }));
        toast.success(`${field} alanını seçtin! Kariyer yol haritasına yönlendiriliyorsunuz...`);
        
        // Reload data after field selection
        loadRecentActivities();
        loadAchievements();
        loadCareerGoals();
        
        // Redirect to career roadmap after a short delay
        setTimeout(() => {
          window.location.href = '/career-roadmap';
        }, 2000);
      }
    } catch (error) {
      console.error('Error updating field selection:', error);
      toast.error('Alan seçimi kaydedilirken hata oluştu');
    }
  };

  const getLevelColor = (level: number) => {
    if (level >= 10) return 'from-purple-500 to-pink-500';
    if (level >= 5) return 'from-blue-500 to-cyan-500';
    if (level >= 3) return 'from-green-500 to-emerald-500';
    return 'from-yellow-500 to-orange-500';
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return 'Uzman';
    if (level >= 5) return 'Gelişmiş';
    if (level >= 3) return 'Orta';
    return 'Başlangıç';
  };

  const getStatusColor = (status: CareerGoal['status']) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-blue-400';
      case 'not_started': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: CareerGoal['status']) => {
    switch (status) {
      case 'completed': return 'Tamamlandı';
      case 'in_progress': return 'Devam Ediyor';
      case 'not_started': return 'Başlanmadı';
      default: return 'Bilinmiyor';
    }
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
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Hoş Geldiniz!</h2>
          <p className="text-purple-200 mb-8">Dashboard&apos;a erişmek için lütfen giriş yapın.</p>
          <a href="/auth/signin" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl">
            Giriş Yap
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">




      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                Dashboard
              </h1>
              <p className="text-purple-200 text-lg">Hoş geldin, {userData?.name || user?.name}! 👋</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/">
                <button className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span>Ana Sayfa</span>
                </button>
              </Link>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                {userData?.image ? (
                  <img src={userData.image} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-white" />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Access Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link href="/test">
              <motion.div 
                className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-6 hover:from-blue-500/30 hover:to-cyan-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <TestTube className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Yeni Test Al</h3>
                    <p className="text-blue-200 text-sm">Kişilik analizi güncelle</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/chat">
              <motion.div 
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl border border-purple-400/30 p-6 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">AI Danışman</h3>
                    <p className="text-purple-200 text-sm">Kişisel rehberlik al</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/career-roadmap">
              <motion.div 
                className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 hover:from-green-500/30 hover:to-emerald-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Kariyer Yolu</h3>
                    <p className="text-green-200 text-sm">Detaylı yol haritası</p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/resources">
              <motion.div 
                className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 p-6 hover:from-orange-500/30 hover:to-red-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Eğitim Önerileri</h3>
                    <p className="text-orange-200 text-sm">
                      {selectedField ? `${selectedField} alanında kurslar` : 'Kişiselleştirilmiş kurslar'}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            <Link href="/projects">
              <motion.div 
                className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl border border-indigo-400/30 p-6 hover:from-indigo-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Proje Dayanışması</h3>
                    <p className="text-indigo-200 text-sm">Ekip kur, iş ilanı ver</p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* OCEAN Scores Widget and Career Match */}


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className={`w-16 h-16 bg-gradient-to-r ${getLevelColor(progressData.level)} rounded-2xl flex items-center justify-center mr-4`}>
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Seviye {progressData.level}</h3>
                  <p className="text-purple-200">{getLevelTitle(progressData.level)}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{progressData.achievementPoints}</div>
                <div className="text-purple-200">Toplam Puan</div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-purple-200 mb-2">
                <span>Seviye İlerlemesi</span>
                <span>{progressData.currentLevelPoints}/{progressData.nextLevelPoints}</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(progressData.currentLevelPoints / progressData.nextLevelPoints) * 100}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className={`h-3 rounded-full bg-gradient-to-r ${getLevelColor(progressData.level)}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: TestTube, label: 'Test', value: progressData.testCompleted ? 'Tamamlandı' : 'Bekliyor', color: progressData.testCompleted ? 'text-green-400' : 'text-yellow-400' },
                { icon: TargetIcon, label: 'Alan', value: progressData.fieldSelected ? 'Seçildi' : 'Bekliyor', color: progressData.fieldSelected ? 'text-green-400' : 'text-yellow-400' },
                { icon: BookOpen, label: 'Eğitimler', value: `${progressData.coursesCompleted}/${progressData.totalCourses}`, color: 'text-blue-400' },
                { icon: Activity, label: 'Chat', value: `${progressData.chatSessions}`, color: 'text-purple-400' }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2">
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className="text-sm text-purple-200">{stat.label}</div>
                  <div className={`font-semibold ${stat.color}`}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          {!hasCompletedTest ? (
            <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-yellow-300 mb-2">
                    Test Tamamlanmadı
                  </h3>
                  <p className="text-yellow-200 mb-4">
                    AI chat özelliğini kullanabilmek için önce OCEAN kişilik testini tamamlamanız gerekiyor.
                  </p>
                  <a 
                    href="/test" 
                    className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <TestTube className="w-5 h-5 mr-2" />
                    Testi Çöz
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 backdrop-blur-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-green-300 mb-2">
                    Test Tamamlandı ✓
                  </h3>
                  <p className="text-green-200 mb-4">
                    OCEAN testiniz tamamlandı. Şimdi kariyer alanınızı seçebilir ve AI ile konuşabilirsiniz.
                  </p>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {hasCompletedTest && (
          <>
            {/* Test Sonuçları Bölümü */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mr-4">
                    <TestTube className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">OCEAN Test Sonuçları</h3>
                  </div>
                  <button
                    onClick={exportToPDF}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 hover:scale-105"
                    title="PDF olarak indir"
                  >
                    <Download className="w-4 h-4" />
                    <span>PDF İndir</span>
                  </button>
                </div>
                
                {userData?.oceanScores ? (
                  <>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {[
                      { key: 'openness', label: 'Açıklık', color: 'from-blue-500 to-cyan-500' },
                      { key: 'conscientiousness', label: 'Sorumluluk', color: 'from-green-500 to-emerald-500' },
                      { key: 'extraversion', label: 'Dışadönüklük', color: 'from-yellow-500 to-orange-500' },
                      { key: 'agreeableness', label: 'Uyumluluk', color: 'from-purple-500 to-pink-500' },
                        { key: 'neuroticism', label: 'Nörotizm', color: 'from-red-500 to-pink-500' }
                    ].map((trait) => (
                      <div key={trait.key} className="text-center">
                        <div className={`w-16 h-16 bg-gradient-to-r ${trait.color} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                          <span className="text-white font-bold text-lg">
                              {convertToFivePointScale(userData.oceanScores![trait.key as keyof typeof userData.oceanScores])}
                          </span>
                        </div>
                        <div className="text-sm text-purple-200 mb-1">{trait.label}</div>
                        <div className="w-full bg-white/20 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full bg-gradient-to-r ${trait.color}`}
                              style={{ width: `${(convertToFivePointScale(userData?.oceanScores?.[trait.key as keyof typeof userData.oceanScores] || 0) / 5) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                    
                    {/* Interactive Radar Chart */}
                    <div className="mt-8">
                      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                        <h4 className="text-lg font-semibold text-white mb-4 text-center">
                          Detaylı Kişilik Analizi
                        </h4>
                        <div className="h-80 relative">
                          <Radar 
                            data={{
                              labels: [
                                'Açıklık',
                                'Sorumluluk', 
                                'Dışadönüklük',
                                'Uyumluluk',
                                'Nörotizm'
                              ],
                              datasets: [{
                                label: 'OCEAN Skorlarınız',
                                data: [
                                  convertToFivePointScale(userData.oceanScores.openness),
                                  convertToFivePointScale(userData.oceanScores.conscientiousness),
                                  convertToFivePointScale(userData.oceanScores.extraversion),
                                  convertToFivePointScale(userData.oceanScores.agreeableness),
                                  convertToFivePointScale(userData.oceanScores.neuroticism)
                                ],
                                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                                borderColor: 'rgba(147, 51, 234, 0.8)',
                                borderWidth: 2,
                                pointBackgroundColor: 'rgba(147, 51, 234, 1)',
                                pointBorderColor: '#fff',
                                pointRadius: 4,
                              }]
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                r: {
                                  beginAtZero: true,
                                  max: 5,
                                  min: 0,
                                  ticks: {
                                    stepSize: 1,
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    backdropColor: 'transparent',
                                  },
                                  grid: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                  },
                                  angleLines: {
                                    color: 'rgba(255, 255, 255, 0.1)',
                                  },
                                  pointLabels: {
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                      size: 12,
                                      weight: 500,
                                    },
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  position: 'bottom' as const,
                                  labels: {
                                    color: 'rgba(255, 255, 255, 0.8)',
                                    font: {
                                      size: 12,
                                    },
                                  },
                                },
                                tooltip: {
                                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                  titleColor: 'white',
                                  bodyColor: 'white',
                                  borderColor: 'rgba(147, 51, 234, 0.5)',
                                  borderWidth: 1,
                                },
                              },
                            }}
                          />
                        </div>
                      </div>
                  </div>
                  
                  {userData.lastTestDate && (
                    <div className="mt-4 text-center">
                      <p className="text-purple-300 text-sm">
                        Test Tarihi: {new Date(userData.lastTestDate).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  )}
                  </>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <AlertCircle className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-gray-300 font-semibold mb-2">Test Sonuçları Bulunamadı</p>
                    <p className="text-gray-400 text-sm">
                      Test sonuçlarınız yüklenemedi. Lütfen sayfayı yenileyin.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Kariyer Alanı Seçimi Bölümü */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-8"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white">AI Kariyer Önerileri</h3>
                </div>
              
              {selectedField ? (
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-blue-200 font-semibold text-lg">Seçili Alan: {selectedField}</span>
                    </div>
                    <Link href="/career-roadmap">
                      <button className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm">
                        Kariyer Yoluna Başla
                      </button>
                    </Link>
                  </div>
                  <p className="text-blue-300 text-sm mt-2 ml-11">
                    AI chat&apos;te bu alan hakkında detaylı konuşabilir, kariyer yol haritasını görüntüleyebilir veya eğitim önerilerini alabilirsiniz.
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 mb-6">
                    <div className="flex items-start">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-blue-200 font-medium mb-1">AI Kariyer Analizi</p>
                        <p className="text-blue-300 text-sm">
                          OCEAN test sonuçlarınıza göre AI'ın analiz ettiği ve önerdiği kariyer alanları. Her alanın yanında uyum yüzdesi gösterilmektedir. Size en uygun alanı seçerek kariyer yolculuğunuza başlayabilirsiniz.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {isLoadingData ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
                      <p className="text-cyan-300">AI kariyer önerilerinizi analiz ediyor...</p>
                      <p className="text-cyan-200 text-sm mt-2">Bu işlem birkaç saniye sürebilir</p>
                    </div>
                  ) : availableFields.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {availableFields
                        .sort((a, b) => b.confidence - a.confidence)
                        .map((recommendation, index) => (
                        <motion.button
                          key={recommendation.id}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleFieldSelection(recommendation.field)}
                          className="p-6 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 text-left backdrop-blur-sm relative"
                        >
                          <div className="absolute top-2 right-2 w-6 h-6 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                            #{index + 1}
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                                <GraduationCap className="w-5 h-5 text-white" />
                              </div>
                              <span className="font-semibold text-white text-lg">{recommendation.field}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-400">{Math.round(recommendation.confidence * 100)}%</div>
                              <div className="text-xs text-purple-300">Uyum</div>
                            </div>
                          </div>
                          <p className="text-purple-200 text-sm line-clamp-2">
                            {recommendation.reasoning}
                          </p>
                          <div className="mt-3 flex items-center justify-between">
                            <div className="w-full bg-white/20 rounded-full h-2 mr-3">
                              <div 
                                className="h-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                                style={{ width: `${Math.round(recommendation.confidence * 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-purple-300 whitespace-nowrap">
                              {Math.round(recommendation.confidence * 100)}%
                            </span>
                          </div>
                          <div className="mt-3 text-center">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 text-sm w-full flex items-center justify-center space-x-2 cursor-pointer">
                              <CheckCircle className="w-4 h-4" />
                              <span>Bu Alanı Seç</span>
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertCircle className="w-8 h-8 text-white" />
                      </div>
                      <p className="text-red-300 font-semibold mb-2">Kariyer Önerileri Yüklenemedi</p>
                      <p className="text-red-200 text-sm mb-4">
                        AI'ın test sonuçlarınıza göre kariyer önerileri oluşturulamadı. Bu durum genellikle test sonuçlarının henüz işlenmemiş olmasından kaynaklanır.
                      </p>
                      <div className="space-y-3">
                      <button
                        onClick={() => {
                          loadCareerRecommendations();
                          toast.success('Kariyer önerileri yeniden yükleniyor...');
                        }}
                          className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 mr-3"
                      >
                        Yeniden Dene
                      </button>
                        <Link href="/test">
                          <button className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300">
                            Testi Tekrar Çöz
                          </button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Progress Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-4">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">İlerleme Takibi</h3>
                <p className="text-purple-200 ml-2">Kariyer yolculuğunuzdaki gelişiminizi takip edin</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{progressData.testCompleted ? 1 : 0}</div>
                  <div className="text-sm text-purple-200">Tamamlanan Test</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <MessageSquare className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{progressData.chatSessions || 0}</div>
                  <div className="text-sm text-purple-200">Chat Oturumu</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{progressData.coursesCompleted || 0}</div>
                  <div className="text-sm text-purple-200">Tamamlanan Kurs</div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-white">{achievements.filter(a => a.earned).length}</div>
                  <div className="text-sm text-purple-200">Kazanılan Rozet</div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-lg font-semibold text-white">Seviye {progressData.level || 1}</div>
                    <div className="text-sm text-purple-200">Mevcut Seviye</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{progressData.achievementPoints || 0}</div>
                    <div className="text-sm text-purple-200">Toplam Puan</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-white">{progressData.fieldSelected ? 'Seçildi' : 'Bekliyor'}</div>
                    <div className="text-sm text-purple-200">Alan Seçimi</div>
                  </div>
                </div>
              </div>

              {/* Skill Progress Chart */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                  Beceri Gelişimi
                </h4>
                
                <div className="h-64">
                  <Line
                    data={{
                      labels: ['Başlangıç', '1. Hafta', '2. Hafta', '3. Hafta', '1. Ay', '2. Ay', '3. Ay'],
                      datasets: [
                        {
                          label: 'Teknik Beceriler',
                          data: [
                            progressData.testCompleted ? 15 : 0,
                            progressData.coursesCompleted > 0 ? 25 : 15,
                            progressData.coursesCompleted > 1 ? 40 : 25,
                            progressData.coursesCompleted > 2 ? 55 : 40,
                            progressData.coursesCompleted > 3 ? 70 : 55,
                            progressData.coursesCompleted > 4 ? 80 : 70,
                            progressData.coursesCompleted > 5 ? 90 : 80
                          ],
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                          borderWidth: 2,
                        },
                        {
                          label: 'Soft Skills',
                          data: [
                            progressData.chatSessions > 0 ? 20 : 0,
                            progressData.chatSessions > 2 ? 30 : 20,
                            progressData.chatSessions > 5 ? 45 : 30,
                            progressData.chatSessions > 8 ? 55 : 45,
                            progressData.chatSessions > 10 ? 65 : 55,
                            progressData.chatSessions > 15 ? 75 : 65,
                            progressData.chatSessions > 20 ? 85 : 75
                          ],
                          borderColor: 'rgb(34, 197, 94)',
                          backgroundColor: 'rgba(34, 197, 94, 0.1)',
                          tension: 0.4,
                          fill: true,
                          borderWidth: 2,
                        },
                        {
                          label: 'Proje Deneyimi',
                          data: [
                            progressData.fieldSelected ? 10 : 0,
                            progressData.achievementPoints > 10 ? 20 : 10,
                            progressData.achievementPoints > 30 ? 35 : 20,
                            progressData.achievementPoints > 50 ? 50 : 35,
                            progressData.achievementPoints > 80 ? 65 : 50,
                            progressData.achievementPoints > 120 ? 80 : 65,
                            progressData.achievementPoints > 200 ? 95 : 80
                          ],
                          borderColor: 'rgb(168, 85, 247)',
                          backgroundColor: 'rgba(168, 85, 247, 0.1)',
                          tension: 0.4,
                          fill: true,
                          borderWidth: 2,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          labels: {
                            color: 'white',
                            usePointStyle: true,
                            padding: 15,
                            font: {
                              size: 12
                            }
                          }
                        },
                        tooltip: {
                          backgroundColor: 'rgba(17, 24, 39, 0.9)',
                          titleColor: 'white',
                          bodyColor: 'white',
                          borderColor: 'rgba(255, 255, 255, 0.2)',
                          borderWidth: 1,
                          callbacks: {
                            label: function(context) {
                              return `${context.dataset.label}: %${context.parsed.y}`;
                            }
                          }
                        }
                      },
                      scales: {
                        x: {
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                          },
                          ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                              size: 11
                            }
                          }
                        },
                        y: {
                          beginAtZero: true,
                          max: 100,
                          grid: {
                            color: 'rgba(255, 255, 255, 0.1)',
                          },
                          ticks: {
                            color: 'rgba(255, 255, 255, 0.7)',
                            font: {
                              size: 11
                            },
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                        }
                      },
                      interaction: {
                        intersect: false,
                        mode: 'index'
                      }
                    }}
                  />
                </div>
                
                {/* Skill Progress Summary */}
                <div className="mt-4 grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <div className="text-2xl font-bold text-blue-400">
                      {progressData.coursesCompleted > 0 ? Math.min(90, 15 + (progressData.coursesCompleted * 15)) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Teknik</div>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <div className="text-2xl font-bold text-green-400">
                      {progressData.chatSessions > 0 ? Math.min(85, 20 + (progressData.chatSessions * 3)) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Soft Skills</div>
                  </div>
                  <div className="text-center p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <div className="text-2xl font-bold text-purple-400">
                      {progressData.achievementPoints > 0 ? Math.min(95, 10 + (progressData.achievementPoints * 0.4)) : 0}%
                    </div>
                    <div className="text-sm text-gray-400">Proje</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Son Aktiviteler */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mr-4">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Son Aktiviteler</h3>
              </div>
              
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center p-4 bg-white/5 rounded-xl">
                      <div className={`w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center mr-4 ${activity.color}`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-semibold">{activity.title}</h4>
                        <p className="text-purple-200 text-sm">{activity.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-purple-300 text-xs">
                          {activity.timestamp.toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                    <p className="text-purple-200">Henüz aktivite yok</p>
                    <p className="text-purple-300 text-sm">Test çözerek ve AI ile konuşarak aktiviteler oluşturun</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Başarı Rozetleri */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
              <div className="flex items-center mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mr-4">
                  <Award className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white">Başarı Rozetleri</h3>
              </div>
              
              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className={`p-4 rounded-xl border ${achievement.earned ? 'bg-white/10 border-green-500/30' : 'bg-white/5 border-white/10'}`}>
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${achievement.earned ? 'bg-green-500/20' : 'bg-white/10'}`}>
                        <div className={achievement.color}>
                          {achievement.icon}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${achievement.earned ? 'text-white' : 'text-gray-400'}`}>
                          {achievement.title}
                        </h4>
                        <p className={`text-sm ${achievement.earned ? 'text-green-200' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                        {achievement.progress !== undefined && achievement.maxProgress !== undefined && (
                          <div className="mt-2">
                            <div className="flex justify-between text-xs text-purple-200 mb-1">
                              <span>İlerleme</span>
                              <span>{achievement.progress}/{achievement.maxProgress}</span>
                            </div>
                            <div className="w-full bg-white/20 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${achievement.earned ? 'bg-green-500' : 'bg-purple-500'}`}
                                style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      {achievement.earned && (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Kariyer Hedefleri */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mr-4">
                <TargetIcon2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Kariyer Hedefleri</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {careerGoals.map((goal) => (
                <div key={goal.id} className="p-6 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-white font-semibold">{goal.title}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(goal.status)} bg-white/10`}>
                      {getStatusText(goal.status)}
                    </span>
                  </div>
                  <p className="text-purple-200 text-sm mb-4">{goal.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-purple-200 mb-1">
                      <span>İlerleme</span>
                      <span>{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${goal.status === 'completed' ? 'bg-green-500' : goal.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-500'}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center text-xs text-purple-300">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Hedef: {goal.targetDate.toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {[
            { 
              icon: Brain, 
              title: 'Test Durumu', 
              value: hasCompletedTest ? 'Tamamlandı' : 'Bekliyor', 
              color: hasCompletedTest ? 'from-green-500 to-emerald-500' : 'from-yellow-500 to-orange-500',
              bgColor: hasCompletedTest ? 'from-green-500/20 to-emerald-500/20' : 'from-yellow-500/20 to-orange-500/20'
            },
            { 
              icon: Target, 
              title: 'Alan Seçimi', 
              value: selectedField ? 'Seçildi' : 'Bekliyor', 
              color: selectedField ? 'from-blue-500 to-cyan-500' : 'from-yellow-500 to-orange-500',
              bgColor: selectedField ? 'from-blue-500/20 to-cyan-500/20' : 'from-yellow-500/20 to-orange-500/20'
            },
            { 
              icon: BookOpen, 
              title: 'Eğitimler', 
              value: `${progressData.coursesCompleted}/${progressData.totalCourses}`, 
              color: 'from-purple-500 to-pink-500',
              bgColor: 'from-purple-500/20 to-pink-500/20'
            },
            { 
              icon: Award, 
              title: 'Başarı Puanı', 
              value: `${progressData.achievementPoints} Puan`, 
              color: 'from-indigo-500 to-purple-500',
              bgColor: 'from-indigo-500/20 to-purple-500/20'
            }
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className={`bg-gradient-to-r ${stat.bgColor} backdrop-blur-sm border border-white/20 rounded-2xl p-6`}
            >
              <div className="flex items-center">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mr-4`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-purple-200 text-sm font-medium">{stat.title}</p>
                  <p className="text-white text-xl font-bold">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {[
            { 
              icon: BookOpen, 
              title: 'Test Çöz', 
              description: 'OCEAN kişilik testini çözün',
              href: '/test',
              color: 'from-blue-500 to-cyan-500',
              disabled: false
            },
            { 
              icon: Target, 
              title: 'AI Chat', 
              description: 'Kariyer danışmanı ile konuşun',
              href: '/chat',
              color: 'from-purple-500 to-pink-500',
              disabled: !hasCompletedTest || !selectedField
            },
            { 
              icon: TrendingUp, 
              title: 'Eğitimler', 
              description: 'Önerilen eğitimleri görün',
              href: '/resources',
              color: 'from-green-500 to-emerald-500',
              disabled: !hasCompletedTest || !selectedField
            }
          ].map((action, index) => (
            <Link href={action.href} key={index}>
              <motion.div
                whileHover={{ scale: action.disabled ? 1 : 1.02 }}
                whileTap={{ scale: action.disabled ? 1 : 0.98 }}
                className={`bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                  action.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20 hover:shadow-xl'
                }`}
              >
              <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mb-6`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{action.title}</h3>
              <p className="text-purple-200 text-sm mb-4">{action.description}</p>
              {action.disabled ? (
                <div className="text-red-400 text-sm bg-red-500/20 p-3 rounded-lg">
                  {!hasCompletedTest ? 'Önce test çözün' : 'Önce alan seçin'}
                </div>
              ) : (
                <div className="flex items-center text-white font-medium">
                  Başla
                  <div className="w-4 h-4 ml-2">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              )}
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
}