import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Shield, User, Database, Lock, Eye, FileText, AlertTriangle, CheckCircle } from 'lucide-react';

export default function KVKK() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      <main className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-pink-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              KVKK Aydınlatma Metni
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında veri işleme faaliyetlerimiz hakkında detaylı bilgi.
            </p>
            <div className="mt-6 text-sm text-gray-500">
              Son güncelleme: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-12">
            {/* Veri Sorumlusu */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <User className="w-6 h-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Sorumlusu</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong>Veri Sorumlusu:</strong> Nebula Nexus<br />
                  <strong>Adres:</strong> Türkiye<br />
                  <strong>E-posta:</strong> kvkk@nebula-nexus.com<br />
                  <strong>Telefon:</strong> +90 xxx xxx xx xx
                </p>
                <p>
                  Kişisel verilerinizin işlenmesi konusunda yukarıda belirtilen veri sorumlusu ile iletişime geçebilirsiniz.
                </p>
              </div>
            </section>

            {/* İşlenen Veri Kategorileri */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Database className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">İşlenen Veri Kategorileri</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Platformumuzda aşağıdaki kişisel veri kategorileri işlenmektedir:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Kimlik Bilgileri:</strong> Ad, soyad, e-posta adresi</li>
                  <li><strong>İletişim Bilgileri:</strong> Telefon numarası, adres</li>
                  <li><strong>Eğitim Bilgileri:</strong> Eğitim geçmişi, sertifikalar</li>
                  <li><strong>İş Deneyimi:</strong> Çalışma geçmişi, beceriler</li>
                  <li><strong>Kişilik Analizi:</strong> OCEAN test sonuçları</li>
                  <li><strong>Kullanım Verileri:</strong> Platform aktiviteleri, sohbet geçmişi</li>
                  <li><strong>Teknik Veriler:</strong> IP adresi, tarayıcı bilgileri</li>
                </ul>
              </div>
            </section>

            {/* Veri İşleme Amaçları */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Eye className="w-6 h-6 text-purple-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri İşleme Amaçları</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Hesap oluşturma ve yönetimi</li>
                  <li>OCEAN kişilik testi uygulaması</li>
                  <li>Kişiselleştirilmiş kariyer önerileri</li>
                  <li>AI sohbet özelliği</li>
                  <li>Platform güvenliği ve performansı</li>
                  <li>Yasal yükümlülüklerin yerine getirilmesi</li>
                  <li>Hizmet kalitesinin artırılması</li>
                  <li>İletişim ve destek hizmetleri</li>
                </ul>
              </div>
            </section>

            {/* Hukuki Sebepler */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <FileText className="w-6 h-6 text-yellow-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Hukuki Sebepler</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Kişisel verileriniz aşağıdaki hukuki sebeplere dayanarak işlenmektedir:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Açık Rıza:</strong> KVKK'nın 5/1-a maddesi kapsamında</li>
                  <li><strong>Sözleşmenin Kurulması:</strong> KVKK'nın 5/1-ç maddesi kapsamında</li>
                  <li><strong>Yasal Yükümlülük:</strong> KVKK'nın 5/1-e maddesi kapsamında</li>
                  <li><strong>Meşru Menfaat:</strong> KVKK'nın 5/1-f maddesi kapsamında</li>
                </ul>
              </div>
            </section>

            {/* Veri Aktarımı */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <Lock className="w-6 h-6 text-red-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Aktarımı</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Kişisel verileriniz aşağıdaki durumlarda aktarılabilir:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Hizmet Sağlayıcılar:</strong> Platform işletimi için gerekli olan</li>
                  <li><strong>Yasal Zorunluluk:</strong> Yasal düzenlemeler gereği</li>
                  <li><strong>Açık Rıza:</strong> Açık rızanız olduğunda</li>
                  <li><strong>Güvenlik:</strong> Platform güvenliği için gerekli olduğunda</li>
                </ul>
                <div className="bg-gray-800/50 rounded-lg p-6 mt-4">
                  <h4 className="text-white font-semibold mb-3">Aktarılan Üçüncü Taraflar:</h4>
                  <ul className="space-y-2 text-sm">
                    <li>Google Gemini (AI sohbet özelliği için)</li>
                    <li>Veritabanı hizmet sağlayıcıları</li>
                    <li>E-posta hizmet sağlayıcıları</li>
                    <li>Analitik hizmet sağlayıcıları</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Veri Saklama Süreleri */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <AlertTriangle className="w-6 h-6 text-orange-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">Veri Saklama Süreleri</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>Kişisel verileriniz aşağıdaki süreler boyunca saklanmaktadır:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Hesap Bilgileri:</strong> Hesap silinene kadar</li>
                  <li><strong>OCEAN Test Sonuçları:</strong> 5 yıl</li>
                  <li><strong>Sohbet Geçmişi:</strong> 2 yıl</li>
                  <li><strong>Aktivite Logları:</strong> 3 yıl</li>
                  <li><strong>Teknik Veriler:</strong> 1 yıl</li>
                  <li><strong>Yasal Belgeler:</strong> Yasal süreler boyunca</li>
                </ul>
                <p className="mt-4">
                  <strong>Not:</strong> Bu süreler sonunda verileriniz güvenli bir şekilde silinir veya anonim hale getirilir.
                </p>
              </div>
            </section>

            {/* KVKK Hakları */}
            <section className="ai-card">
              <div className="flex items-center mb-6">
                <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                <h2 className="text-2xl font-semibold text-white">KVKK Kapsamındaki Haklarınız</h2>
              </div>
              <div className="space-y-4 text-gray-300">
                <p>KVKK'nın 11. maddesi kapsamında aşağıdaki haklara sahipsiniz:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong>Bilgi Alma Hakkı:</strong> Verilerinizin işlenip işlenmediğini öğrenme</li>
                  <li><strong>Erişim Hakkı:</strong> Kişisel verilerinize erişim</li>
                  <li><strong>Düzeltme Hakkı:</strong> Yanlış veya eksik verilerin düzeltilmesini isteme</li>
                  <li><strong>Silme Hakkı:</strong> Kişisel verilerinizin silinmesini isteme</li>
                  <li><strong>İşlemeyi Sınırlama Hakkı:</strong> Veri işlemeyi sınırlama</li>
                  <li><strong>Veri Taşınabilirliği:</strong> Verilerinizin başka bir sisteme aktarılması</li>
                  <li><strong>İtiraz Hakkı:</strong> Veri işlemeye itiraz etme</li>
                  <li><strong>Zarar Tazmini:</strong> Zarar görmeniz durumunda tazminat isteme</li>
                </ul>
              </div>
            </section>

            {/* Hak Kullanımı */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Haklarınızı Nasıl Kullanabilirsiniz?</h2>
              <div className="space-y-4 text-gray-300">
                <p>KVKK haklarınızı kullanmak için:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>E-posta ile talebinizi gönderebilirsiniz</li>
                  <li>Posta ile yazılı başvuru yapabilirsiniz</li>
                  <li>Noter aracılığıyla başvuru yapabilirsiniz</li>
                  <li>Platform üzerinden destek talebi oluşturabilirsiniz</li>
                </ul>
                <div className="bg-gray-800/50 rounded-lg p-6 mt-4">
                  <h4 className="text-white font-semibold mb-3">Başvuru Bilgileri:</h4>
                  <p><strong>E-posta:</strong> kvkk@nebula-nexus.com</p>
                  <p><strong>Adres:</strong> Türkiye</p>
                  <p><strong>Konu:</strong> KVKK Başvurusu</p>
                  <p className="mt-2 text-sm">
                    Başvurunuzda kimlik bilgilerinizi ve hangi hakkınızı kullanmak istediğinizi belirtmeniz gerekmektedir.
                  </p>
                </div>
              </div>
            </section>

            {/* Şikayet Hakkı */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Şikayet Hakkı</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Kişisel Verilerin Korunması Kurumu'na şikayet başvurusu yapma hakkına sahipsiniz. 
                  Şikayet başvurusu için:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Kurumun web sitesini ziyaret edebilirsiniz</li>
                  <li>E-posta ile başvuru yapabilirsiniz</li>
                  <li>Posta ile yazılı başvuru yapabilirsiniz</li>
                </ul>
                <div className="bg-gray-800/50 rounded-lg p-6 mt-4">
                  <h4 className="text-white font-semibold mb-3">Kişisel Verilerin Korunması Kurumu:</h4>
                  <p><strong>Web Sitesi:</strong> www.kvkk.gov.tr</p>
                  <p><strong>E-posta:</strong> kvkk@kvkk.gov.tr</p>
                  <p><strong>Adres:</strong> Kızılay Mah. Atatürk Bulvarı No: 407, 06420 Çankaya/Ankara</p>
                </div>
              </div>
            </section>

            {/* Güncellemeler */}
            <section className="ai-card">
              <h2 className="text-2xl font-semibold text-white mb-6">Aydınlatma Metni Güncellemeleri</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Bu aydınlatma metnini zaman zaman güncelleyebiliriz. Değişiklikler bu sayfada yayınlanacak 
                  ve yayınlandığı tarihten itibaren geçerli olacaktır.
                </p>
                <p>
                  Önemli değişiklikler durumunda kullanıcılarımızı e-posta ile bilgilendireceğiz.
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 