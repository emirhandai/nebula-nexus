# 🌌 Nebula Nexus

**AI Destekli Kariyer Rehberliği Platformu**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

## 🎯 Proje Hakkında

Nebula Nexus, kişilik testleri ve yapay zeka teknolojisi kullanarak yazılım geliştiricilere kariyer rehberliği sunan modern bir web uygulamasıdır. OCEAN kişilik testi ve O*NET ilgi testi ile kişilik profilinizi analiz eder, Google Gemini AI teknolojisi kullanarak size en uygun yazılım alanlarını önerir.

## ✨ Özellikler

### 🧠 Kişilik Analizi
- **OCEAN Kişilik Testi**: Bilimsel olarak kanıtlanmış kişilik analizi
- **O*NET İlgi Testi**: Mesleki ilgi alanları değerlendirmesi
- **Detaylı Raporlar**: Kişilik tipi ve güçlü yanlar analizi

### 🤖 AI Destekli Öneriler
- **Kariyer Önerileri**: Kişiliğe uygun yazılım alanları
- **Gelişmiş AI Sohbet**: Kişilik adaptasyonu ve zaman bazlı context
- **Öğrenme Yolları**: Adım adım kariyer gelişim planları

### 🔒 Güvenlik
- **End-to-End Şifreleme**: Tüm veriler şifrelenir
- **GDPR Uyumlu**: Veri koruma standartları
- **Güvenlik Logları**: Şüpheli aktiviteler izlenir

### 📱 Modern Tasarım
- **Responsive Design**: Tüm cihazlarda mükemmel deneyim
- **Dark Mode**: Göz dostu arayüz
- **Animasyonlar**: Smooth kullanıcı deneyimi

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18.0+
- npm 9.0+
- PostgreSQL 12.0+
- Git

### Kurulum

1. **Projeyi İndirin**
```bash
git clone https://github.com/emirhandai/nebula-nexus.git
cd nebula-nexus
```

2. **Bağımlılıkları Yükleyin**
```bash
npm install
```

3. **Ortam Değişkenlerini Ayarlayın**
```env
# .env.local
DATABASE_URL="postgresql://username:password@localhost:5432/nebula_nexus"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

4. **Veritabanını Hazırlayın**
```bash
npx prisma generate
npx prisma db push
```

5. **Uygulamayı Başlatın**
```bash
npm run dev
```

🎉 Uygulama `http://localhost:3000` adresinde çalışmaya başlayacaktır.

## 📖 Kullanım

### 1. Kayıt ve Giriş
- Ana sayfada kayıt olun veya giriş yapın
- Email doğrulaması yapın (gerekirse)

### 2. Test Süreci
- Dashboard'da "Testi Başlat" butonuna tıklayın
- OCEAN kişilik testini çözün (50 soru)
- O*NET ilgi testini tamamlayın (30 soru)

### 3. AI Önerileri
- Test sonuçlarınızı görüntüleyin
- Kariyer önerilerinizi inceleyin
- AI chat ile detaylı tavsiyeler alın

### 4. Gelişmiş Özellikler
- **Kişilik Adaptasyonu**: AI yanıtları kişiliğinize göre ayarlanır
- **Zaman Bazlı Context**: Günün saati ve haftanın gününe göre öneriler
- **Kullanıcı Tercihleri**: Öğrenme ve tercih analizi

## 🏗️ Teknoloji Stack'i

### Frontend
- **Next.js 14**: React framework
- **TypeScript**: Tip güvenliği
- **Tailwind CSS**: Utility-first CSS
- **Framer Motion**: Animasyonlar
- **Lucide React**: İkonlar

### Backend
- **Next.js API Routes**: Serverless API
- **Prisma ORM**: Veritabanı yönetimi
- **NextAuth.js**: Kimlik doğrulama
- **Zod**: Input validation

### AI & Veritabanı
- **Google Gemini AI**: Yapay zeka
- **PostgreSQL**: Ana veritabanı
- **Redis**: Cache (opsiyonel)

### Güvenlik
- **bcrypt**: Şifre hashleme
- **JWT**: Token tabanlı auth
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API rate limiting

## 📁 Proje Yapısı

```
nebula-nexus/
├── app/                    # Next.js 14 app router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication
│   │   ├── chat/          # AI chat
│   │   ├── ocean/         # Test results
│   │   └── user/          # User management
│   ├── auth/              # Auth pages
│   ├── chat/              # AI chat feature
│   ├── dashboard/         # User dashboard
│   ├── test/              # Test pages
│   └── globals.css        # Global styles
├── components/            # Reusable components
│   ├── layout/           # Layout components
│   ├── ui/               # UI components
│   └── forms/            # Form components
├── lib/                   # Utility functions
│   ├── gemini.ts         # AI integration
│   ├── validation.ts     # Input validation
│   ├── security.ts       # Security utilities
│   └── prisma.ts         # Database client
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema
├── public/                # Static assets
├── types/                 # TypeScript types
└── docs/                  # Documentation
```

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

## 🛠️ Geliştirme

### Komutlar
```bash
# Development
npm run dev          # Geliştirme sunucusu
npm run build        # Production build
npm run start        # Production sunucusu

# Database
npx prisma generate  # Prisma client oluştur
npx prisma db push   # Schema'yı uygula
npx prisma studio    # Database GUI

# Utilities
npm run lint         # ESLint kontrolü
npm run type-check   # TypeScript kontrolü
```

### Katkıda Bulunma
1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull request gönderin

## 🆘 Sorun Giderme

### Yaygın Sorunlar

#### Veritabanı Bağlantı Hatası
```bash
npx prisma generate
npx prisma db push
```

#### AI API Hatası
- Gemini API key'inizin doğru olduğundan emin olun
- API limitlerini kontrol edin

#### Build Hatası
```bash
rm -rf node_modules
npm install
npm run build
```

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına bakın.

## 📞 İletişim

- **Email**: nebulanexus@gmail.com
- **GitHub**: https://github.com/emirhandai/nebula-nexus


## 🙏 Teşekkürler

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://www.prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Google Gemini](https://ai.google.dev/) - AI platform
- [NextAuth.js](https://next-auth.js.org/) - Authentication

---

**Nebula Nexus** - AI Destekli Kariyer Rehberliği Platformu

*Yıldızlar kadar sınırsız kariyer fırsatları* ⭐ 