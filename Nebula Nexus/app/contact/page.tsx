'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  MessageSquare,
  Users,
  Globe,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simüle edilmiş form gönderimi
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Mesajınız başarıyla gönderildi! En kısa sürede size dönüş yapacağız.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'E-posta',
      value: 'Yakında Gelecek',
      description: '7/24 e-posta desteği',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      icon: Phone,
      title: 'Telefon',
      value: 'Yakında Gelecek',
      description: 'Pazartesi - Cuma 09:00-18:00',
      color: 'from-green-500 to-emerald-600'
    },
    {
      icon: MapPin,
      title: 'Adres',
      value: 'Karabük, Türkiye',
      description: 'Merkez ofis',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      value: '09:00 - 18:00',
      description: 'Pazartesi - Cuma',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const faqs = [
    {
      question: 'Nebula Nexus nasıl çalışır?',
      answer: 'OCEAN kişilik testi ile kişilik profilinizi analiz eder, AI teknolojisi ile size en uygun yazılım alanlarını önerir.'
    },
    {
      question: 'Test sonuçları güvenilir mi?',
      answer: 'Evet, bilimsel olarak kanıtlanmış OCEAN testi ve gelişmiş AI algoritmaları kullanıyoruz.'
    },
    {
      question: 'Ücretsiz mi?',
      answer: 'Temel özellikler ücretsizdir. Premium özellikler için ücretli planlarımız bulunmaktadır.'
    },
    {
      question: 'Verilerim güvende mi?',
      answer: 'Tüm verileriniz şifrelenmiş olarak saklanır ve üçüncü taraflarla paylaşılmaz.'
    }
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
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl mb-6 ai-glow">
              <MessageSquare className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              İletişim
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Sorularınız mı var? Size yardımcı olmaktan mutluluk duyarız. 
              Nebula Nexus ekibi ile iletişime geçin.
            </p>
          </motion.div>

          {/* Contact Info Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16"
          >
            {contactInfo.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="ai-card p-6 rounded-2xl text-center hover:scale-105 transition-transform duration-300"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-4 ai-glow`}>
                  <info.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{info.title}</h3>
                <p className="text-cyan-400 font-medium mb-1">{info.value}</p>
                <p className="text-gray-400 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="ai-card p-8 rounded-3xl">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mr-4">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Mesaj Gönder</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-white font-medium mb-2">Ad Soyad</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="Adınız ve soyadınız"
                      />
                    </div>
                    <div>
                      <label className="block text-white font-medium mb-2">E-posta</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                        placeholder="ornek@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Konu</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full p-4 bg-black/20 border border-gray-600 rounded-2xl text-white focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
                    >
                      <option value="">Konu seçin</option>
                      <option value="genel">Genel Bilgi</option>
                      <option value="teknik">Teknik Destek</option>
                      <option value="isbirligi">İş Birliği</option>
                      <option value="oneri">Öneri/Şikayet</option>
                      <option value="diger">Diğer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">Mesaj</label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full p-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 resize-none"
                      placeholder="Mesajınızı buraya yazın..."
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        Mesaj Gönder
                        <Send className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </motion.button>
                </form>
              </div>
            </motion.div>

            {/* FAQ Section */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="ai-card p-8 rounded-3xl">
                <div className="flex items-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mr-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-white">Sık Sorulan Sorular</h2>
                </div>

                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      className="p-6 rounded-2xl border border-gray-700 hover:border-cyan-500 transition-colors duration-300"
                    >
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                        {faq.question}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="ai-card p-8 rounded-3xl">
              <h2 className="text-3xl font-bold text-white mb-4">Hemen Başlayın</h2>
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