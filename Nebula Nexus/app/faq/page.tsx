'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Search,
  MessageSquare,
  Brain,
  Target,
  Shield,
  Zap,
  Users,
  BookOpen,
  Star
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const categories = [
    { id: 'all', name: 'Tümü', icon: HelpCircle, color: 'from-purple-500 to-pink-600' },
    { id: 'general', name: 'Genel', icon: MessageSquare, color: 'from-cyan-500 to-blue-600' },
    { id: 'test', name: 'Test', icon: Brain, color: 'from-green-500 to-emerald-600' },
    { id: 'career', name: 'Kariyer', icon: Target, color: 'from-yellow-500 to-orange-600' },
    { id: 'technical', name: 'Teknik', icon: Zap, color: 'from-red-500 to-pink-600' },
    { id: 'account', name: 'Hesap', icon: Users, color: 'from-indigo-500 to-purple-600' }
  ];

  const faqData: FAQItem[] = [
    {
      id: '1',
      question: 'Nebula Nexus nasıl çalışır?',
      answer: 'Nebula Nexus, OCEAN kişilik testi ve O*NET ilgi testi ile kişilik profilinizi analiz eder. Google Gemini AI teknolojisi kullanarak size en uygun yazılım alanlarını önerir ve kişiselleştirilmiş kariyer yol haritası sunar. Test sonuçlarınıza göre AI destekli sohbet özelliği ile detaylı kariyer tavsiyeleri alabilirsiniz.',
      category: 'general',
      icon: Brain,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: '2',
      question: 'OCEAN testi nedir ve neden güvenilir?',
      answer: 'OCEAN testi, kişiliğin beş ana boyutunu ölçen bilimsel olarak kanıtlanmış bir kişilik testidir: Açıklık (Openness), Sorumluluk (Conscientiousness), Dışadönüklük (Extraversion), Uyumluluk (Agreeableness) ve Duygusal Denge (Neuroticism). 50+ yıllık araştırma geçmişi ile psikoloji alanında en güvenilir testlerden biridir.',
      category: 'test',
      icon: Brain,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: '3',
      question: 'O*NET testi nedir?',
      answer: 'O*NET (Occupational Information Network) testi, mesleki ilgi alanlarınızı ve yeteneklerinizi değerlendiren kapsamlı bir testtir. Bu test, OCEAN kişilik testi ile birlikte kullanılarak size en uygun yazılım alanlarını belirlememize yardımcı olur.',
      category: 'test',
      icon: Target,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '4',
      question: 'Test sonuçları ne kadar doğru?',
      answer: 'Test sonuçlarımız bilimsel OCEAN ve O*NET testi metodolojisi kullanarak oluşturulmuştur. Google Gemini AI teknolojisi ile desteklenen analiz sistemi, kişilik profilinizi ve ilgi alanlarınızı en doğru şekilde değerlendirir. Sonuçlar sürekli olarak güncellenir ve iyileştirilir.',
      category: 'test',
      icon: Target,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '5',
      question: 'Hangi yazılım alanları öneriliyor?',
      answer: 'Sistemimiz kişilik profilinize ve ilgi alanlarınıza göre en uygun yazılım alanlarını belirler. Önerilen alanlar arasında: Yapay Zeka & Makine Öğrenmesi, Web Geliştirme, Mobil Geliştirme, Siber Güvenlik, Veri Bilimi, DevOps, Blockchain, IoT, AR/VR, Oyun Geliştirme, UI/UX Tasarımı ve daha fazlası bulunur.',
      category: 'career',
      icon: Target,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: '6',
      question: 'AI sohbet özelliği nasıl çalışır?',
      answer: 'AI sohbet özelliği, Google Gemini teknolojisi ile desteklenir. Kişilik testi sonuçlarınızı analiz ederek size özel kariyer tavsiyeleri verir. Kişilik adaptasyonu ve zaman bazlı context özellikleri ile daha kişiselleştirilmiş deneyim sunar. 7/24 erişilebilir ve sürekli öğrenen bir sistemdir.',
      category: 'technical',
      icon: MessageSquare,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: '7',
      question: 'Verilerim güvende mi?',
      answer: 'Evet, tüm verileriniz end-to-end şifreleme ile korunur. GDPR uyumlu veri işleme politikalarımız vardır. Verileriniz üçüncü taraflarla paylaşılmaz ve sadece size özel kariyer önerileri için kullanılır. Güvenlik logları tutulur ve şüpheli aktiviteler izlenir.',
      category: 'account',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: '8',
      question: 'Testi kaç kez çözebilirim?',
      answer: 'Testi istediğiniz kadar çözebilirsiniz. Kişilik değişimlerinizi takip etmek için düzenli olarak test çözmenizi öneririz. Her test sonucu kaydedilir ve gelişiminizi izleyebilirsiniz. Önceki sonuçlarınızla karşılaştırma yapabilirsiniz.',
      category: 'test',
      icon: Brain,
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: '9',
      question: 'Kariyer önerileri nasıl oluşturuluyor?',
      answer: 'Kariyer önerileri, OCEAN kişilik testi ve O*NET ilgi testi sonuçlarınızın Google Gemini AI tarafından analiz edilmesiyle oluşturulur. AI, kişilik özelliklerinizi, ilgi alanlarınızı ve güncel iş pazarı trendlerini değerlendirerek size en uygun yazılım alanlarını önerir.',
      category: 'career',
      icon: Target,
      color: 'from-cyan-500 to-blue-600'
    },
    {
      id: '10',
      question: 'Ücretsiz mi yoksa ücretli mi?',
      answer: 'Nebula Nexus tamamen ücretsizdir! Tüm özelliklerimiz ücretsiz olarak kullanılabilir. OCEAN ve O*NET testleri, kariyer önerileri, AI sohbet özelliği ve tüm diğer özellikler herhangi bir ücret olmadan erişilebilir.',
      category: 'account',
      icon: Users,
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: '11',
      question: 'AI sohbet özelliği nasıl yardımcı olur?',
      answer: 'AI sohbet özelliği, kişilik testi sonuçlarınızı analiz ederek size özel kariyer tavsiyeleri verir. Kişilik adaptasyonu ve zaman bazlı context özellikleri ile daha kişiselleştirilmiş deneyim sunar. Kariyer hedefleriniz, öğrenme yolları ve sonraki adımlar hakkında detaylı bilgi alabilirsiniz.',
      category: 'career',
      icon: BookOpen,
      color: 'from-yellow-500 to-orange-600'
    },
    {
      id: '12',
      question: 'Mobil uygulama var mı?',
      answer: 'Şu anda web uygulaması olarak hizmet veriyoruz. Web sitemiz mobil cihazlarda mükemmel çalışır ve responsive tasarım ile tüm cihazlarda optimal deneyim sunar.',
      category: 'technical',
      icon: Zap,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: '13',
      question: 'Hesabımı nasıl silebilirim?',
      answer: 'Hesap ayarlarından hesabınızı silebilirsiniz. Hesap silme işlemi geri alınamaz ve tüm verileriniz kalıcı olarak silinir. Bu işlem öncesinde verilerinizi yedeklemenizi öneririz.',
      category: 'account',
      icon: Shield,
      color: 'from-indigo-500 to-purple-600'
    },
    {
      id: '14',
      question: 'AI sohbet özelliğinde hangi özellikler var?',
      answer: 'AI sohbet özelliği, kişilik adaptasyonu, zaman bazlı context, kullanıcı tercihleri öğrenme gibi gelişmiş özelliklere sahiptir. OCEAN skorlarınıza göre yanıt tonu değişir, günün saati ve haftanın gününe göre öneriler sunar.',
      category: 'technical',
      icon: MessageSquare,
      color: 'from-red-500 to-pink-600'
    },
    {
      id: '15',
      question: 'Test sonuçlarımı nasıl yorumlayabilirim?',
      answer: 'Test sonuçlarınız dashboard sayfasında detaylı olarak görüntülenir. OCEAN skorlarınız, önerilen kariyer alanları ve AI tarafından oluşturulan detaylı analiz raporları bulunur. AI sohbet özelliği ile sonuçlarınız hakkında daha fazla bilgi alabilirsiniz.',
      category: 'test',
      icon: Brain,
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Sık Sorulan Sorular
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Nebula Nexus hakkında merak ettiğiniz her şeyi burada bulabilirsiniz. 
              AI destekli kariyer yolculuğunuzda size yardımcı oluyoruz.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-2xl mx-auto mb-12"
          >
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Sorularınızı arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-black/20 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300"
              />
            </div>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category, index) => (
                <motion.button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${
                    activeCategory === category.id
                      ? 'border-cyan-500 bg-cyan-500/10 ai-glow'
                      : 'border-gray-600 bg-black/20 hover:border-cyan-400 hover:bg-cyan-500/5'
                  }`}
                >
                  <div className={`w-5 h-5 bg-gradient-to-r ${category.color} rounded-lg flex items-center justify-center`}>
                    <category.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-white font-medium">{category.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="space-y-4">
              {filteredFAQs.map((faq, index) => (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="ai-card rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-black/10 transition-colors duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${faq.color} rounded-xl flex items-center justify-center ai-glow`}>
                        <faq.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">{faq.question}</h3>
                        <p className="text-gray-400 text-sm">
                          {categories.find(cat => cat.id === faq.category)?.name} • 
                          {expandedItems.has(faq.id) ? ' Açık' : ' Kapalı'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {expandedItems.has(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-cyan-400" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {expandedItems.has(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0">
                          <div className="border-t border-gray-700 pt-6">
                            <p className="text-gray-300 leading-relaxed">{faq.answer}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 bg-gradient-to-r from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">Sonuç Bulunamadı</h3>
                <p className="text-gray-400">Arama kriterlerinize uygun soru bulunamadı. Farklı kelimeler deneyebilir veya kategorileri değiştirebilirsiniz.</p>
              </motion.div>
            )}
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-center mt-16"
          >
            <div className="ai-card p-8 rounded-3xl">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mb-6 ai-glow">
                <MessageSquare className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-4">Hala Sorunuz mu Var?</h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Burada cevabını bulamadığınız sorularınız için bizimle iletişime geçebilirsiniz. 
                AI destekli ekibimiz size yardımcı olmaktan mutluluk duyar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/contact"
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  İletişime Geç
                  <MessageSquare className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
                </motion.a>
                <motion.a
                  href="/chat"
                  className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300 flex items-center justify-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  AI ile Sohbet Et
                  <Brain className="w-5 h-5 ml-2 group-hover:scale-110 transition-transform duration-300" />
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