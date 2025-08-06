import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FileText, AlertTriangle, CheckCircle, XCircle, Users, Shield } from 'lucide-react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Kullanım Şartları
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Nebula Nexus platformunu kullanarak aşağıdaki şartları kabul etmiş sayılırsınız. Bu şartlar platform kullanımınızı düzenler.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Genel Kurallar */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Genel Kurallar</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Platformumuzu kullanırken aşağıdaki kurallara uymanız gerekmektedir:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Doğru ve güncel bilgiler sağlamak</li>
                  <li>Başkalarının haklarına saygı göstermek</li>
                  <li>Platform güvenliğini tehdit edecek davranışlardan kaçınmak</li>
                  <li>Telif hakkı ve fikri mülkiyet haklarına uymak</li>
                  <li>Yasal düzenlemelere uygun hareket etmek</li>
                </ul>
              </div>
            </section>

            {/* Yasaklı Davranışlar */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <XCircle className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Yasaklı Davranışlar</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Aşağıdaki davranışlar kesinlikle yasaktır:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Yanıltıcı veya sahte bilgi paylaşımı</li>
                  <li>Başkalarını taciz etme veya rahatsız etme</li>
                  <li>Spam veya istenmeyen içerik gönderme</li>
                  <li>Platform güvenlik sistemlerini atlatmaya çalışma</li>
                  <li>Başkalarının hesaplarını ele geçirmeye çalışma</li>
                  <li>Yasadışı içerik paylaşımı</li>
                  <li>Platform performansını etkileyecek aşırı kullanım</li>
                </ul>
              </div>
            </section>

            {/* Hizmet Kapsamı */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Shield className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Hizmet Kapsamı</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Nebula Nexus size aşağıdaki hizmetleri sunar:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>OCEAN Kişilik Testi:</strong> Bilimsel kişilik analizi</li>
                  <li><strong>AI Sohbet:</strong> Yapay zeka destekli kariyer danışmanlığı</li>
                  <li><strong>Kariyer Yol Haritası:</strong> Kişiselleştirilmiş kariyer planı</li>
                  <li><strong>Eğitim Kaynakları:</strong> Önerilen kurslar ve materyaller</li>
                  <li><strong>Topluluk Forumu:</strong> Kullanıcı etkileşimi ve deneyim paylaşımı</li>
                  <li><strong>Proje Dayanışması:</strong> Ekip kurma ve iş ilanı sistemi</li>
                </ul>
              </div>
            </section>

            {/* Sorumluluk Sınırları */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Sorumluluk Sınırları</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Platform kullanımından doğabilecek durumlar için sorumluluk sınırlarımız:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Test sonuçlarının doğruluğu için maksimum çaba gösteririz, ancak %100 garanti veremeyiz</li>
                  <li>Kariyer kararlarınız için sadece rehberlik sağlarız, nihai karar sizindir</li>
                  <li>Üçüncü taraf platformlardaki içeriklerden sorumlu değiliz</li>
                  <li>Teknik aksaklıklar durumunda hizmet kesintisi yaşanabilir</li>
                  <li>Kullanıcılar arası etkileşimlerden doğan sorunlardan sorumlu değiliz</li>
                </ul>
              </div>
            </section>

            {/* Fikri Mülkiyet */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Fikri Mülkiyet</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Platformumuzdaki fikri mülkiyet hakları:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Platform tasarımı ve kodları Nebula Nexus'a aittir</li>
                  <li>Kullanıcılar kendi içeriklerinin telif hakkına sahiptir</li>
                  <li>Platform içeriğini ticari amaçla kullanmak yasaktır</li>
                  <li>AI sohbet geçmişleri platform geliştirme için kullanılabilir</li>
                  <li>Test sonuçları anonim olarak araştırma amaçlı kullanılabilir</li>
                </ul>
              </div>
            </section>

            {/* Hesap Yönetimi */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Users className="w-6 h-6 text-indigo-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Hesap Yönetimi</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Hesabınızla ilgili kurallar:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hesap bilgilerinizi güvenli tutmak sizin sorumluluğunuzdadır</li>
                  <li>Şüpheli aktivite durumunda hesabınız askıya alınabilir</li>
                  <li>Uzun süre kullanılmayan hesaplar silinebilir</li>
                  <li>Hesap silme talepleriniz 30 gün içinde işleme alınır</li>
                  <li>Veri yedekleme hizmeti sunmuyoruz</li>
                </ul>
              </div>
            </section>

            {/* Değişiklikler */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Şartlarda Değişiklik</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Bu kullanım şartlarını önceden haber vermeksizin değiştirme hakkını saklı tutarız. 
                  Değişiklikler platform üzerinden duyurulacak ve yayınlandığı tarihten itibaren geçerli olacaktır.
                </p>
                <p>
                  Değişikliklerden haberdar olmak için platformu düzenli olarak kontrol etmenizi öneririz.
                </p>
              </div>
            </section>

            {/* İletişim */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">İletişim</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Kullanım şartlarıyla ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-6">
                  <p><strong>E-posta:</strong> terms@nebula-nexus.com</p>
                  <p><strong>Adres:</strong> Türkiye</p>
                  <p><strong>Konu:</strong> Kullanım Şartları</p>
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