# Nebula Nexus - Kullanım Kılavuzu

## 📋 İçindekiler
1. [Proje Hakkında](#proje-hakkında)
2. [Sistem Gereksinimleri](#sistem-gereksinimleri)
3. [Kurulum](#kurulum)
4. [Kullanım](#kullanım)
5. [Özellikler](#özellikler)
6. [API Dokümantasyonu](#api-dokümantasyonu)
7. [Sorun Giderme](#sorun-giderme)
8. [Geliştirici Notları](#geliştirici-notları)

## 🚀 Proje Hakkında

**Nebula Nexus**, kişilik testleri ve yapay zeka teknolojisi kullanarak yazılım geliştiricilere kariyer rehberliği sunan modern bir web uygulamasıdır.

### 🎯 Ana Özellikler
- **OCEAN Kişilik Testi**: Bilimsel olarak kanıtlanmış kişilik analizi
- **O*NET İlgi Testi**: Mesleki ilgi alanları değerlendirmesi
- **AI Destekli Kariyer Önerileri**: Google Gemini AI ile kişiselleştirilmiş öneriler
- **Gelişmiş AI Sohbet**: Kişilik adaptasyonu ve zaman bazlı context
- **Güvenlik Odaklı**: End-to-end şifreleme ve güvenlik önlemleri
- **Responsive Tasarım**: Tüm cihazlarda mükemmel deneyim

### 🏗️ Teknoloji Stack'i
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Prisma ORM
- **Veritabanı**: PostgreSQL
- **AI**: Google Gemini AI
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (önerilen)

## 💻 Sistem Gereksinimleri

### Minimum Gereksinimler
- Node.js 18.0 veya üzeri
- npm 9.0 veya üzeri
- PostgreSQL 12.0 veya üzeri
- Git

### Önerilen Gereksinimler
- Node.js 20.0 LTS
- npm 10.0
- PostgreSQL 15.0
- 8GB RAM
- SSD Depolama

## 🔧 Kurulum

### 1. Projeyi İndirin
```bash
git clone https://github.com/emirhandai/nebula-nexus.git
cd nebula-nexus
```

### 2. Bağımlılıkları Yükleyin
```bash
npm install
```

### 3. Ortam Değişkenlerini Ayarlayın
`.env.local` dosyası oluşturun:
```env
# Veritabanı
DATABASE_URL="postgresql://username:password@localhost:5432/nebula_nexus"

# NextAuth.js
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Güvenlik
JWT_SECRET="your-jwt-secret"
```

### 4. Veritabanını Hazırlayın
```bash
# Prisma client'ı oluşturun
npx prisma generate

# Veritabanı şemasını uygulayın
npx prisma db push

# (Opsiyonel) Seed verilerini yükleyin
npx prisma db seed
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## 📖 Kullanım

### 🎯 İlk Kullanım

#### 1. Kayıt Olma
- Ana sayfada "Kayıt Ol" butonuna tıklayın
- Email, şifre ve isim bilgilerinizi girin
- Email doğrulaması yapın (gerekirse)

#### 2. Giriş Yapma
- "Giriş Yap" butonuna tıklayın
- Email ve şifrenizi girin
- Dashboard'a yönlendirileceksiniz

### 🧠 Test Süreci

#### OCEAN Kişilik Testi
1. **Test Başlatma**
   - Dashboard'da "Testi Başlat" butonuna tıklayın
   - OCEAN testi otomatik olarak başlayacak

2. **Soruları Cevaplama**
   - Her soru için 1-5 arası puan verin
   - "Geri" butonu ile önceki sorulara dönebilirsiniz
   - Tüm soruları cevaplamadan testi bitiremezsiniz

3. **Test Sonuçları**
   - Test tamamlandığında sonuçlarınız görüntülenir
   - OCEAN skorlarınız (Açıklık, Sorumluluk, Dışadönüklük, Uyumluluk, Nörotizm)
   - Kişilik tipiniz belirlenir

#### O*NET İlgi Testi
1. **Test Geçişi**
   - OCEAN testinden sonra otomatik olarak başlar
   - Mesleki ilgi alanlarınızı değerlendirir

2. **Sonuç Analizi**
   - Teknik, analitik, yaratıcı, sosyal beceriler
   - Çalışma tarzı ve liderlik puanları

### 🤖 AI Kariyer Önerileri

#### Öneri Sistemi
- Test sonuçlarınıza göre otomatik öneriler
- Kişilik ve ilgi alanlarınıza uygun yazılım alanları
- Her öneri için güven skoru ve detaylı açıklama

#### Önerilen Alanlar
1. **Frontend Geliştirici** (React, Vue, Angular)
2. **Backend Geliştirici** (Node.js, Python, Java)
3. **Full Stack Geliştirici** (MERN, MEAN stack)
4. **Mobil Geliştirici** (React Native, Flutter)
5. **DevOps Mühendisi** (Docker, Kubernetes)
6. **Veri Mühendisi** (ETL, Big Data)
7. **AI/ML Mühendisi** (TensorFlow, PyTorch)
8. **Siber Güvenlik** (Network Security, Penetration Testing)
9. **UI/UX Geliştirici** (Figma, Adobe XD)
10. **Sistem Yöneticisi** (Linux, Windows Server)

### 💬 AI Sohbet Özelliği

#### Sohbet Başlatma
1. **Chat Sayfasına Gitme**
   - Sol menüden "AI Chat" seçeneğine tıklayın
   - Yeni sohbet başlatın veya mevcut sohbeti devam ettirin

2. **Sohbet Kategorileri**
   - **Casual**: Genel sohbet
   - **Career**: Kariyer tavsiyeleri
   - **Education**: Eğitim önerileri
   - **Technical**: Teknik sorular

#### Gelişmiş Özellikler
- **Kişilik Adaptasyonu**: OCEAN skorlarınıza göre yanıt tonu
- **Zaman Bazlı Context**: Günün saati ve haftanın gününe göre öneriler
- **Kullanıcı Tercihleri**: Öğrenme ve tercih analizi

#### Özel Komutlar
```
/help - Yardım menüsü
/analyze - Mevcut durum analizi
/suggest - Akıllı öneriler
/mood - Ruh hali analizi
/clear - Sohbeti temizle
/export - Sohbeti dışa aktır
```

### 📊 Dashboard

#### Ana Metrikler
- **Test Tamamlama Durumu**: OCEAN ve O*NET testleri
- **Kariyer Eşleşme Yüzdesi**: Seçilen alanla uyumluluk
- **Aktivite Geçmişi**: Son aktiviteleriniz
- **Başarı Puanları**: Seviye ve puanlarınız

#### Özelleştirme
- **Profil Ayarları**: Kişisel bilgiler, gizlilik
- **Bildirim Ayarları**: Email, push, SMS
- **Tema Seçenekleri**: Açık/koyu tema

## 🔌 API Dokümantasyonu

### Kimlik Doğrulama
```bash
# Login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

# Register
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}
```

### Test Sonuçları
```bash
# Test sonuçlarını kaydet
POST /api/ocean/save-result
{
  "userId": "user-id",
  "scores": {
    "openness": 75,
    "conscientiousness": 80,
    "extraversion": 65,
    "agreeableness": 70,
    "neuroticism": 30
  },
  "answers": [4, 3, 5, 2, 4, ...],
  "testDuration": 1200,
  "questionsAnswered": 50
}
```

### AI Chat
```bash
# Mesaj gönder
POST /api/chat/enhanced
{
  "message": "Merhaba, kariyer tavsiyesi alabilir miyim?",
  "userId": "user-id",
  "sessionId": "session-id",
  "selectedField": "Frontend Developer",
  "category": "career"
}
```

### Kullanıcı Profili
```bash
# Profil bilgilerini getir
GET /api/user/profile?email=user@example.com

# Profil güncelle
PUT /api/user/profile
{
  "userId": "user-id",
  "name": "New Name",
  "selectedField": "Backend Developer"
}
```

## 🛠️ Sorun Giderme

### Yaygın Sorunlar

#### 1. Veritabanı Bağlantı Hatası
```bash
# Prisma client'ı yeniden oluşturun
npx prisma generate

# Veritabanı bağlantısını test edin
npx prisma db push
```

#### 2. AI API Hatası
- Gemini API key'inizin doğru olduğundan emin olun
- API limitlerini kontrol edin
- Network bağlantınızı kontrol edin

#### 3. Authentication Hatası
```bash
# Session'ları temizleyin
npm run dev -- --clear

# .env dosyasını kontrol edin
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"
```

#### 4. Build Hatası
```bash
# Node modules'ı temizleyin
rm -rf node_modules
npm install

# Cache'i temizleyin
npm run build -- --clear
```

### Log Dosyaları
- **Development**: Console'da görünür
- **Production**: Vercel logs veya hosting provider logs

## 👨‍💻 Geliştirici Notları

### Proje Yapısı
```
nebula-nexus/
├── app/                    # Next.js 14 app router
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── chat/              # AI chat feature
│   ├── dashboard/         # User dashboard
│   ├── test/              # Test pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
├── lib/                   # Utility functions
├── prisma/                # Database schema
├── public/                # Static assets
└── types/                 # TypeScript types
```

### Önemli Dosyalar
- `prisma/schema.prisma`: Veritabanı şeması
- `lib/gemini.ts`: AI entegrasyonu
- `lib/validation.ts`: Input validation
- `middleware.ts`: Global middleware
- `next.config.js`: Next.js konfigürasyonu

### Geliştirme İpuçları
1. **TypeScript**: Tüm yeni kodlar TypeScript ile yazılmalı
2. **Validation**: Tüm input'lar Zod ile validate edilmeli
3. **Security**: Güvenlik önlemleri her zaman uygulanmalı
4. **Testing**: Yeni özellikler test edilmeli
5. **Documentation**: Kod dokümantasyonu güncel tutulmalı

### Deployment
```bash
# Production build
npm run build

# Vercel deployment
vercel --prod

# Environment variables
vercel env add DATABASE_URL
vercel env add GEMINI_API_KEY
vercel env add NEXTAUTH_SECRET
```

## 📞 Destek

### İletişim
- **Email**: nebulanexus@gmail.com
- **GitHub**: https://github.com/emirhandai/nebula-nexus
- **Documentation**: https://docs.nebulanexus.com

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun
3. Değişikliklerinizi commit edin
4. Pull request gönderin

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

---

**Nebula Nexus** - AI Destekli Kariyer Rehberliği Platformu
*Versiyon 1.0.0 - 2025* 