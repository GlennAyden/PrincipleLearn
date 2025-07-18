# Principle Learn - Media Pembelajaran dengan AI

Aplikasi web untuk pembelajaran interaktif yang menggunakan AI untuk menghasilkan konten pembelajaran, quiz, dan fitur-fitur edukasi lainnya.

## 🚀 Fitur Utama

- **Generasi Kursus Otomatis** - AI menghasilkan konten pembelajaran berdasarkan parameter
- **Sistem Quiz Interaktif** - Quiz otomatis dengan feedback
- **Jurnal Refleksi** - Sistem pencatatan pembelajaran
- **Sistem Autentikasi** - Login, register, dan manajemen user
- **Dashboard Admin** - Panel admin untuk mengelola konten dan user
- **Fitur AI** - Tanya jawab dengan AI, feedback otomatis

## 📋 Prasyarat

- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **PostgreSQL** database (lokal atau cloud)
- **OpenAI API Key**

## 🛠️ Instalasi

### 1. Clone Repository
```bash
git clone <URL_REPOSITORY>
cd principle-learn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database

#### Opsi A: Database Lokal
```bash
# Buat database PostgreSQL
psql -U postgres
CREATE DATABASE principle_learn;
\q

# Jalankan migrations (UNTUK DATABASE LOKAL)
npx prisma migrate dev
```

#### Opsi B: Supabase (Rekomendasi)
1. Buat akun di [Supabase](https://supabase.com)
2. Buat project baru
3. Dapatkan connection string dari Settings > Database
4. Update `DATABASE_URL` di `.env.local`
5. Jalankan: `npx prisma db push` (UNTUK SUPABASE)

Lihat [SUPABASE_SETUP.md](SUPABASE_SETUP.md) untuk panduan lengkap.

### 4. Environment Variables
Buat file `.env.local`:
```env
# Database URL (lokal atau Supabase)
DATABASE_URL="postgresql://postgres:password@localhost:5432/principle_learn"
# Atau untuk Supabase:
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

JWT_SECRET="your-secret-key"
OPENAI_API_KEY="your-openai-api-key"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

Buka: http://localhost:3000

## ⚠️ PENTING: Perbedaan Command Database

### Untuk Database Lokal:
```bash
npx prisma migrate dev    # Buat dan jalankan migration
```

### Untuk Supabase:
```bash
npx prisma db push        # Push schema langsung ke database
```

**JANGAN gunakan `npx migrate` - command ini salah!**

## 🔑 API Keys

### OpenAI API Key
1. Buka https://platform.openai.com/api-keys
2. Create new secret key
3. Copy ke `OPENAI_API_KEY`

### Email Configuration
1. Aktifkan 2-Step Verification di Google Account
2. Generate App Password untuk "Mail"
3. Copy ke `EMAIL_USER` dan `EMAIL_PASS`

## 🔑 Supabase Auth (Baru)

Aplikasi ini sekarang menggunakan Supabase Auth untuk login dan signup. Semua user baru dan lama harus login menggunakan email & password yang terdaftar di Supabase Auth.

### Setup Supabase Auth
1. Buka dashboard Supabase project Anda
2. Masuk ke menu Authentication > Users
3. Tambahkan user secara manual (atau user bisa signup sendiri via aplikasi)
4. Pastikan email dan password benar

### Environment Variable
Tambahkan ke `.env.local`:
```
SUPABASE_URL="https://db.obwmrdrhctzbezrdmoil.supabase.co"
SUPABASE_ANON_KEY="<your-anon-key>"
```

### Login/Signup
- Login dan signup hanya via Supabase Auth (bukan lagi via API custom/Prisma)
- Jika lupa password, gunakan fitur reset password Supabase Auth

## 📁 Struktur Project

```
principle-learn/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API endpoints
│   │   ├── admin/          # Admin dashboard
│   │   ├── course/         # Course pages
│   │   └── ...
│   ├── components/         # React components
│   ├── lib/               # Utilities & configurations
│   └── hooks/             # Custom React hooks
├── prisma/                # Database schema & migrations
├── public/                # Static assets
└── ...
```

## 🎯 Cara Penggunaan

### User Features
- Register/Login
- Request course dengan AI
- Kerjakan quiz
- Tulis jurnal refleksi
- Tanya jawab dengan AI

### Admin Features
- Login sebagai admin
- Kelola user dan konten
- Monitor aktivitas
- View analytics

## 📝 Scripts

```bash
npm run dev          # Development server
npm run dev:no-lint  # Development server tanpa linting (untuk mengatasi ESLint errors)
npm run build        # Build untuk production
npm run start        # Start production server
npm run lint         # Linting
```

## 🔧 Development

### Database Commands
```bash
# Generate Prisma client
npx prisma generate

# Database lokal
npx prisma migrate dev --name migration_name

# Supabase
npx prisma db push

# View database
npx prisma studio
```

### Environment Variables
- `.env.local` - Environment variables lokal
- `.env.example` - Template environment variables

## 🗄️ Database Options

### 1. Supabase (Rekomendasi)
- ✅ Gratis tier (500MB database)
- ✅ PostgreSQL dengan dashboard
- ✅ Real-time subscriptions
- ✅ Built-in authentication
- ✅ Auto-generated API

### 2. Database Lokal
- ✅ Full control
- ✅ Offline development
- ✅ Custom configuration

### 3. Database Cloud Lainnya
- **Neon** - PostgreSQL serverless
- **Railway** - PostgreSQL hosting
- **PlanetScale** - MySQL serverless

## 🚀 Deployment

Deploy ke platform pilihan:
- **Vercel** - Auto-deploy dari GitHub
- **Railway** - PostgreSQL included
- **Render** - Easy setup
- **Netlify** - Static hosting

## 🐛 Troubleshooting

### Error ESLint
Jika ada error ESLint saat development:
```bash
# Jalankan tanpa linting
npm run dev:no-lint
```
Lihat [ESLINT_FIX.md](ESLINT_FIX.md) untuk panduan lengkap.

### Error: "ENOENT: no such file or directory, scandir 'migrations'"
- **JANGAN gunakan `npx migrate`**
- Gunakan `npx prisma db push` untuk Supabase
- Gunakan `npx prisma migrate dev` untuk database lokal

### Error: "Database connection failed"
- Cek DATABASE_URL format
- Pastikan database running
- Verify credentials

### Error: "OpenAI API key not found"
- Pastikan `OPENAI_API_KEY` sudah diisi
- Cek apakah API key valid

## 📞 Support

Jika ada masalah:
1. Cek console browser dan terminal
2. Pastikan semua prasyarat terpenuhi
3. Verify environment variables
4. Cek database connection
5. Lihat [SUPABASE_SETUP.md](SUPABASE_SETUP.md) untuk setup database
6. Lihat dokumentasi untuk troubleshooting migration

---

**Happy Learning! 🎓**