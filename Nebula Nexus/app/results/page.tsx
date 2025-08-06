'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Brain, 
  TrendingUp, 
  BookOpen, 
  MessageSquare,
  ArrowRight,
  Share2,
  Download,
  RefreshCw,
  Target,
  Zap,
  Star,
  Award,
  Rocket,
  Code,
  Database,
  Smartphone,
  Globe,
  Shield,
  BarChart3,
  CheckCircle,
  Home
} from 'lucide-react';
import Link from 'next/link';
import { OceanScores } from '@/types';
import { softwareFields } from '@/data/onet-data';
import OceanRadarChart from '@/components/OceanRadarChart';

export default function ResultsPage() {
  const router = useRouter();
  const [testResult, setTestResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // localStorage'dan test sonuçlarını al
    const storedResult = localStorage.getItem('oceanTestResult');
    if (storedResult) {
      setTestResult(JSON.parse(storedResult));
    } else {
      // Test sonucu yoksa test sayfasına yönlendir
      router.push('/test');
    }
    setIsLoading(false);
  }, [router]);

  const getFieldIcon = (fieldName: string): React.ReactElement => {
    const field = fieldName.toLowerCase();
    if (field.includes('frontend') || field.includes('ui')) return <Code className="w-6 h-6" />;
    if (field.includes('backend') || field.includes('api')) return <Database className="w-6 h-6" />;
    if (field.includes('mobile')) return <Smartphone className="w-6 h-6" />;
    if (field.includes('fullstack')) return <Globe className="w-6 h-6" />;
    if (field.includes('devops')) return <Shield className="w-6 h-6" />;
    if (field.includes('ai') || field.includes('machine learning')) return <Brain className="w-6 h-6" />;
    return <Code className="w-6 h-6" />;
  };

  const getTraitDescription = (trait: string, score: number) => {
    const descriptions = {
      O: {
        high: 'Yaratıcı, hayal gücü yüksek, sanatsal',
        medium: 'Dengeli, pratik, gerçekçi',
        low: 'Geleneksel, rutin, düzenli'
      },
      C: {
        high: 'Organize, sorumlu, hedef odaklı',
        medium: 'Dengeli, esnek, uyumlu',
        low: 'Spontane, rahat, esnek'
      },
      E: {
        high: 'Dışa dönük, enerjik, sosyal',
        medium: 'Dengeli, uyumlu, kararlı',
        low: 'İçe dönük, sakin, düşünceli'
      },
      A: {
        high: 'Yardımsever, güvenilir, işbirlikçi',
        medium: 'Dengeli, adil, tarafsız',
        low: 'Bağımsız, rekabetçi, doğrudan'
      },
      N: {
        high: 'Hassas, endişeli, duygusal',
        medium: 'Dengeli, kararlı, sakin',
        low: 'Sakin, güvenli, kararlı'
      }
    };

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return descriptions[trait as keyof typeof descriptions]?.[level as keyof typeof descriptions.O] || '';
  };

  const getTraitColor = (trait: string) => {
    const colors = {
      O: 'from-purple-500 to-pink-600',
      C: 'from-green-500 to-emerald-600',
      E: 'from-blue-500 to-cyan-600',
      A: 'from-yellow-500 to-orange-600',
      N: 'from-red-500 to-rose-600'
    };
    return colors[trait as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getTraitLevel = (score: number) => {
    if (score >= 80) return { level: 'Çok Yüksek', color: 'text-green-400' };
    if (score >= 60) return { level: 'Yüksek', color: 'text-blue-400' };
    if (score >= 40) return { level: 'Orta', color: 'text-yellow-400' };
    if (score >= 20) return { level: 'Düşük', color: 'text-orange-400' };
    return { level: 'Çok Düşük', color: 'text-red-400' };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="ai-spinner mb-6"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Sonuçlar Yükleniyor</h2>
          <p className="text-gray-300">Test sonuçlarınız hazırlanıyor...</p>
        </motion.div>
      </div>
    );
  }

  if (!testResult) {
    return (
      <div className="min-h-screen ai-gradient-bg flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="ai-card p-8">
            <Brain className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Test Sonucu Bulunamadı</h2>
            <p className="text-gray-300 mb-6">Lütfen önce OCEAN testini tamamlayın.</p>
            <Link href="/test">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ai-button-primary"
              >
                <Zap className="w-5 h-5 mr-2" />
                Teste Başla
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  const { scores, personality, recommendedFields } = testResult;

  const getFieldInfo = (fieldName: string) => {
    return softwareFields.find(field => field.name === fieldName);
  };

  return (
    <div className="min-h-screen ai-gradient-bg">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
            <Home className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ana Sayfa</span>
          </button>
        </Link>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20"></div>
        <div className="relative container mx-auto px-4 py-16">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full mb-6"
            >
              <Brain className="w-10 h-10 text-white" />
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl font-bold text-white mb-4"
            >
              Test Sonuçlarınız
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto"
            >
              Kişilik analiziniz tamamlandı! Size en uygun yazılım alanlarını keşfedin.
            </motion.p>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-4 pb-16">
        {/* OCEAN Scores Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="ai-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Kişilik Profiliniz</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {Object.entries(scores).map(([trait, score]) => {
              const { level, color } = getTraitLevel(score as number);
              return (
                <motion.div
                  key={trait}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + Object.keys(scores).indexOf(trait) * 0.1 }}
                  className="text-center"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${getTraitColor(trait)} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <span className="text-2xl font-bold text-white">{trait}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {trait === 'O' ? 'Açıklık' : 
                     trait === 'C' ? 'Sorumluluk' : 
                     trait === 'E' ? 'Dışadönüklük' : 
                     trait === 'A' ? 'Uyumluluk' : 'Nevrotiklik'}
                  </h3>
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {score as string}%
                  </div>
                  <div className={`text-sm font-medium ${color} mb-3`}>{level}</div>
                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div 
                      className={`h-2 bg-gradient-to-r ${getTraitColor(trait)} rounded-full transition-all duration-1000`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    {getTraitDescription(trait, score as number)}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Recommended Fields Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="ai-card p-8 mb-12"
        >
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Önerilen Yazılım Alanları</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedFields.map((field: { name: string; description: string; matchScore: number }, index: number) => {
              const fieldInfo = getFieldInfo(field.name);
              return (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
                      {getFieldIcon(typeof field.name === 'string' ? field.name : '')}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{field.name}</h3>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-300">{field.matchScore}% Uyum</span>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {fieldInfo?.description || 'Bu alan kişilik profilinize uygun görünüyor.'}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Target className="w-4 h-4 text-cyan-400 mr-2" />
                      <span className="text-sm text-gray-400">Kariyer Potansiyeli</span>
                    </div>
                    <div className="text-sm font-semibold text-green-400">Yüksek</div>
                  </div>
                  
                  <div className="mt-4">
                    <Link href={`/career-roadmap?field=${encodeURIComponent(field.name)}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full ai-button-secondary text-sm"
                      >
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Yol Haritasını Gör
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ai-button-primary"
          >
            <MessageSquare className="w-5 h-5 mr-2" />
            AI Mentor ile Konuş
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ai-button-secondary"
          >
            <Share2 className="w-5 h-5 mr-2" />
            Sonuçları Paylaş
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="ai-button-secondary"
          >
            <Download className="w-5 h-5 mr-2" />
            PDF İndir
          </motion.button>
        </motion.div>

        {/* Share Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="ai-card p-8 text-center"
        >
          <Award className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-4">Kariyer Yolculuğunuz Başlasın!</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Kişilik analiziniz tamamlandı. Şimdi önerilen alanlardan birini seçerek kariyer yolculuğunuza başlayabilirsiniz.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ai-button-primary"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Testi Tekrar Çöz
              </motion.button>
            </Link>
            
            <Link href="/chat">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="ai-button-secondary"
              >
                <Brain className="w-5 h-5 mr-2" />
                AI Mentor ile Konuş
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 