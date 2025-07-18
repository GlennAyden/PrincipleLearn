# Supabase Quick Setup

Panduan cepat untuk setup Supabase sebagai database utama.

## 🚀 Langkah 1: Buat Project Supabase

1. **Buka Supabase**: https://supabase.com
2. **Sign up/Login** dengan GitHub atau email
3. **Klik "New Project"**
4. **Isi informasi**:
   - **Name**: `principle-learn`
   - **Database Password**: Buat password yang kuat (catat!)
   - **Region**: `Asia Southeast (Singapore)`
5. **Klik "Create new project"**
6. **Tunggu setup selesai** (1-2 menit)

## 🔧 Langkah 2: Dapatkan Connection String

1. **Buka project Supabase** yang baru dibuat
2. **Klik Settings** (gear icon) di sidebar kiri
3. **Pilih "Database"**
4. **Scroll ke "Connection string"**
5. **Pilih "URI" format**
6. **Copy connection string**

Format connection string:
```
postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

## 📝 Langkah 3: Update Environment Variables

1. **Buka file `.env.local`** di project
2. **Update DATABASE_URL** dengan connection string Supabase:

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

**Ganti `[YOUR-PASSWORD]` dengan password database yang Anda buat**

## ⚡ Langkah 4: Setup Database

Jalankan commands ini di terminal:

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke Supabase
npx prisma db push
```

## ✅ Langkah 5: Verifikasi Setup

1. **Buka Supabase Dashboard** > **Table Editor**
2. **Pastikan tables terbuat**:
   - `User`
   - `GenerateCourse`
   - `TranscriptQna`
   - `SoalOtomatis`
   - `JurnalRefleksi`
   - `QuizAttempt`
   - `QuizAnswer`

## 🚀 Langkah 6: Jalankan Aplikasi

```bash
npm run dev
```

Buka: http://localhost:3000

## 🐛 Troubleshooting

### Error: "Connection failed"
- Cek DATABASE_URL format
- Pastikan password benar
- Cek network connectivity

### Error: "Table not found"
- Jalankan `npx prisma db push`
- Cek Supabase Dashboard > Table Editor

### Error: "SSL connection required"
- Supabase memerlukan SSL
- Connection string sudah include SSL

## 📊 Supabase Dashboard Features

- **Table Editor**: View dan edit data
- **SQL Editor**: Jalankan query SQL
- **API Docs**: Auto-generated API documentation
- **Authentication**: Built-in auth system

## 🔗 Links Penting

- **Supabase Dashboard**: https://supabase.com/dashboard
- **Documentation**: https://supabase.com/docs
- **Discord Community**: https://discord.supabase.com

---

**Happy Coding dengan Supabase! 🚀** 