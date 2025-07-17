# 🎓 Media Pembelajaran dengan AI

Aplikasi pembelajaran interaktif yang menggunakan AI untuk generate course, quiz, dan fitur pembelajaran lainnya.

## 🚀 Fitur Utama

- ✅ **Sistem Autentikasi** - Login/Register dengan verifikasi email
- ✅ **Generate Course dengan AI** - Membuat materi pembelajaran otomatis
- ✅ **Quiz System** - Quiz interaktif dengan scoring
- ✅ **Jurnal Refleksi** - Fitur menulis jurnal pembelajaran
- ✅ **Ask Question** - Tanya jawab dengan AI
- ✅ **Challenge Thinking** - Latihan berpikir kritis
- ✅ **Admin Dashboard** - Panel admin untuk monitoring
- ✅ **Responsive Design** - Bekerja di desktop dan mobile

## 📋 Requirements

### Software yang Diperlukan:
- **Node.js** (versi 18 atau lebih baru)
- **npm** atau **yarn**
- **PostgreSQL** database
- **Git**

### API Keys yang Diperlukan:
- **OpenAI API Key** - Untuk fitur AI
- **Email Service** - Gmail atau service email lainnya

## 🛠️ Cara Setup Lokal

### 1. Clone Repository
```bash
git clone https://github.com/GlennAyden/mediaPembelajaran.git
cd mediaPembelajaran/principle-learn
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database PostgreSQL

#### Opsi A: Database Lokal
1. Install PostgreSQL di komputer Anda
2. Buat database baru: `principle_learn`
3. Catat username, password, dan port (biasanya 5432)

#### Opsi B: Database Cloud (Rekomendasi)
1. **Supabase** (Gratis): https://supabase.com
   - Sign up dan buat project baru
   - Copy connection string dari Settings > Database
2. **Neon** (Gratis): https://neon.tech
   - Sign up dan buat database
   - Copy connection string

### 4. Setup Environment Variables

Buat file `.env.local` di folder `principle-learn`:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/principle_learn"
# Atau untuk Supabase/Neon:
# DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"

# JWT Secret (bisa pakai string acak)
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI API Key
OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"

# Email Configuration (Gmail)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

#### Cara Dapatkan API Keys:

**OpenAI API Key:**
1. Buka https://platform.openai.com/
2. Sign up/Login
3. Buka menu "API Keys"
4. Create new secret key
5. Copy dan paste ke `OPENAI_API_KEY`

**Gmail App Password:**
1. Buka https://myaccount.google.com/security
2. Aktifkan "2-Step Verification"
3. Buka "App passwords"
4. Generate password untuk "Mail"
5. Copy dan paste ke `EMAIL_PASS`

### 5. Setup Database Schema
```bash
npx prisma generate
npx prisma db push
```

### 6. Jalankan Aplikasi
```bash
npm run dev
```

Buka browser dan akses: **http://localhost:3000**

## 👥 Cara Penggunaan

### Untuk User Baru:
1. **Register** - Buat akun baru
2. **Request Course** - Pilih topik yang ingin dipelajari
3. **Belajar** - Ikuti materi yang di-generate AI
4. **Quiz** - Test pemahaman dengan quiz
5. **Jurnal** - Tulis refleksi pembelajaran

### Untuk Admin:
1. Login dengan akun admin
2. Akses dashboard admin di `/admin`
3. Monitor aktivitas user
4. Kelola konten dan sistem

## 🔧 Troubleshooting

### Error "Database connection failed"
- Pastikan PostgreSQL berjalan
- Cek `DATABASE_URL` sudah benar
- Pastikan database `principle_learn` sudah dibuat

### Error "OpenAI API key invalid"
- Cek `OPENAI_API_KEY` sudah benar
- Pastikan ada credit di akun OpenAI
- Cek internet connection

### Error "Email not sent"
- Pastikan `EMAIL_USER` dan `EMAIL_PASS` benar
- Untuk Gmail, pastikan sudah setup App Password
- Cek firewall tidak memblokir port 587/465

### Error "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📁 Struktur Project

```
principle-learn/
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React Components
│   ├── lib/          # Utilities & Config
│   └── hooks/        # Custom Hooks
├── prisma/           # Database Schema
├── public/           # Static Files
└── package.json
```

## 🚀 Deploy ke Production

### Vercel (Rekomendasi)
1. Push ke GitHub
2. Import di Vercel
3. Set Root Directory: `principle-learn`
4. Tambahkan Environment Variables
5. Deploy!

### Railway/Render
1. Connect repository
2. Setup PostgreSQL addon
3. Configure environment variables
4. Deploy

## 📞 Support

Jika ada masalah atau pertanyaan:
- Buat issue di GitHub: https://github.com/GlennAyden/mediaPembelajaran
- Atau hubungi developer langsung

---

**Happy Learning! 🎉**