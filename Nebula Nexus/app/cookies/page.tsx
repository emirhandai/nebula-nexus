import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Cookie, Settings, Shield, Eye, Clock, Database } from 'lucide-react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center">
                <Cookie className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Çerez Politikası
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Web sitemizde kullanılan çerezler hakkında detaylı bilgi. Çerezlerin ne olduğunu, nasıl kullanıldığını ve nasıl kontrol edebileceğinizi öğrenin.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Çerez Nedir */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Cookie className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerez Nedir?</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  Çerezler, web sitemizi ziyaret ettiğinizde cihazınıza indirilen küçük metin dosyalarıdır. 
                  Bu dosyalar, web sitesinin sizi hatırlamasını ve deneyiminizi kişiselleştirmesini sağlar.
                </p>
                <p>
                  Çerezler şu amaçlarla kullanılır:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Oturum bilgilerinizi hatırlamak</li>
                  <li>Tercihlerinizi kaydetmek</li>
                  <li>Site performansını analiz etmek</li>
                  <li>Güvenliği artırmak</li>
                  <li>Kişiselleştirilmiş içerik sunmak</li>
                </ul>
              </div>
            </section>

            {/* Çerez Türleri */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Settings className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerez Türleri</h2>
              </div>
              <div className="space-y-6 text-gray-300">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Gerekli Çerezler</h3>
                  <p className="mb-2">Bu çerezler web sitesinin temel işlevlerini yerine getirmek için gereklidir:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Oturum yönetimi</li>
                    <li>Güvenlik kontrolleri</li>
                    <li>Form verilerinin korunması</li>
                    <li>Dil tercihleri</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Analitik Çerezler</h3>
                  <p className="mb-2">Site kullanımını analiz etmek ve performansı iyileştirmek için kullanılır:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Sayfa görüntüleme sayıları</li>
                    <li>Kullanıcı davranışları</li>
                    <li>Site navigasyonu</li>
                    <li>Hata raporları</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Fonksiyonel Çerezler</h3>
                  <p className="mb-2">Kullanıcı deneyimini geliştirmek için kullanılır:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kişiselleştirilmiş içerik</li>
                    <li>Tercih ayarları</li>
                    <li>Hatırlatmalar</li>
                    <li>Sosyal medya entegrasyonu</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Güvenlik Çerezleri</h3>
                  <p className="mb-2">Platform güvenliğini sağlamak için kullanılır:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Kimlik doğrulama</li>
                    <li>Yetkilendirme</li>
                    <li>Güvenlik kontrolleri</li>
                    <li>DDoS koruması</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Çerez Süreleri */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Clock className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerez Süreleri</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Çerezlerimiz farklı sürelerde saklanır:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Oturum Çerezleri:</strong> Tarayıcı kapatıldığında silinir</li>
                  <li><strong>Kalıcı Çerezler:</strong> Belirlenen süre boyunca saklanır (1 ay - 1 yıl)</li>
                  <li><strong>Analitik Çerezleri:</strong> 2 yıl boyunca saklanır</li>
                  <li><strong>Güvenlik Çerezleri:</strong> 30 gün boyunca saklanır</li>
                </ul>
              </div>
            </section>

            {/* Üçüncü Taraf Çerezler */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Üçüncü Taraf Çerezler</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Platformumuzda aşağıdaki üçüncü taraf hizmetler kullanılmaktadır:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Google Analytics:</strong> Site kullanım analizi</li>
                  <li><strong>Google Fonts:</strong> Web fontları</li>
                  <li><strong>Google Gemini:</strong> AI sohbet özelliği</li>
                  <li><strong>NextAuth.js:</strong> Kimlik doğrulama</li>
                </ul>
                <p className="mt-4">
                  Bu hizmetlerin kendi çerez politikaları bulunmaktadır. Detaylar için ilgili hizmet sağlayıcılarının 
                  web sitelerini ziyaret edebilirsiniz.
                </p>
              </div>
            </section>

            {/* Çerez Kontrolü */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerez Kontrolü</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Çerezleri kontrol etmek ve yönetmek için seçenekleriniz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Tarayıcı Ayarları:</strong> Çerezleri etkinleştirme/devre dışı bırakma</li>
                  <li><strong>Çerez Silme:</strong> Mevcut çerezleri silme</li>
                  <li><strong>Gizli Mod:</strong> Çerezleri geçici olarak devre dışı bırakma</li>
                  <li><strong>Üçüncü Taraf Engelleme:</strong> Üçüncü taraf çerezleri engelleme</li>
                </ul>
                <div className="bg-gray-800/50 rounded-lg p-6 mt-4">
                  <h4 className="text-white font-semibold mb-3">Popüler Tarayıcılar için Çerez Ayarları:</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                    <li><strong>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                    <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
                    <li><strong>Edge:</strong> Ayarlar → Çerezler ve site izinleri</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Çerez Etkileri */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Çerezleri Devre Dışı Bırakmanın Etkileri</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Çerezleri devre dışı bırakırsanız aşağıdaki durumlarla karşılaşabilirsiniz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Her seferinde tekrar giriş yapmanız gerekebilir</li>
                  <li>Tercihleriniz kaydedilmeyebilir</li>
                  <li>Bazı özellikler düzgün çalışmayabilir</li>
                  <li>Kişiselleştirilmiş içerik gösterilemeyebilir</li>
                  <li>Site performansı etkilenebilir</li>
                </ul>
                <p className="mt-4">
                  <strong>Not:</strong> Gerekli çerezler platformun temel işlevleri için kritik öneme sahiptir. 
                  Bu çerezleri devre dışı bırakmanız platform kullanımınızı olumsuz etkileyebilir.
                </p>
              </div>
            </section>

            {/* Güncellemeler */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Politika Güncellemeleri</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Bu çerez politikasını zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacak 
                  ve yayınlandığı tarihten itibaren geçerli olacaktır.
                </p>
                <p>
                  Önemli değişiklikler durumunda kullanıcılarımızı e-posta ile bilgilendireceğiz.
                </p>
              </div>
            </section>

            {/* İletişim */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">İletişim</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Çerez politikamızla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <p><strong>E-posta:</strong> cookies@nebula-nexus.com</p>
                  <p><strong>Adres:</strong> Türkiye</p>
                  <p><strong>Konu:</strong> Çerez Politikası</p>
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