'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Target, 
  TrendingUp, 
  Star,
  ArrowRight,
  Share2,
  Download,
  MessageSquare,
  CheckCircle,
  Zap,
  Award,
  Users
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { OceanScores } from '@/lib/ocean-calculator';
import { getRecommendedFields } from '@/lib/ocean-calculator';

interface TestResult {
  scores: OceanScores;
  answers: number[];
  timestamp: string;
}

export default function TestResultsPage() {
  const searchParams = useSearchParams();
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [recommendedFields, setRecommendedFields] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const scoresParam = searchParams.get('scores');
    
    if (scoresParam) {
      try {
        const scores = JSON.parse(decodeURIComponent(scoresParam));
        const fields = getRecommendedFields(scores);
        setTestResult({ scores, answers: [], timestamp: new Date().toISOString() });
        setRecommendedFields(fields);
      } catch (error) {
        console.error('Scores parsing error:', error);
      }
    } else {
      // Try to get from localStorage
      const savedResult = localStorage.getItem('oceanTestResult');
      if (savedResult) {
        try {
          const result = JSON.parse(savedResult);
          const fields = getRecommendedFields(result.scores);
          setTestResult(result);
          setRecommendedFields(fields);
        } catch (error) {
          console.error('LocalStorage parsing error:', error);
        }
      }
    }
    
    setIsLoading(false);
  }, [searchParams]);

  const getTraitDescription = (trait: keyof OceanScores, score: number) => {
    const descriptions = {
      openness: {
        high: 'Yaratıcı ve yenilikçi düşünürsünüz. Yeni deneyimlere açıksınız ve soyut fikirlerle ilgilenirsiniz.',
        medium: 'Dengeli bir yaklaşımınız var. Hem geleneksel hem de yenilikçi çözümleri değerlendirirsiniz.',
        low: 'Pratik ve geleneksel yaklaşımları tercih edersiniz. Kanıtlanmış yöntemlere güvenirsiniz.'
      },
      conscientiousness: {
        high: 'Organize ve sorumluluk sahibisiniz. Detaylara dikkat eder ve hedeflerinize odaklanırsınız.',
        medium: 'Esnek bir yapınız var. Gerektiğinde organize olabilir, gerektiğinde spontane davranabilirsiniz.',
        low: 'Esnek ve spontane bir kişiliğe sahipsiniz. Yaratıcı çözümler üretirsiniz.'
      },
      extraversion: {
        high: 'Sosyal ve enerjik bir kişiliğe sahipsiniz. İnsanlarla çalışmayı sever ve liderlik rolünü üstlenirsiniz.',
        medium: 'Dengeli bir sosyal yaşamınız var. Hem takım çalışması hem de bağımsız çalışma size uygun.',
        low: 'Sakin ve içe dönük bir yapınız var. Derinlemesine düşünmeyi ve odaklanmayı tercih edersiniz.'
      },
      agreeableness: {
        high: 'İşbirlikçi ve anlayışlısınız. Takım çalışmasında başarılı ve çatışmaları çözmekte iyisiniz.',
        medium: 'Dengeli bir yaklaşımınız var. Hem işbirliği yapabilir hem de gerektiğinde rekabetçi olabilirsiniz.',
        low: 'Doğrudan ve rekabetçi bir yaklaşımınız var. Net kararlar alır ve hedeflerinize odaklanırsınız.'
      },
      neuroticism: {
        high: 'Duygusal hassasiyetiniz yüksek. Stresli durumlarda daha dikkatli olmanız gerekebilir.',
        medium: 'Duygusal dengeniz iyi. Çoğu durumda sakin kalabilir ve stresle başa çıkabilirsiniz.',
        low: 'Duygusal olarak dengeli ve sakin bir yapınız var. Stresli durumlarda bile soğukkanlılığınızı korursunuz.'
      }
    };

    const level = score >= 4 ? 'high' : score >= 2.5 ? 'medium' : 'low';
    return descriptions[trait][level];
  };

  const getTraitColor = (score: number) => {
    if (score >= 4) return 'from-green-500 to-emerald-600';
    if (score >= 2.5) return 'from-yellow-500 to-orange-600';
    return 'from-red-500 to-pink-600';
  };

  const getTraitLevel = (score: number) => {
    if (score >= 4) return 'Yüksek';
    if (score >= 2.5) return 'Orta';
    return 'Düşük';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white text-lg">Sonuçlar yükleniyor...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="min-h-screen ai-gradient-bg">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">Test Sonucu Bulunamadı</h2>
            <p className="text-gray-400 mb-8">Test sonuçlarınız bulunamadı. Lütfen tekrar test çözün.</p>
            <Link href="/test" className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300">
              Teste Başla
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen ai-gradient-bg">
      <Header />
      
      <div className="relative z-10 pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl mb-6 ai-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Test Sonuçlarınız
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              AI destekli kişilik analiziniz tamamlandı! Size en uygun yazılım alanlarını keşfedin.
            </p>
          </motion.div>

          {/* OCEAN Scores */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">OCEAN Kişilik Profili</h2>
              <p className="text-gray-400">Kişilik özelliklerinizin detaylı analizi</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {Object.entries(testResult.scores).map(([trait, score], index) => (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                  className="ai-card p-6 rounded-2xl text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${getTraitColor(score)} rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow`}>
                    <Star className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2 capitalize">
                    {trait === 'openness' && 'Açıklık'}
                    {trait === 'conscientiousness' && 'Sorumluluk'}
                    {trait === 'extraversion' && 'Dışadönüklük'}
                    {trait === 'agreeableness' && 'Uyumluluk'}
                    {trait === 'neuroticism' && 'Duygusal Denge'}
                  </h3>
                  <div className="text-3xl font-bold text-white mb-2">{score}/5</div>
                  <div className={`text-sm font-medium mb-3 ${
                    score >= 4 ? 'text-green-400' : score >= 2.5 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {getTraitLevel(score)}
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {getTraitDescription(trait as keyof OceanScores, score)}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recommended Fields */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-white mb-4">Önerilen Yazılım Alanları</h2>
              <p className="text-gray-400">Kişilik profilinize en uygun kariyer yolları</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendedFields.map((field, index) => (
                <motion.div
                  key={field}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="ai-card p-6 rounded-2xl hover:scale-105 transition-transform duration-300 cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow group-hover:scale-110 transition-transform duration-300">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 text-center">{field}</h3>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Yüksek Uyum</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-16"
          >
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.a
                href="/chat"
                className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow group-hover:scale-110 transition-transform duration-300">
                  <MessageSquare className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">AI ile Danış</h3>
                <p className="text-gray-400 text-sm mb-4">Kariyer danışmanıyla detaylı görüşün</p>
                <ArrowRight className="w-5 h-5 text-cyan-400 mx-auto group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>

              <motion.a
                href="/career-roadmap"
                className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Kariyer Yolu</h3>
                <p className="text-gray-400 text-sm mb-4">Detaylı kariyer planınızı görün</p>
                <ArrowRight className="w-5 h-5 text-green-400 mx-auto group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>

              <motion.a
                href="/resources"
                className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow group-hover:scale-110 transition-transform duration-300">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Kaynaklar</h3>
                <p className="text-gray-400 text-sm mb-4">Öğrenme materyallerini keşfedin</p>
                <ArrowRight className="w-5 h-5 text-purple-400 mx-auto group-hover:translate-x-1 transition-transform duration-300" />
              </motion.a>
            </div>
          </motion.div>

          {/* Share Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center"
          >
            <div className="ai-card p-8 rounded-3xl max-w-2xl mx-auto">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl mb-6 ai-glow">
                <Share2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Sonuçlarınızı Paylaşın</h2>
              <p className="text-gray-300 text-lg mb-8">
                Arkadaşlarınızla kişilik analizinizi paylaşın ve onları da Nebula Nexus'a davet edin!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Share2 className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  Paylaş
                </motion.button>
                <motion.button
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                  PDF İndir
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 