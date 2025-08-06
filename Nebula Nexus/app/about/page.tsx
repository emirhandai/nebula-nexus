'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Target, 
  Award, 
  Heart, 
  Lightbulb,
  Shield,
  Zap,
  Star,
  CheckCircle,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

export default function AboutPage() {
  const teamMembers = [
    {
      name: 'Dr. Ahmet Yılmaz',
      role: 'Kurucu & CEO',
      description: 'Yapay zeka ve kariyer danışmanlığı alanında 15+ yıl deneyim',
      image: '/api/placeholder/150/150',
      color: 'from-purple-500 to-pink-600'
    },
    {
      name: 'Ayşe Demir',
      role: 'Baş Teknoloji Sorumlusu',
      description: 'Machine Learning ve AI sistemleri uzmanı',
      image: '/api/placeholder/150/150',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      name: 'Mehmet Kaya',
      role: 'Kullanıcı Deneyimi Tasarımcısı',
      description: 'Modern ve kullanıcı dostu arayüz tasarımları',
      image: '/api/placeholder/150/150',
      color: 'from-green-500 to-emerald-600'
    }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Kişiselleştirme',
      description: 'Her kullanıcının benzersiz kişilik profiline göre özelleştirilmiş öneriler',
      color: 'from-red-500 to-pink-600'
    },
    {
      icon: Target,
      title: 'Hedef Odaklılık',
      description: 'Kariyer hedeflerinize ulaşmanız için net yol haritaları',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Shield,
      title: 'Güvenilirlik',
      description: 'Gelişmiş AI algoritmaları ile doğru ve güvenilir analizler',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: Zap,
      title: 'İnovasyon',
      description: 'Sürekli gelişen teknoloji ile en güncel kariyer trendleri',
      color: 'from-yellow-500 to-orange-600'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Mutlu Kullanıcı', icon: Users },
    { number: '95%', label: 'Başarı Oranı', icon: Award },
    { number: '25+', label: 'Yazılım Alanı', icon: Target },
    { number: '24/7', label: 'AI Desteği', icon: Zap }
  ];

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
              <Users className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-cyan-600 bg-clip-text text-transparent mb-6">
              Hakkımızda
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nebula Nexus, yapay zeka teknolojisi ile kişilik analizi yaparak yazılım alanında 
              kariyer yapmak isteyenlere kişiselleştirilmiş rehberlik sağlayan yenilikçi bir platformdur.
            </p>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Mission & Vision */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="ai-card p-8 rounded-3xl"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Misyonumuz</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Yazılım alanında kariyer yapmak isteyen herkesin kişilik özelliklerine uygun 
                alanları keşfetmesini sağlamak ve bu yolculukta onlara rehberlik etmek.
              </p>
              <ul className="space-y-3">
                {[
                  'Kişiselleştirilmiş kariyer analizi',
                  'AI destekli öneriler',
                  'Sürekli öğrenme ve gelişim',
                  'Topluluk desteği'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="ai-card p-8 rounded-3xl"
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white">Vizyonumuz</h2>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                Yazılım sektöründe kariyer yapmak isteyenlerin ilk tercih ettiği 
                AI destekli kariyer danışmanlık platformu olmak.
              </p>
              <ul className="space-y-3">
                {[
                  'Global erişim ve etki',
                  'Sürekli teknoloji yenilikleri',
                  'En güncel kariyer trendleri',
                  'Milyonlarca başarı hikayesi'
                ].map((item, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Star className="w-5 h-5 text-yellow-400 mr-3" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Values Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-16"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Değerlerimiz</h2>
              <p className="text-gray-400 text-lg">Çalışma prensiplerimizi yansıtan temel değerlerimiz</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">Ekibimiz</h2>
              <p className="text-gray-400 text-lg">Nebula Nexus'u oluşturan deneyimli ekip</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1 + index * 0.1 }}
                  className="ai-card p-6 rounded-3xl text-center hover:scale-105 transition-transform duration-300"
                >
                  <div className={`w-24 h-24 bg-gradient-to-r ${member.color} rounded-3xl flex items-center justify-center mx-auto mb-6 ai-glow`}>
                    <Users className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{member.name}</h3>
                  <p className="text-cyan-400 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-400">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-16"
          >
            <div className="ai-card p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-white mb-4">Kariyer Yolculuğunuza Başlayın</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Nebula Nexus ile kişilik profilinizi keşfedin ve yazılım alanında 
                size en uygun kariyer yolunu bulun.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/test"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Teste Başla
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </motion.a>
                <motion.a
                  href="/chat"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  AI ile Sohbet Et
                  <MessageSquare className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
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