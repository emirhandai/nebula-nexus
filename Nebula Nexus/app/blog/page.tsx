'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Calendar, 
  User, 
  Clock, 
  Tag,
  Search,
  Filter,
  ArrowRight,
  Star,
  TrendingUp,
  Eye,
  Heart,
  MessageSquare,
  Share2
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  image: string;
  views: number;
  likes: number;
  comments: number;
  featured: boolean;
  color: string;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Real content about our platform instead of dummy blog posts
  const platformInfo = [
    {
      id: 'ocean-test',
      title: 'OCEAN Kişilik Testi',
      description: 'Bilimsel temelli kişilik analizi ile kariyer yolunuzu keşfedin',
      details: 'Big Five kişilik modeli kullanarak 50 soruluk kapsamlı analiz',
      icon: '🧠',
      color: 'from-purple-500 to-pink-600',
      features: ['5 faktör analizi', 'Kariyer eşleştirmesi', 'Kişiselleştirilmiş rapor']
    },
    {
      id: 'ai-guidance',
      title: 'AI Kariyer Danışmanı',
      description: 'Gemini AI ile 7/24 kişiselleştirilmiş kariyer rehberliği',
      details: 'Yapay zeka destekli sohbet sistemi ile anlık destek',
      icon: '🤖',
      color: 'from-cyan-500 to-blue-600',
      features: ['Anlık cevaplar', 'Kişiselleştirilmiş öneriler', 'Sürekli öğrenme']
    },
    {
      id: 'btk-courses',
      title: 'BTK Akademi Entegrasyonu',
      description: 'Türkiye\'nin en kapsamlı ücretsiz eğitim platformu',
      details: '500+ ücretsiz kurs ile pratik beceri geliştirme',
      icon: '🏛️',
      color: 'from-red-500 to-orange-600',
      features: ['Ücretsiz kurslar', 'Türkçe içerik', 'Sertifika desteği']
    },
    {
      id: 'career-roadmap',
      title: 'Kişiselleştirilmiş Yol Haritası',
      description: 'Test sonuçlarınıza göre adım adım kariyer planı',
      details: 'Seviye bazlı öğrenme yolu ve ilerleme takibi',
      icon: '🗺️',
      color: 'from-green-500 to-emerald-600',
      features: ['Adım adım plan', 'İlerleme takibi', 'Esnek program']
    },
    {
      id: 'progress-tracking',
      title: 'İlerleme Takip Sistemi',
      description: 'Öğrenme sürecinizi detaylı analiz edin',
      details: 'Beceri gelişimi, başarılar ve hedef belirleme',
      icon: '📊',
      color: 'from-indigo-500 to-purple-600',
      features: ['Beceri analizi', 'Başarı rozetleri', 'Hedef takibi']
    },
    {
      id: 'community',
      title: 'Topluluk Desteği',
      description: 'Aynı yolda olan arkadaşlarınızla buluşun',
      details: 'Forum, soru-cevap ve deneyim paylaşımı',
      icon: '👥',
      color: 'from-yellow-500 to-orange-600',
      features: ['Forum desteği', 'Deneyim paylaşımı', 'Mentor bağlantısı']
    }
  ];

  const filteredInfo = platformInfo.filter(info => {
    const matchesSearch = info.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         info.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  // Platform features - no featured/regular separation needed

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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-3xl mb-6 ai-glow">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Platform Özellikleri
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nebula Nexus'un sunduğu tüm özellikler ve hizmetler. 
              AI destekli kariyer danışmanlığından BTK entegrasyonuna kadar her şey burada.
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Platform özelliklerinde ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Info */}
              <div className="text-center">
                <span className="text-gray-400 text-sm">
                  {filteredInfo.length} özellik bulundu
                </span>
              </div>
            </div>
          </motion.div>

          {/* Platform Features */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="flex items-center mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white">Platform Özellikleri</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredInfo.map((info, index) => (
                <motion.div
                  key={info.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                  className="ai-card rounded-3xl overflow-hidden hover:scale-105 transition-all duration-300 group"
                >
                  <div className={`relative h-32 bg-gradient-to-br ${info.color} flex items-center justify-center`}>
                    <div className="text-6xl opacity-20 absolute">{info.icon}</div>
                    <div className="text-4xl relative z-10">{info.icon}</div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                      {info.title}
                    </h3>
                    
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">
                      {info.description}
                    </p>
                    
                    <p className="text-gray-400 mb-6 text-xs">
                      {info.details}
                    </p>
                    
                    {/* Features */}
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-white mb-2">Özellikler:</h4>
                      {info.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span className="text-xs text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {filteredInfo.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Özellik Bulunamadı</h3>
                <p className="text-gray-400">Arama kriterinize uygun platform özelliği bulunamadı. Farklı kelimeler deneyebilirsiniz.</p>
              </motion.div>
            )}
          </motion.div>

          {/* Get Started CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="ai-card p-8 rounded-3xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 ai-glow">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Hemen Başlayın</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Tüm bu özellikleri keşfetmeye hazır mısınız? 
                OCEAN testini çözerek AI destekli kariyer yolculuğunuza başlayın.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/test"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Test Çöz
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
                <motion.a
                  href="/dashboard"
                  className="px-8 py-4 bg-black/20 border border-gray-600 text-white rounded-2xl font-semibold hover:bg-gray-700 transition-all duration-300 flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Dashboard'a Git
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
} 