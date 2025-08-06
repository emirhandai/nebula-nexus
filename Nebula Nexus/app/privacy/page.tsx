import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, Eye, Lock, Database, Users, Bell } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Gizlilik Politikası
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Kişisel verilerinizin güvenliği bizim için çok önemli. Bu politika, verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu açıklar.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Veri Toplama */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Toplama</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Nebula Nexus olarak, hizmetlerimizi geliştirmek ve size daha iyi bir deneyim sunmak için aşağıdaki verileri topluyoruz:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Hesap Bilgileri:</strong> Ad, e-posta, profil fotoğrafı</li>
                  <li><strong>Kullanım Verileri:</strong> Test sonuçları, sohbet geçmişi, aktivite logları</li>
                  <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri, cihaz bilgileri</li>
                  <li><strong>OCEAN Test Sonuçları:</strong> Kişilik analizi verileriniz</li>
                </ul>
              </div>
            </section>

            {/* Veri Kullanımı */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Kullanımı</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Topladığımız verileri şu amaçlarla kullanıyoruz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kişiselleştirilmiş kariyer önerileri sunmak</li>
                  <li>OCEAN testi sonuçlarını analiz etmek</li>
                  <li>AI sohbet özelliğini geliştirmek</li>
                  <li>Platform güvenliğini sağlamak</li>
                  <li>Hizmet kalitesini artırmak</li>
                  <li>Yasal yükümlülükleri yerine getirmek</li>
                </ul>
              </div>
            </section>

            {/* Veri Güvenliği */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Güvenliği</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Verilerinizin güvenliği için şu önlemleri alıyoruz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>SSL/TLS şifreleme ile veri iletimi</li>
                  <li>Güvenli veri depolama sistemleri</li>
                  <li>Düzenli güvenlik denetimleri</li>
                  <li>Erişim kontrolü ve yetkilendirme</li>
                  <li>Veri yedekleme ve felaket kurtarma planları</li>
                </ul>
              </div>
            </section>

            {/* Veri Paylaşımı */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Paylaşımı</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Kişisel verilerinizi üçüncü taraflarla paylaşmıyoruz, ancak şu durumlar hariç:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Yasal zorunluluk durumunda</li>
                  <li>Açık rızanız olduğunda</li>
                  <li>Hizmet sağlayıcılarımızla (sadece gerekli veriler)</li>
                  <li>Güvenlik tehditlerine karşı koruma için</li>
                </ul>
              </div>
            </section>

            {/* Çerezler */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Bell className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerezler</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Web sitemizde çerezler kullanıyoruz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Gerekli Çerezler:</strong> Temel işlevsellik için</li>
                  <li><strong>Analitik Çerezler:</strong> Kullanım istatistikleri için</li>
                  <li><strong>Fonksiyonel Çerezler:</strong> Kişiselleştirme için</li>
                  <li><strong>Güvenlik Çerezleri:</strong> Güvenlik için</li>
                </ul>
                <p className="mt-4">
                  Tarayıcı ayarlarınızdan çerezleri kontrol edebilir veya silebilirsiniz.
                </p>
              </div>
            </section>

            {/* Haklarınız */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Haklarınız</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kişisel verilerinize erişim hakkı</li>
                  <li>Verilerinizin düzeltilmesini talep etme hakkı</li>
                  <li>Verilerinizin silinmesini talep etme hakkı</li>
                  <li>Veri işlemeye itiraz etme hakkı</li>
                  <li>Verilerinizin taşınabilirliği hakkı</li>
                  <li>İşleme kısıtlaması talep etme hakkı</li>
                </ul>
              </div>
            </section>

            {/* İletişim */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">İletişim</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Gizlilik politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <p><strong>E-posta:</strong> privacy@nebula-nexus.com</p>
                  <p><strong>Adres:</strong> Türkiye</p>
                  <p><strong>Konu:</strong> Gizlilik Politikası</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 