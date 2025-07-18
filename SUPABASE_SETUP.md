# Supabase Setup Guide

Panduan lengkap untuk menggunakan Supabase sebagai database untuk Principle Learn.

## 🚀 Keuntungan Supabase

- ✅ **Gratis** - 500MB database, 50MB file storage
- ✅ **PostgreSQL** - Database yang powerful dan reliable
- ✅ **Real-time** - Built-in real-time subscriptions
- ✅ **Auth** - Built-in authentication system
- ✅ **Dashboard** - Interface yang user-friendly
- ✅ **API** - Auto-generated REST API

## 📋 Setup Supabase

### 1. Buat Akun Supabase

1. Buka https://supabase.com
2. Klik "Start your project"
3. Sign up dengan GitHub atau email
4. Verifikasi email

### 2. Buat Project Baru

1. Klik "New Project"
2. Pilih organization
3. Isi informasi project:
   - **Name**: `principle-learn`
   - **Database Password**: Buat password yang kuat
   - **Region**: Pilih yang terdekat (Asia Southeast untuk Indonesia)
4. Klik "Create new project"

### 3. Tunggu Setup Selesai

- Setup database memakan waktu 1-2 menit
- Status akan berubah menjadi "Ready" ketika selesai

## 🔧 Konfigurasi Database

### 1. Dapatkan Connection String

1. Buka project Supabase
2. Klik menu **Settings** (gear icon) di sidebar
3. Pilih **Database**
4. Scroll ke bagian **Connection string**
5. Pilih **URI** format
6. Copy connection string

### 2. Update Environment Variables

Edit file `.env.local`:
```env
# Supabase Database URL
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your-super-secret-jwt-key-here"

# OpenAI API Key
OPENAI_API_KEY="sk-your-openai-api-key"

# Email Configuration (opsional)
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"
```

**Catatan**: Ganti `[YOUR-PASSWORD]` dengan password database yang Anda buat saat setup project.

### 3. Jalankan Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke Supabase (UNTUK SUPABASE)
npx prisma db push
```

## ⚠️ PENTING: Perbedaan Command

### Untuk Database Lokal:
```bash
npx prisma migrate dev    # Buat dan jalankan migration
```

### Untuk Supabase:
```bash
npx prisma db push        # Push schema langsung ke database
```

**JANGAN gunakan `npx migrate` - command ini salah!**

## 🔍 Verifikasi Setup

### 1. Cek Database Connection

```bash
# Test connection
npx prisma db pull

# View database di browser
npx prisma studio
```

### 2. Cek Tables

Buka Supabase Dashboard:
1. Klik **Table Editor** di sidebar
2. Pastikan semua tables terbuat:
   - `User`
   - `GenerateCourse`
   - `TranscriptQna`
   - `SoalOtomatis`
   - `JurnalRefleksi`
   - `QuizAttempt`
   - `QuizAnswer`

## 🛠️ Supabase Dashboard Features

### 1. Table Editor
- View dan edit data secara visual
- Filter dan sort data
- Export data ke CSV

### 2. SQL Editor
- Jalankan query SQL langsung
- View query history
- Save query favorites

### 3. API Documentation
- Auto-generated API docs
- Test API endpoints
- View request/response examples

### 4. Authentication
- Built-in auth system
- User management
- Social login providers

## 🔒 Security & Permissions

### 1. Row Level Security (RLS)

Supabase menggunakan RLS untuk keamanan. Pastikan RLS diaktifkan:

```sql
-- Enable RLS on all tables
ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "GenerateCourse" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "TranscriptQna" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "SoalOtomatis" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "JurnalRefleksi" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAttempt" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "QuizAnswer" ENABLE ROW LEVEL SECURITY;
```

### 2. API Keys

Supabase menyediakan 2 jenis API keys:
- **anon public** - Untuk client-side
- **service_role secret** - Untuk server-side (admin)

## 📊 Monitoring & Analytics

### 1. Database Metrics
- Query performance
- Connection count
- Storage usage
- Bandwidth usage

### 2. Logs
- Database logs
- API request logs
- Error logs

## 🔄 Backup & Restore

### 1. Automatic Backups
- Supabase melakukan backup otomatis setiap hari
- Backup disimpan selama 7 hari (free tier)

### 2. Manual Backup
```bash
# Export database
pg_dump "postgresql://postgres:[password]@[host]:5432/postgres" > backup.sql

# Import database
psql "postgresql://postgres:[password]@[host]:5432/postgres" < backup.sql
```

## 🚀 Deployment dengan Supabase

### 1. Environment Variables Production
```env
# Production Supabase URL
DATABASE_URL="postgresql://postgres:[PROD-PASSWORD]@[PROD-PROJECT-REF].supabase.co:5432/postgres"
```

### 2. Vercel Deployment
1. Push code ke GitHub
2. Import di Vercel
3. Set environment variables
4. Deploy

### 3. Railway Deployment
1. Connect GitHub repository
2. Add environment variables
3. Deploy

## 🐛 Troubleshooting

### Error: "Connection failed"
- Cek DATABASE_URL format
- Pastikan password benar
- Cek network connectivity

### Error: "Permission denied"
- Cek RLS policies
- Verify API keys
- Check user permissions

### Error: "Table not found"
- Jalankan `npx prisma db push`
- Cek schema di Supabase dashboard
- Verify table names

### Error: "SSL connection required"
- Supabase memerlukan SSL
- Pastikan connection string menggunakan `sslmode=require`

### Error: "ENOENT: no such file or directory, scandir 'migrations'"
- **JANGAN gunakan `npx migrate`**
- Gunakan `npx prisma db push` untuk Supabase
- Gunakan `npx prisma migrate dev` untuk database lokal

## 📞 Support

### Supabase Resources
- [Documentation](https://supabase.com/docs)
- [Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase)

### Local Development
```bash
# Switch antara local dan Supabase
# Local
DATABASE_URL="postgresql://postgres:password@localhost:5432/principle_learn"

# Supabase
DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
```

### Quick Fix Script
Lihat dokumentasi untuk troubleshooting migration.

---

**Happy Coding dengan Supabase! 🚀** 