'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { oceanQuestions } from '@/data/ocean-questions';
import { onetQuestions } from '@/data/onet-questions';
import { useAuth } from '@/contexts/AuthContext';
import { useNotificationManager } from '@/components/ui/NotificationSystem';
import { 
  ChevronRight, 
  ChevronLeft, 
  BarChart, 
  PieChart,
  TargetIcon,
  BookOpen,
  MessageSquare,
  Brain,
  Award,
  TrendingUp,
  Users,
  Zap,
  Code,
  Rocket,
  CheckCircle
} from 'lucide-react';

type TabType = 'test' | 'onet' | 'personality' | 'career' | 'recommendations';

interface CareerRecommendation {
  field: string;
  confidence: number;
  reasoning: string;
  learningPath: string;
  nextSteps: string;
}

interface OceanQuestion {
  id: string;
  text: string;
  category: string;
  reverse?: boolean;
}

interface OnetQuestion {
  id: number;
  text: string;
  category: string;
  options: Array<{
    value: number;
    text: string;
  }>;
}

export default function TestPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { addNotification } = useNotificationManager();
  
  // Test states
  const [currentTab, setCurrentTab] = useState<TabType>('test');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [onetAnswers, setOnetAnswers] = useState<number[]>([]);
  const [isTestLoading, setIsTestLoading] = useState(false);
  const [testStartTime, setTestStartTime] = useState<Date | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [showPersonalityReport, setShowPersonalityReport] = useState(false);
  const [isOceanCompleted, setIsOceanCompleted] = useState(false);
  const [oceanScores, setOceanScores] = useState<any>(null);
  const [onetScores, setOnetScores] = useState<any>(null);
  const [careerRecommendations, setCareerRecommendations] = useState<CareerRecommendation[]>([]);

  // Load test data
  useEffect(() => {
    if (isAuthenticated && user && !isLoading) {
      // Check if user has already completed the test
      checkTestCompletion();
    }
  }, [isAuthenticated, user, isLoading]);

  const checkTestCompletion = async () => {
    try {
      // Önce session'dan kullanıcı bilgilerini al
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        console.error('Session response not ok:', sessionResponse.status);
        return;
      }
      
      const sessionData = await sessionResponse.json();
      console.log('Test page - Session data:', sessionData);
      
      if (!sessionData.user?.email) {
        console.error('No user email in session');
        return;
      }

      // Email ile kullanıcıyı bul
      const response = await fetch(`/api/user/profile?email=${encodeURIComponent(sessionData.user.email)}`);
      const data = await response.json();
      
      if (data.oceanScores) {
        setOceanScores(data.oceanScores);
        setIsOceanCompleted(true);
        setCurrentTab('personality');
        addNotification({
          type: 'warning',
          title: 'Test Zaten Tamamlandı',
          message: 'OCEAN testinizi zaten tamamladınız. Testi silmek ve yeniden başlamak istiyorsanız aşağıdaki butona tıklayın.',
          duration: 0 // Süresiz göster
        });
      }
    } catch (error) {
      console.error('Error checking test completion:', error);
    }
  };

  const resetTest = async () => {
    try {
      const response = await fetch('/api/user/test-history', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?.id })
      });

      if (response.ok) {
        setOceanScores(null);
        setIsOceanCompleted(false);
        setCurrentTab('test');
        setCurrentQuestion(0);
        setAnswers([]);
        setOnetAnswers([]);
        setTestResult(null);
        setShowPersonalityReport(false);
        addNotification({
          type: 'success',
          title: 'Test Sıfırlandı',
          message: 'OCEAN testiniz başarıyla silindi. Artık testi yeniden çözebilirsiniz.',
          duration: 5000
        });
      } else {
        addNotification({
          type: 'warning',
          title: 'Hata',
          message: 'Test silinirken bir hata oluştu. Lütfen tekrar deneyin.',
          duration: 5000
        });
      }
    } catch (error) {
      console.error('Error resetting test:', error);
      addNotification({
        type: 'warning',
        title: 'Hata',
        message: 'Test silinirken bir hata oluştu. Lütfen tekrar deneyin.',
        duration: 5000
      });
    }
  };

  const handleAnswer = (answer: number) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);
    
    if (currentQuestion < oceanQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // OCEAN test completed
      const scores = calculateOceanScores(newAnswers, oceanQuestions);
      setOceanScores(scores);
      setIsOceanCompleted(true);
      setCurrentTab('onet');
      setCurrentQuestion(0);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      // Remove the last answer when going back
      if (currentTab === 'test') {
        setAnswers(answers.slice(0, -1));
      } else if (currentTab === 'onet') {
        setOnetAnswers(onetAnswers.slice(0, -1));
      }
    }
  };

  const handleOnetAnswer = (answer: number) => {
    const newOnetAnswers = [...onetAnswers, answer];
    setOnetAnswers(newOnetAnswers);
    
    if (currentQuestion < onetQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // O*NET test completed
      const scores = calculateOnetScores(newOnetAnswers);
      setOnetScores(scores);
      finishBothTests();
    }
  };

  const calculateOceanScores = (answers: number[], questions: OceanQuestion[]) => {
    const scores = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    const categoryCounts = {
      openness: 0,
      conscientiousness: 0,
      extraversion: 0,
      agreeableness: 0,
      neuroticism: 0
    };

    answers.forEach((answer, index) => {
      const question = questions[index];
      if (question && question.category) {
        const trait = question.category as keyof typeof scores;
        const isReverse = question.reverse || false;
        
        // Reverse scoring: 1->5, 2->4, 3->3, 4->2, 5->1
        const finalAnswer = isReverse ? (6 - answer) : answer;
        
        scores[trait] += finalAnswer;
        categoryCounts[trait]++;
      }
    });

    // Calculate averages (keep on 1-5 scale, don't convert to 0-100)
    Object.keys(scores).forEach(category => {
      const count = categoryCounts[category as keyof typeof categoryCounts];
      if (count > 0) {
        scores[category as keyof typeof scores] = Math.round((scores[category as keyof typeof scores] / count) * 10) / 10;
      }
    });

    return scores;
  };

  const calculateOnetScores = (answers: number[]) => {
    const scores = {
      technical: 0,
      soft: 0,
      work_style: 0,
      work_context: 0
    };

    const categoryCounts = {
      technical: 0,
      soft: 0,
      work_style: 0,
      work_context: 0
    };

    answers.forEach((answer, index) => {
      const question = onetQuestions[index];
      if (question && question.category) {
        const category = question.category as keyof typeof scores;
        scores[category] += answer;
        categoryCounts[category]++;
      }
    });

    // Calculate averages
    Object.keys(scores).forEach(category => {
      const count = categoryCounts[category as keyof typeof categoryCounts];
      if (count > 0) {
        scores[category as keyof typeof scores] = Math.round((scores[category as keyof typeof scores] / count) * 10) / 10;
      }
    });

    return scores;
  };

  const finishBothTests = async () => {
    setIsTestLoading(true);
    try {
      console.log('🚀 Starting finishBothTests...');
      
      // Önce session'dan kullanıcı bilgilerini al
      const sessionResponse = await fetch('/api/auth/session');
      if (!sessionResponse.ok) {
        console.error('Session response not ok:', sessionResponse.status);
        return;
      }
      
      const sessionData = await sessionResponse.json();
      console.log('Test page - Session data:', sessionData);
      
      if (!sessionData.user?.email) {
        console.error('No user email in session');
        return;
      }

      // Email ile kullanıcıyı bul
      const userResponse = await fetch(`/api/user/profile?email=${encodeURIComponent(sessionData.user.email)}`);
      const userData = await userResponse.json();
      
      if (!userData.id) {
        console.error('No user ID found');
        return;
      }

      console.log('User ID:', userData.id);
      console.log('OCEAN Scores:', oceanScores);
      console.log('ONET Scores:', onetScores);
      console.log('Answers:', answers);
      console.log('ONET Answers:', onetAnswers);
      
      // Save OCEAN results with correct field names
      const oceanResponse = await fetch('/api/ocean/save-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.id,
          scores: oceanScores,           // ✅ 'scores' field name
          answers: answers,              // ✅ add answers
          onetScores: onetScores,
          onetAnswers: onetAnswers,      // ✅ add onetAnswers
          testDuration: testStartTime ? Math.floor((Date.now() - testStartTime.getTime()) / 1000) : 0,
          questionsAnswered: answers.length
        })
      });

      if (oceanResponse.ok) {
        console.log('✅ OCEAN save result successful');
        const oceanData = await oceanResponse.json();
        console.log('OCEAN response data:', oceanData);
        
        // Set career recommendations from the save-result API response
        if (oceanData.careerRecommendations) {
          setCareerRecommendations(oceanData.careerRecommendations);
          console.log('✅ Career recommendations set:', oceanData.careerRecommendations);
        } else if (oceanData.recommendations) {
          setCareerRecommendations(oceanData.recommendations);
          console.log('✅ Career recommendations set (fallback):', oceanData.recommendations);
        }
        
        addNotification({
          type: 'success',
          title: 'Test Tamamlandı!',
          message: 'OCEAN test sonuçlarınız başarıyla kaydedildi.',
          duration: 5000
        });
      } else {
        console.error('❌ OCEAN save failed:', oceanResponse.status);
        const errorData = await oceanResponse.json();
        console.error('Error data:', errorData);
        
        addNotification({
          type: 'warning',
          title: 'Kaydetme Hatası',
          message: `Test sonuçları kaydedilemedi: ${errorData.error}`,
          duration: 5000
        });
      }

      setCurrentTab('personality');
      setTestResult({ oceanScores, onetScores });
    } catch (error) {
      console.error('Error finishing tests:', error);
      addNotification({
        type: 'warning',
        title: 'Hata',
        message: 'Test sonuçları kaydedilirken bir hata oluştu.',
        duration: 5000
      });
    } finally {
      setIsTestLoading(false);
    }
  };

  const getPersonalityType = (scores: { openness: number; conscientiousness: number; extraversion: number; agreeableness: number; neuroticism: number }) => {
    const { openness, conscientiousness, extraversion, agreeableness, neuroticism } = scores;
    
    if (openness > 3.5 && conscientiousness > 3.5 && extraversion > 3.5) {
      return 'Yaratıcı Lider';
    } else if (conscientiousness > 3.5 && agreeableness > 3.5) {
      return 'Güvenilir Takım Oyuncusu';
    } else if (extraversion > 3.5 && agreeableness > 3.5) {
      return 'Sosyal İletişimci';
    } else if (openness > 3.5 && neuroticism < 2.5) {
      return 'Sakin Yenilikçi';
    } else {
      return 'Dengeli Kişilik';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push('/auth/signin');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Brain className="h-8 w-8 text-cyan-400" />
              <h1 className="text-xl font-bold text-white">AI Kişilik Analizi</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-300">
                {user?.name || 'Kullanıcı'}
              </div>
              <a
                href="/"
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 hover:border-purple-400/50 rounded-lg px-4 py-2 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
              >
                <span>Ana Sayfa</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">
              İlerleme: {currentTab === 'test' ? 'OCEAN Testi' : currentTab === 'onet' ? 'O*NET Testi' : 'Tamamlandı'}
            </span>
            <span className="text-sm text-gray-300">
              {currentTab === 'test' ? `${currentQuestion + 1}/${oceanQuestions.length}` : 
               currentTab === 'onet' ? `${currentQuestion + 1}/${onetQuestions.length}` : '100%'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ 
                width: currentTab === 'test' ? `${((currentQuestion + 1) / oceanQuestions.length) * 100}%` :
                       currentTab === 'onet' ? `${((currentQuestion + 1) / onetQuestions.length) * 100}%` : '100%'
              }}
            ></div>
          </div>
        </div>

        {/* Test Content */}
        {currentTab === 'test' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            {currentQuestion === 0 ? (
              // Test başlangıç ekranı
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Brain className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">OCEAN Kişilik Testi</h2>
                <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                  Bu test, kişilik özelliklerinizi analiz ederek size en uygun kariyer alanlarını önerecektir. 
                  Soruları içtenlikle cevaplayın ve acele etmeyin.
                </p>
                
                <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-xl p-6 mb-8">
                  <h3 className="text-xl font-semibold text-white mb-4">Test Hakkında</h3>
                  <ul className="text-gray-300 text-left space-y-2">
                    <li>• Test 50 sorudan oluşmaktadır</li>
                    <li>• Her soru için 5 seçenek bulunmaktadır</li>
                    <li>• Test süresi yaklaşık 15-20 dakikadır</li>
                    <li>• Test sonuçları AI tarafından analiz edilir</li>
                    <li>• Testi sadece bir kez çözebilirsiniz</li>
                  </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <button
                    onClick={() => setCurrentQuestion(1)}
                    className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg hover:scale-105 shadow-lg"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Testi Başlat</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </button>
                  <a
                    href="/"
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 rounded-xl px-6 py-4 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg text-center"
                  >
                    <div className="flex items-center space-x-2">
                      <span>Ana Sayfaya Dön</span>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              // Test soruları
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">OCEAN Kişilik Testi</h2>
                  <p className="text-gray-300">Aşağıdaki soruları içtenlikle cevaplayın</p>
                  
                  {/* Home Button */}
                  <div className="mt-6">
                    <a
                      href="/"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 rounded-lg px-4 py-2 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
                    >
                      <span>Ana Sayfaya Dön</span>
                      <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {currentQuestion < oceanQuestions.length && (
                  <div className="space-y-8">
                    {/* Progress Bar */}
                    <div className="mb-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-300 text-sm">İlerleme</span>
                        <span className="text-cyan-400 font-semibold">
                          {currentQuestion} / {oceanQuestions.length}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(currentQuestion / oceanQuestions.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="text-center">
                      <h3 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                        {oceanQuestions[currentQuestion].text}
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(value)}
                          className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 hover:from-cyan-500/30 hover:to-purple-500/30 border border-cyan-400/30 hover:border-cyan-400/50 rounded-xl p-6 transition-all duration-200 text-white font-medium text-lg hover:scale-105 hover:shadow-lg"
                        >
                          {value === 1 ? 'Kesinlikle Katılmıyorum' :
                           value === 2 ? 'Katılmıyorum' :
                           value === 3 ? 'Kararsızım' :
                           value === 4 ? 'Katılıyorum' : 'Kesinlikle Katılıyorum'}
                        </button>
                      ))}
                    </div>

                    {/* Previous Question Button */}
                    {currentQuestion > 0 && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={() => {
                            setCurrentQuestion(currentQuestion - 1);
                            setAnswers(answers.slice(0, -1));
                          }}
                          className="flex items-center space-x-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 border border-gray-400/30 hover:border-gray-400/50 rounded-xl px-6 py-3 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
                        >
                          <ChevronLeft className="w-5 h-5" />
                          <span>Önceki Soru</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* O*NET Test */}
        {currentTab === 'onet' && (
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TargetIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">O*NET Kariyer Testi</h2>
              <p className="text-gray-300">Kariyer tercihlerinizi değerlendirin</p>
              
              {/* Home Button */}
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 rounded-lg px-4 py-2 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
                >
                  <span>Ana Sayfaya Dön</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {currentQuestion < onetQuestions.length && (
              <div className="space-y-8">
                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300 text-sm">İlerleme</span>
                    <span className="text-blue-400 font-semibold">
                      {currentQuestion} / {onetQuestions.length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-cyan-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(currentQuestion / onetQuestions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                    {onetQuestions[currentQuestion].question}
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {onetQuestions[currentQuestion].options.map((option: { value: number; text: string }) => (
                    <button
                      key={option.value}
                      onClick={() => handleOnetAnswer(option.value)}
                      className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 hover:from-blue-500/30 hover:to-cyan-500/30 border border-blue-400/30 hover:border-blue-400/50 rounded-xl p-6 transition-all duration-200 text-white font-medium text-lg hover:scale-105 hover:shadow-lg"
                    >
                      {option.text}
                    </button>
                  ))}
                </div>

                {/* Previous Question Button */}
                {currentQuestion > 0 && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => {
                        setCurrentQuestion(currentQuestion - 1);
                        setOnetAnswers(onetAnswers.slice(0, -1));
                      }}
                      className="flex items-center space-x-2 bg-gradient-to-r from-gray-500/20 to-gray-600/20 hover:from-gray-500/30 hover:to-gray-600/30 border border-gray-400/30 hover:border-gray-400/50 rounded-xl px-6 py-3 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
                    >
                      <ChevronLeft className="w-5 h-5" />
                      <span>Önceki Soru</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Personality Results */}
        {currentTab === 'personality' && oceanScores && (
          <div className="space-y-8">
            {/* Success Header */}
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl p-8 border border-green-500/30 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4">Test Tamamlandı! 🎉</h2>
              <p className="text-gray-300 text-lg">AI kişilik analiziniz başarıyla tamamlandı</p>
              
              {/* Home Button */}
              <div className="mt-6">
                <a
                  href="/"
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 rounded-lg px-4 py-2 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg"
                >
                  <span>Ana Sayfaya Dön</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              
              {/* Test Reset Warning */}
              <div className="mt-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">⚠️</span>
                  </div>
                  <span className="text-yellow-300 font-semibold text-lg">Test Zaten Tamamlandı</span>
                </div>
                <p className="text-yellow-200 text-center mb-6 leading-relaxed">
                  OCEAN testinizi zaten tamamladınız. Testi silmek ve yeniden başlamak istiyorsanız aşağıdaki butona tıklayın.
                  <br />
                  <span className="text-sm text-yellow-300/80">Not: Testi sildiğinizde tüm sonuçlarınız kaybolacaktır.</span>
                </p>
                <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <button
                    onClick={resetTest}
                    className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <span>🗑️ Testi Sil ve Yeniden Başla</span>
                  </button>
                  <a
                    href="/dashboard"
                    className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 border border-green-400/30 hover:border-green-400/50 rounded-lg px-6 py-3 transition-all duration-200 text-white font-medium hover:scale-105 hover:shadow-lg text-center flex items-center justify-center space-x-2"
                  >
                    <span>📊 Dashboard'a Git</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* OCEAN Scores */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center space-x-3 mb-6">
                  <Brain className="w-6 h-6 text-cyan-400" />
                  <h3 className="text-2xl font-bold text-white">OCEAN Puanları</h3>
                </div>
                
                <div className="space-y-6">
                  {Object.entries(oceanScores).map(([trait, score]) => (
                    <div key={trait} className="bg-white/5 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-white font-semibold text-lg">
                          {trait === 'openness' ? 'Açıklık' :
                           trait === 'conscientiousness' ? 'Sorumluluk' :
                           trait === 'extraversion' ? 'Dışadönüklük' :
                           trait === 'agreeableness' ? 'Uyumluluk' : 'Nörotizm'}
                        </span>
                        <span className="text-cyan-400 font-bold text-xl">{score as string}/5</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${(score as number / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Personality Type */}
              <div className="space-y-6">
                {/* Personality Type */}
                <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl p-8 border border-cyan-400/30 shadow-2xl">
                  <div className="flex items-center space-x-3 mb-4">
                    <Users className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-2xl font-bold text-white">Kişilik Tipi</h3>
                  </div>
                  
                  <h4 className="text-3xl font-bold text-white mb-4">
                    {getPersonalityType(oceanScores)}
                  </h4>
                  <p className="text-gray-300 text-lg">
                    Bu kişilik tipi, OCEAN puanlarınıza göre belirlenmiştir.
                  </p>
                </div>
              </div>
            </div>

            {/* AI Career Recommendations */}
            {careerRecommendations.length > 0 && (
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 shadow-2xl">
                <div className="flex items-center space-x-3 mb-8">
                  <Code className="w-8 h-8 text-purple-400" />
                  <h3 className="text-3xl font-bold text-white">AI Yazılım Kariyer Önerileri</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {careerRecommendations.map((rec, index) => (
                    <div key={index} className="bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-2xl p-6 border border-purple-400/30">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-white">{rec.field}</h4>
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                          <span className="text-green-400 font-semibold">
                            {(rec.confidence * 100).toFixed(0)}% Uyum
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 mb-4 leading-relaxed">
                        {rec.reasoning}
                      </p>
                      
                      <div className="space-y-3">
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <Rocket className="w-4 h-4 text-cyan-400" />
                            <span className="text-cyan-400 font-semibold">Öğrenme Yolu</span>
                          </div>
                          <p className="text-gray-300 text-sm">{rec.learningPath}</p>
                        </div>
                        
                        <div className="bg-white/5 rounded-lg p-3">
                          <div className="flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span className="text-green-400 font-semibold">Sonraki Adımlar</span>
                          </div>
                          <p className="text-gray-300 text-sm">{rec.nextSteps}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <a
                href="/"
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg hover:scale-105 shadow-lg text-center"
              >
                <div className="flex items-center space-x-2">
                  <span>Ana Sayfa</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </a>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <BarChart className="w-5 h-5" />
                  <span>Dashboard'a Git</span>
                </div>
              </button>
              <button
                onClick={() => router.push('/career-roadmap')}
                className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 text-lg hover:scale-105 shadow-lg"
              >
                <div className="flex items-center space-x-2">
                  <Zap className="w-5 h-5" />
                  <span>Kariyer Yol Haritası</span>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isTestLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center shadow-2xl">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-400 mx-auto mb-4"></div>
              <p className="text-white text-lg">AI kariyer önerileri hesaplanıyor...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 