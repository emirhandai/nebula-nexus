'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { HelpCircle, Search, BookOpen, MessageSquare, Brain, Users, FileText, ChevronDown, ChevronUp, X, ExternalLink, Play, CheckCircle, Star, Zap, TrendingUp, Briefcase, Plus, Folder, User, Lock } from 'lucide-react';

export default function HelpCenter() {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const faqData = [
    {
      question: "OCEAN testi nasıl çalışır?",
      answer: "OCEAN testi, kişiliğinizin 5 ana boyutunu ölçer: Açıklık (Openness), Sorumluluk (Conscientiousness), Dışadönüklük (Extraversion), Uyumluluk (Agreeableness) ve Nörotiklik (Neuroticism). Test sonuçlarınız, kariyer önerilerinizi kişiselleştirmek için kullanılır."
    },
    {
      question: "AI sohbet özelliğini nasıl kullanabilirim?",
      answer: "AI sohbet özelliği, kariyer danışmanlığı için tasarlanmıştır. Kariyer hedefleriniz, becerileriniz veya endişeleriniz hakkında sorular sorabilirsiniz. AI, OCEAN test sonuçlarınızı ve seçtiğiniz alanı dikkate alarak size özel öneriler sunar."
    },
    {
      question: "Kariyer yol haritamı nasıl oluşturabilirim?",
      answer: "Kariyer yol haritanız otomatik olarak oluşturulur. OCEAN testini tamamladıktan ve bir alan seçtikten sonra, sistem size özel bir kariyer planı hazırlar. Bu plan, becerilerinizi geliştirmek için önerilen adımları içerir."
    },
    {
      question: "Proje dayanışması sistemini nasıl kullanabilirim?",
      answer: "Proje dayanışması sistemi ile ekip kurabilir veya mevcut projelere katılabilirsiniz. 'Proje Oluştur' butonuna tıklayarak yeni bir proje başlatabilir, 'İlan Ver' ile aradığınız rolleri duyurabilirsiniz."
    },
    {
      question: "Forum'da nasıl etkileşim kurabilirim?",
      answer: "Forum'da kategorilere göre postlar oluşturabilir, mevcut postlara yorum yapabilir ve beğenebilirsiniz. Kullanıcı seviyeleri ve rozetler kazanarak toplulukta aktif bir üye olabilirsiniz."
    },
    {
      question: "Hesabımı nasıl silebilirim?",
      answer: "Hesabınızı silmek için profil sayfanızdaki 'Güvenlik' bölümünde 'Hesabı Sil' butonunu kullanabilirsiniz. Hesap silme işlemi geri alınamaz ve tüm verileriniz kalıcı olarak silinir."
    },
    {
      question: "Verilerim güvenli mi?",
      answer: "Evet, verileriniz güvenlidir. SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri ile verilerinizi koruyoruz. Detaylı bilgi için Gizlilik Politikası ve KVKK sayfalarımızı inceleyebilirsiniz."
    },
    {
      question: "Teknik sorunlar yaşıyorum, ne yapmalıyım?",
      answer: "Teknik sorunlar için önce tarayıcınızı yenileyin ve çerezleri temizleyin. Sorun devam ederse, destek ekibimizle iletişime geçebilirsiniz. Sorununuzu detaylı bir şekilde açıklayarak daha hızlı yardım alabiliriz."
    }
  ];

  const helpCategories = [
    {
      title: "OCEAN Testi",
      description: "Kişilik analizi ve test süreci hakkında bilgiler",
      icon: Brain,
      color: "from-blue-500 to-purple-600",
      detailedInfo: {
        overview: "OCEAN testi, kişiliğinizin 5 ana boyutunu bilimsel olarak ölçen gelişmiş bir kişilik analizi sistemidir.",
        features: [
          "50+ bilimsel soru ile kapsamlı analiz",
          "Gerçek zamanlı sonuç hesaplama",
          "Kişiselleştirilmiş kariyer önerileri",
          "Detaylı kişilik raporu",
          "Gelişim alanları tespiti"
        ],
        steps: [
          "Test sayfasına gidin ve 'Başla' butonuna tıklayın",
          "Her soruyu samimi bir şekilde yanıtlayın",
          "Test tamamlandığında sonuçlarınızı görüntüleyin",
          "Kişilik raporunuzu inceleyin ve kariyer önerilerini alın"
        ],
        tips: [
          "Soruları acele etmeden, düşünerek yanıtlayın",
          "Kendinizi olduğunuz gibi değerlendirin",
          "Test sırasında ara verebilirsiniz",
          "Sonuçlarınızı düzenli olarak güncelleyebilirsiniz"
        ],
        relatedLinks: [
          { name: "Testi Başlat", url: "/test", icon: Play },
          { name: "Sonuçlarım", url: "/results", icon: CheckCircle },
          { name: "Kişilik Analizi", url: "/personality-analysis", icon: Brain }
        ]
      }
    },
    {
      title: "AI Sohbet",
      description: "Yapay zeka destekli kariyer danışmanlığı",
      icon: MessageSquare,
      color: "from-green-500 to-blue-600",
      detailedInfo: {
        overview: "Google Gemini AI destekli akıllı sohbet sistemi ile kariyer danışmanlığı alın ve kişisel gelişim yolculuğunuzda rehberlik edin.",
        features: [
          "7/24 AI kariyer danışmanı",
          "Kişilik analizi tabanlı öneriler",
          "Kariyer hedefi belirleme desteği",
          "Beceri geliştirme tavsiyeleri",
          "İş piyasası trendleri hakkında bilgi"
        ],
        steps: [
          "Sohbet sayfasına gidin",
          "Kariyer hedefleriniz hakkında sorular sorun",
          "AI'dan kişiselleştirilmiş öneriler alın",
          "Sohbet geçmişinizi kaydedin ve takip edin"
        ],
        tips: [
          "Spesifik sorular sorarak daha iyi yanıtlar alın",
          "Kariyer hedeflerinizi net bir şekilde belirtin",
          "AI önerilerini not alın ve uygulayın",
          "Düzenli olarak sohbet ederek gelişiminizi takip edin"
        ],
        relatedLinks: [
          { name: "AI Sohbet", url: "/chat", icon: MessageSquare },
          { name: "Sohbet Geçmişi", url: "/chat/history", icon: BookOpen },
          { name: "Akıllı Öneriler", url: "/chat/suggestions", icon: Zap }
        ]
      }
    },
    {
      title: "Kariyer Yol Haritası",
      description: "Kişiselleştirilmiş kariyer planı oluşturma",
      icon: BookOpen,
      color: "from-purple-500 to-pink-600",
      detailedInfo: {
        overview: "Kişilik analiziniz ve seçtiğiniz alan bazında size özel kapsamlı kariyer yol haritası oluşturun.",
        features: [
          "Kişiselleştirilmiş kariyer planı",
          "Adım adım gelişim rehberi",
          "Beceri değerlendirme araçları",
          "Öğrenme kaynakları önerileri",
          "İlerleme takip sistemi"
        ],
        steps: [
          "OCEAN testini tamamlayın",
          "Kariyer alanınızı seçin",
          "Otomatik yol haritası oluşturun",
          "Adımları takip ederek gelişiminizi sürdürün"
        ],
        tips: [
          "Yol haritanızı düzenli olarak güncelleyin",
          "Her adımı tamamladıktan sonra bir sonrakine geçin",
          "Zorluk yaşadığınız alanlarda AI'dan yardım alın",
          "Başarılarınızı kutlayın ve motivasyonunuzu koruyun"
        ],
        relatedLinks: [
          { name: "Yol Haritam", url: "/career-roadmap", icon: BookOpen },
          { name: "İlerleme Takibi", url: "/progress", icon: TrendingUp },
          { name: "Öğrenme Kaynakları", url: "/resources", icon: Star }
        ]
      }
    },
    {
      title: "Proje Dayanışması",
      description: "Ekip kurma ve iş ilanı sistemi",
      icon: Users,
      color: "from-orange-500 to-red-600",
      detailedInfo: {
        overview: "Yazılım projelerinde ekip kurun, iş ilanları verin ve kariyer fırsatlarını keşfedin.",
        features: [
          "Proje oluşturma ve yönetimi",
          "Ekip üyesi arama sistemi",
          "İş ilanı yayınlama",
          "Proje portföyü oluşturma",
          "Gerçek zamanlı işbirliği araçları"
        ],
        steps: [
          "Proje oluştur butonuna tıklayın",
          "Proje detaylarını ve gereksinimlerini belirtin",
          "Ekip üyelerini davet edin veya ilan verin",
          "Projeyi yönetin ve geliştirin"
        ],
        tips: [
          "Proje açıklamanızı net ve detaylı yazın",
          "Gerekli becerileri ve deneyim seviyesini belirtin",
          "Düzenli iletişim kurun ve güncellemeler paylaşın",
          "Proje tamamlandığında portföyünüze ekleyin"
        ],
        relatedLinks: [
          { name: "Projelerim", url: "/projects", icon: Users },
          { name: "İş İlanları", url: "/jobs", icon: Briefcase },
          { name: "Ekip Kur", url: "/projects/create", icon: Plus }
        ]
      }
    },
    {
      title: "Forum",
      description: "Topluluk etkileşimi ve deneyim paylaşımı",
      icon: FileText,
      color: "from-indigo-500 to-purple-600",
      detailedInfo: {
        overview: "Yazılım topluluğu ile etkileşim kurun, deneyimlerinizi paylaşın ve yeni bağlantılar kurun.",
        features: [
          "Kategori bazlı forum tartışmaları",
          "Deneyim paylaşımı ve soru-cevap",
          "Kullanıcı seviye sistemi ve rozetler",
          "Topluluk kuralları ve moderasyon",
          "Arama ve filtreleme özellikleri"
        ],
        steps: [
          "Forum sayfasına gidin",
          "İlgili kategoriyi seçin",
          "Post oluşturun veya mevcut postlara katılın",
          "Topluluk kurallarına uygun davranın"
        ],
        tips: [
          "Arama yaparak benzer konuları kontrol edin",
          "Yapıcı ve saygılı yorumlar yazın",
          "Deneyimlerinizi paylaşarak topluluğa katkıda bulunun",
          "Rozetler kazanarak seviyenizi yükseltin"
        ],
        relatedLinks: [
          { name: "Forum Ana Sayfa", url: "/forum", icon: FileText },
          { name: "Kategoriler", url: "/forum/categories", icon: Folder },
          { name: "Popüler Konular", url: "/forum/popular", icon: TrendingUp }
        ]
      }
    },
    {
      title: "Hesap Yönetimi",
      description: "Profil ayarları ve güvenlik",
      icon: HelpCircle,
      color: "from-teal-500 to-green-600",
      detailedInfo: {
        overview: "Hesap ayarlarınızı yönetin, güvenlik önlemlerinizi alın ve profil bilgilerinizi güncelleyin.",
        features: [
          "Profil bilgileri düzenleme",
          "Şifre değiştirme ve güvenlik ayarları",
          "Bildirim tercihleri",
          "Gizlilik ayarları",
          "Hesap silme ve veri yönetimi"
        ],
        steps: [
          "Profil sayfanıza gidin",
          "Ayarlar bölümünü seçin",
          "İstediğiniz değişiklikleri yapın",
          "Değişiklikleri kaydedin"
        ],
        tips: [
          "Şifrenizi düzenli olarak değiştirin",
          "İki faktörlü doğrulamayı etkinleştirin",
          "Gizlilik ayarlarınızı kontrol edin",
          "Önemli değişikliklerden önce yedek alın"
        ],
        relatedLinks: [
          { name: "Profil Ayarları", url: "/profile", icon: User },
          { name: "Güvenlik", url: "/profile/security", icon: Shield },
          { name: "Gizlilik", url: "/privacy", icon: Lock }
        ]
      }
    }
  ];

  const filteredFaq = faqData.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryClick = (category: any) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Yardım Merkezi
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nebula Nexus platformunu daha etkili kullanmak için ihtiyacınız olan tüm bilgiler burada.
            </p>
          </div>

          {/* Search */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Yardım arayın..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              />
            </div>
          </div>

          {/* Help Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {helpCategories.map((category, index) => (
              <div 
                key={index} 
                className="ai-card hover:transform hover:scale-105 transition-all duration-300 cursor-pointer group"
                onClick={() => handleCategoryClick(category)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors duration-300">{category.title}</h3>
                <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{category.description}</p>
                <div className="mt-4 flex items-center text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">Detayları Gör</span>
                  <ExternalLink className="w-4 h-4 ml-2" />
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Sık Sorulan Sorular
            </h2>
            <div className="space-y-4">
              {filteredFaq.map((faq, index) => (
                <div key={index} className="ai-card">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-semibold text-white pr-4">{faq.question}</h3>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFaq === index && (
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <p className="text-gray-300">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-16 text-center">
            <div className="ai-card max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-4">
                Hala yardıma mı ihtiyacınız var?
              </h3>
              <p className="text-gray-400 mb-6">
                Sorularınızı yanıtlamak için buradayız. Destek ekibimizle iletişime geçin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/contact"
                  className="btn-primary px-8 py-3"
                >
                  İletişime Geç
                </a>
                <a
                  href="/feedback"
                  className="btn-secondary px-8 py-3"
                >
                  Geri Bildirim Ver
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Category Detail Modal */}
      {showModal && selectedCategory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900/95 border border-gray-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${selectedCategory.color} rounded-xl flex items-center justify-center`}>
                  <selectedCategory.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedCategory.title}</h2>
                  <p className="text-gray-400">{selectedCategory.description}</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-8">
              {/* Overview */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Star className="w-5 h-5 text-yellow-400 mr-2" />
                  Genel Bakış
                </h3>
                <p className="text-gray-300 leading-relaxed">{selectedCategory.detailedInfo.overview}</p>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  Özellikler
                </h3>
                <ul className="space-y-2">
                  {selectedCategory.detailedInfo.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Steps */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Play className="w-5 h-5 text-blue-400 mr-2" />
                  Nasıl Kullanılır?
                </h3>
                <div className="space-y-3">
                  {selectedCategory.detailedInfo.steps.map((step: string, index: number) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-sm font-medium">{index + 1}</span>
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <Zap className="w-5 h-5 text-yellow-400 mr-2" />
                  İpuçları
                </h3>
                <ul className="space-y-2">
                  {selectedCategory.detailedInfo.tips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-300">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Related Links */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <ExternalLink className="w-5 h-5 text-purple-400 mr-2" />
                  İlgili Sayfalar
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {selectedCategory.detailedInfo.relatedLinks.map((link: any, index: number) => (
                    <a
                      key={index}
                      href={link.url}
                      className="flex items-center space-x-2 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                      <span className="text-gray-300 group-hover:text-white transition-colors duration-200 text-sm">
                        {link.name}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-700 flex justify-end">
              <button
                onClick={closeModal}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 