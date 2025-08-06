'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Download, 
  Share2, 
  FileText, 
  Image, 
  BarChart3, 
  Target,
  CheckCircle,
  AlertTriangle,
  Star,
  TrendingUp,
  Users,
  Calendar,
  Globe,
  Mail,
  Phone,
  MapPin,
  Award,
  BookOpen,
  Code,
  Database,
  Smartphone,
  Shield,
  Zap,
  Brain,
  Heart
} from 'lucide-react';

interface PersonalityReportProps {
  testResult: any;
  personalityType: any;
  onClose?: () => void;
}

interface SocialMediaCard {
  title: string;
  description: string;
  image: string;
  url: string;
}

export default function PersonalityReport({ testResult, personalityType, onClose }: PersonalityReportProps) {
  const [activeTab, setActiveTab] = useState<'report' | 'social' | 'comparison'>('report');
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      // PDF generation logic will be implemented here
      await new Promise(resolve => setTimeout(resolve, 2000));
      // For now, just simulate PDF generation
      const link = document.createElement('a');
      link.href = '#';
      link.download = `personality-report-${Date.now()}.pdf`;
      link.click();
    } catch (error) {
      console.error('PDF generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSocialMediaCard = (): SocialMediaCard => {
    return {
      title: `${personalityType.type} - Kişilik Analizi`,
      description: `OCEAN test sonuçlarıma göre ${personalityType.type} kişilik tipine sahibim. ${personalityType.description}`,
      image: '/api/og/personality', // This would generate an OG image
      url: window.location.href
    };
  };

  const shareOnSocialMedia = (platform: string) => {
    const card = generateSocialMediaCard();
    const text = encodeURIComponent(card.description);
    const url = encodeURIComponent(card.url);

    const shareUrls = {
      twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      whatsapp: `https://wa.me/?text=${text}%20${url}`
    };

    window.open(shareUrls[platform as keyof typeof shareUrls], '_blank');
  };

  const getTraitDescription = (trait: string, score: number) => {
    const descriptions = {
      openness: {
        high: 'Yeni deneyimlere açık, yaratıcı ve meraklı',
        medium: 'Dengeli bir yaklaşım sergiler',
        low: 'Geleneksel değerlere bağlı, pratik yaklaşımlı'
      },
      conscientiousness: {
        high: 'Organize, sorumlu ve hedef odaklı',
        medium: 'Düzenli ve güvenilir',
        low: 'Esnek ve spontane'
      },
      extraversion: {
        high: 'Enerjik, sosyal ve dışa dönük',
        medium: 'Dengeli sosyal etkileşim',
        low: 'Sakin, içe dönük ve düşünceli'
      },
      agreeableness: {
        high: 'İşbirlikçi, güvenilir ve yardımsever',
        medium: 'Uyumlu ve anlayışlı',
        low: 'Direkt ve rekabetçi'
      },
      neuroticism: {
        high: 'Duygusal hassasiyet ve endişe',
        medium: 'Dengeli duygusal durum',
        low: 'Sakin ve duygusal stabilite'
      }
    };

    const level = score >= 4 ? 'high' : score >= 2.5 ? 'medium' : 'low';
    const traitDescriptions = descriptions[trait as keyof typeof descriptions];
    const levelDescriptions = traitDescriptions?.[level as keyof typeof traitDescriptions];
    return levelDescriptions || '';
  };

  const getComparisonData = () => {
    // Mock comparison data - in real app, this would come from database
    return {
      averageScores: {
        openness: 3.2,
        conscientiousness: 3.4,
        extraversion: 3.1,
        agreeableness: 3.3,
        neuroticism: 2.8
      },
      percentile: {
        openness: 75,
        conscientiousness: 82,
        extraversion: 68,
        agreeableness: 71,
        neuroticism: 45
      }
    };
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white">Kişilik Raporu</h2>
              <p className="text-purple-100">Detaylı analiz ve paylaşım seçenekleri</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={generatePDF}
                disabled={isGenerating}
                className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{isGenerating ? 'Oluşturuluyor...' : 'PDF İndir'}</span>
              </button>
              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-lg transition-colors"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gray-800 p-4">
          <div className="flex space-x-1">
            {[
              { id: 'report', label: 'Detaylı Rapor', icon: FileText },
              { id: 'social', label: 'Sosyal Medya', icon: Share2 },
              { id: 'comparison', label: 'Karşılaştırma', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'report' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Executive Summary */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Özet</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Kişilik Tipi</h4>
                    <p className="text-white">{personalityType.type}</p>
                    <p className="text-gray-400 text-sm mt-1">{personalityType.description}</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-purple-400 mb-2">Test Tarihi</h4>
                    <p className="text-white">{new Date().toLocaleDateString('tr-TR')}</p>
                    <p className="text-gray-400 text-sm mt-1">OCEAN Kişilik Testi</p>
                  </div>
                </div>
              </div>

              {/* Detailed Analysis */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Detaylı Analiz</h3>
                <div className="space-y-4">
                  {Object.entries(testResult.scores).map(([trait, score]) => {
                    const scoreValue = score as number;
                    return (
                      <div key={trait} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white capitalize">
                            {trait === 'openness' ? 'Açıklık' :
                             trait === 'conscientiousness' ? 'Sorumluluk' :
                             trait === 'extraversion' ? 'Dışadönüklük' :
                             trait === 'agreeableness' ? 'Uyumluluk' : 'Nörotiklik'}
                          </h4>
                          <span className="text-lg font-bold text-cyan-400">{scoreValue.toFixed(1)}/5</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
                            style={{ width: `${(scoreValue / 5) * 100}%` }}
                          />
                        </div>
                        <p className="text-gray-300 text-sm">
                          {getTraitDescription(trait, scoreValue)}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strengths & Development Areas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                    Güçlü Yönler
                  </h3>
                  <ul className="space-y-2">
                    {personalityType.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-gray-300">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-800 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Target className="w-5 h-5 text-yellow-400 mr-2" />
                    Gelişim Alanları
                  </h3>
                  <ul className="space-y-2">
                    {personalityType.developmentAreas?.map((area: string, index: number) => (
                      <li key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                        <span className="text-gray-300">{area}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Career Recommendations */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Kariyer Önerileri</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {personalityType.idealFields.map((field: string, index: number) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        {index === 0 && <Code className="w-6 h-6 text-white" />}
                        {index === 1 && <Database className="w-6 h-6 text-white" />}
                        {index === 2 && <Smartphone className="w-6 h-6 text-white" />}
                      </div>
                      <h4 className="font-semibold text-white">{field}</h4>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Social Media Card Preview */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Sosyal Medya Kartı</h3>
                <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-4 mb-4">
                    <h4 className="text-white font-bold text-lg">{personalityType.type}</h4>
                    <p className="text-purple-100 text-sm">{personalityType.description}</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">OCEAN Kişilik Testi Sonucu</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{new Date().toLocaleDateString('tr-TR')}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Paylaş</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Twitter', color: 'bg-blue-500', icon: '🐦' },
                    { name: 'LinkedIn', color: 'bg-blue-600', icon: '💼' },
                    { name: 'Facebook', color: 'bg-blue-700', icon: '📘' },
                    { name: 'WhatsApp', color: 'bg-green-500', icon: '💬' }
                  ].map((platform) => (
                    <button
                      key={platform.name}
                      onClick={() => shareOnSocialMedia(platform.name.toLowerCase())}
                      className={`${platform.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity flex flex-col items-center space-y-2`}
                    >
                      <span className="text-2xl">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'comparison' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Comparison Chart */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">Popülasyon Karşılaştırması</h3>
                <div className="space-y-4">
                  {Object.entries(testResult.scores).map(([trait, score]) => {
                    const scoreValue = score as number;
                    const comparison = getComparisonData();
                    const percentile = comparison.percentile[trait as keyof typeof comparison.percentile];
                    
                    return (
                      <div key={trait} className="border border-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-white capitalize">
                            {trait === 'openness' ? 'Açıklık' :
                             trait === 'conscientiousness' ? 'Sorumluluk' :
                             trait === 'extraversion' ? 'Dışadönüklük' :
                             trait === 'agreeableness' ? 'Uyumluluk' : 'Nörotiklik'}
                          </h4>
                          <span className="text-sm text-gray-400">%{percentile} percentile</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                          <div
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ width: `${percentile}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-400">
                          <span>Düşük</span>
                          <span>Orta</span>
                          <span>Yüksek</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Statistical Summary */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h3 className="text-xl font-bold text-white mb-4">İstatistiksel Özet</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">75%</div>
                    <div className="text-sm text-gray-400">Ortalama Üstü</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-400">3.8</div>
                    <div className="text-sm text-gray-400">Ortalama Skor</div>
                  </div>
                  <div className="text-center p-4 bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">5</div>
                    <div className="text-sm text-gray-400">Test Sayısı</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
} 