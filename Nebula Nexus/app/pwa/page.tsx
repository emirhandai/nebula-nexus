'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  Download, 
  Zap, 
  Shield, 
  Wifi, 
  WifiOff,
  Star,
  CheckCircle,
  ArrowRight,
  Info,
  Settings,
  Globe,
  Lock,
  RefreshCw
} from 'lucide-react';
import { PWAFeatures, PWAStatus } from '@/components/ui/PWAInstaller';
import Link from 'next/link';

export default function PWAPage() {
  const installationSteps = [
    {
      step: 1,
      title: 'Tarayıcınızı Açın',
      description: 'Chrome, Safari, Firefox veya Edge tarayıcısını kullanın',
      icon: <Globe className="w-6 h-6" />
    },
    {
      step: 2,
      title: 'Nebula Nexus\'a Gidin',
      description: 'www.nebula-nexus.com adresine gidin',
      icon: <Smartphone className="w-6 h-6" />
    },
    {
      step: 3,
      title: 'İndir Butonuna Tıklayın',
      description: 'Sağ üst köşedeki indir butonuna tıklayın',
      icon: <Download className="w-6 h-6" />
    },
    {
      step: 4,
      title: 'Ana Ekrana Ekle',
      description: 'Tarayıcının önerdiği kurulum seçeneğini onaylayın',
      icon: <CheckCircle className="w-6 h-6" />
    }
  ];

  const benefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Hızlı Erişim',
      description: 'Ana ekranınızdan tek tıkla erişim sağlayın'
    },
    {
      icon: <WifiOff className="w-8 h-8" />,
      title: 'Çevrimdışı Çalışma',
      description: 'İnternet olmadan da temel özellikleri kullanın'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Güvenli',
      description: 'HTTPS ile güvenli bağlantı ve veri koruması'
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: 'Native Deneyim',
      description: 'Mobil uygulama gibi doğal kullanıcı deneyimi'
    }
  ];

  const faqs = [
    {
      question: 'PWA nedir?',
      answer: 'Progressive Web App (PWA), web uygulamalarının mobil uygulama gibi çalışmasını sağlayan teknolojidir. Ana ekrana eklenebilir, çevrimdışı çalışabilir ve push bildirimleri gönderebilir.'
    },
    {
      question: 'Hangi tarayıcılar PWA\'yı destekler?',
      answer: 'Chrome, Safari, Firefox, Edge gibi modern tarayıcılar PWA desteği sunar. En iyi deneyim için Chrome veya Safari kullanmanızı öneririz.'
    },
    {
      question: 'PWA kurulumu ücretsiz mi?',
      answer: 'Evet, PWA kurulumu tamamen ücretsizdir. Herhangi bir ücret ödemeniz gerekmez.'
    },
    {
      question: 'PWA\'yı nasıl kaldırabilirim?',
      answer: 'Ana ekranınızdan PWA simgesine uzun basın ve "Kaldır" seçeneğini seçin. Bu işlem uygulamayı tamamen kaldıracaktır.'
    },
    {
      question: 'Çevrimdışı modda hangi özellikler çalışır?',
      answer: 'Çevrimdışı modda test sonuçlarınızı görüntüleyebilir, kariyer yollarını inceleyebilir ve temel navigasyon yapabilirsiniz.'
    }
  ];

  return (
    <div className="min-h-screen ai-gradient-bg p-6">
      {/* Home Button */}
      <div className="fixed top-4 left-4 z-50">
        <Link href="/">
          <button className="flex items-center space-x-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20 border border-white/20">
            <Globe className="w-5 h-5 text-white" />
            <span className="text-white font-medium">Ana Sayfa</span>
          </button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Smartphone className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Mobil Uygulama Deneyimi</h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Nebula Nexus'u ana ekranınıza ekleyin ve mobil uygulama gibi kullanın. 
            Çevrimdışı çalışma, hızlı erişim ve daha fazlası.
          </p>
        </motion.div>

        {/* PWA Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PWAStatus />
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">PWA Avantajları</h2>
            <p className="text-gray-400">Modern web teknolojileri ile geliştirilmiş deneyim</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="ai-card text-center hover:scale-105 transition-transform"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-white">
                    {benefit.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{benefit.title}</h3>
                <p className="text-gray-400">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Installation Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Kurulum Adımları</h2>
            <p className="text-gray-400">Birkaç basit adımda PWA'yı kurun</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {installationSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="ai-card relative"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {step.step}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                    <p className="text-gray-400 text-sm">{step.description}</p>
                  </div>
                </div>
                
                {index < installationSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                    <ArrowRight className="w-6 h-6 text-gray-600" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PWA Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Özellikler</h2>
            <p className="text-gray-400">PWA'nın sunduğu gelişmiş özellikler</p>
          </div>
          
          <PWAFeatures />
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Sık Sorulan Sorular</h2>
            <p className="text-gray-400">PWA hakkında merak edilenler</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                className="ai-card"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <Info className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-gray-400">{faq.answer}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <div className="ai-card bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border border-cyan-500/30">
            <h2 className="text-2xl font-bold text-white mb-4">Hemen Deneyin</h2>
            <p className="text-gray-400 mb-6">
              Nebula Nexus PWA'sını kurun ve mobil uygulama deneyimini yaşayın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/">
                <button className="ai-button-primary">
                  <Smartphone className="w-4 h-4 mr-2" />
                  Ana Sayfaya Git
                </button>
              </Link>
              <Link href="/dashboard">
                <button className="ai-button-secondary">
                  <Settings className="w-4 h-4 mr-2" />
                  Dashboard'u Aç
                </button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 