# 🚀 Nebula Nexus - Hızlı Başlangıç Kılavuzu

## ⚡ 5 Dakikada Kurulum

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
DATABASE_URL="postgresql://username:password@localhost:5432/nebula_nexus"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
GEMINI_API_KEY="your-gemini-api-key"
```

### 4. Veritabanını Hazırlayın
```bash
npx prisma generate
npx prisma db push
```

### 5. Uygulamayı Başlatın
```bash
npm run dev
```

🎉 **Tebrikler!** Uygulama `http://localhost:3000` adresinde çalışıyor.

## 🎯 Hızlı Test

### 1. Kayıt Olun
- `http://localhost:3000` adresine gidin
- "Kayıt Ol" butonuna tıklayın
- Email ve şifre girin

### 2. Testi Başlatın
- Dashboard'da "Testi Başlat" butonuna tıklayın
- OCEAN kişilik testini çözün
- O*NET ilgi testini tamamlayın

### 3. AI Önerilerini Alın
- Test sonuçlarınızı görüntüleyin
- Kariyer önerilerinizi inceleyin
- AI chat ile sohbet edin

## 🔧 Temel Komutlar

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

## 📁 Önemli Dosyalar

- `app/page.tsx` - Ana sayfa
- `app/dashboard/page.tsx` - Dashboard
- `app/test/page.tsx` - Test sayfası
- `app/chat/page.tsx` - AI chat
- `prisma/schema.prisma` - Veritabanı şeması
- `lib/gemini.ts` - AI entegrasyonu

## 🆘 Hızlı Sorun Giderme

### Veritabanı Hatası
```bash
npx prisma generate
npx prisma db push
```

### AI API Hatası
- Gemini API key'inizi kontrol edin
- `.env.local` dosyasını güncelleyin

### Build Hatası
```bash
rm -rf node_modules
npm install
npm run build
```

## 📞 Destek

- **Email**: nebulanexus@gmail.com
- **GitHub**: https://github.com/emirhandai/nebula-nexus


---

**Nebula Nexus** - AI Destekli Kariyer Rehberliği Platformu
*Hızlı Başlangıç Kılavuzu v1.0* 