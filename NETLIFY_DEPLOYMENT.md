# Netlify Deployment Guide

Panduan untuk deploy aplikasi Principle Learn ke Netlify dengan integrasi Supabase yang benar.

## 🔧 Environment Variables for Netlify

Masuk ke **Netlify Dashboard > Site Settings > Environment Variables** dan tambahkan:

### Required Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres.suzlapyyvlmpwhpeirla:PrincipleLearn15@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1

# Supabase Auth (REQUIRED for login/signup)
NEXT_PUBLIC_SUPABASE_URL=https://suzlapyyvlmpwhpeirla.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1emxhcHl5dmxtcHdocGVpcmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTc3NzYsImV4cCI6MjA2NTk5Mzc3Nn0.s4mx3R4GCHgokhcey4exNKA4c7lSSL55z8D5TXl6UTA

# App Authentication
JWT_SECRET=principle-learn-secret-key-production-2024

# OpenAI API (Required for AI features)
OPENAI_API_KEY=your-openai-api-key-here

# Email Configuration (Optional - for notifications)
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Supabase Additional (Backend)
SUPABASE_URL=https://suzlapyyvlmpwhpeirla.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1emxhcHl5dmxtcHdocGVpcmxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MTc3NzYsImV4cCI6MjA2NTk5Mzc3Nn0.s4mx3R4GCHgokhcey4exNKA4c7lSSL55z8D5TXl6UTA
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1emxhcHl5dmxtcHdocGVpcmxhIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDQxNzc3NiwiZXhwIjoyMDY1OTkzNzc2fQ.Qv8d-tTp3CYe0cLIcxlGUiTwc4zoK58YTULzPqkJnEs
SUPABASE_JWT_SECRET=fR7NuhgXDvymmmqRqBT/0TA5jmtpIf0C4r9aoSudFOcryV9ScUzoz+QCYweIx3tbGv1u4eaghkaDrijpk7yGJQ==
```

## 🚀 Deployment Steps

### 1. Prerequisites
- Repository sudah connected ke Netlify
- Supabase project sudah setup dengan benar
- Environment variables sudah ditambahkan

### 2. Build Configuration
File `netlify.toml` sudah dikonfigurasi dengan:
- Node.js 18
- Next.js plugin
- Proper redirects untuk auth callback

### 3. Supabase Setup Verification
Pastikan di Supabase Dashboard:

#### Authentication Settings
1. **Authentication > Settings > Site URL**
   ```
   https://your-netlify-site.netlify.app
   ```

2. **Authentication > Settings > Redirect URLs**
   ```
   https://your-netlify-site.netlify.app/auth/callback
   https://your-netlify-site.netlify.app/dashboard
   ```

#### Database Tables
Pastikan semua tables sudah dibuat dengan `npx prisma db push`

## 🔍 Troubleshooting

### Error: "Supabase env vars missing"
- Pastikan `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` sudah di set
- Check Netlify environment variables di dashboard

### Error: "JWT_SECRET belum di-set"
- Tambahkan `JWT_SECRET` di Netlify environment variables
- Value: `principle-learn-secret-key-production-2024`

### Error: Login/Signup tidak bekerja
1. Check browser console untuk error
2. Verify Supabase URL konsisten dengan anon key
3. Check Supabase Auth settings (Site URL, Redirect URLs)

### Error: Build gagal
1. Check Node.js version (harus 18+)
2. Verify semua required env vars sudah di set
3. Check Netlify build logs untuk specific error

## 📱 Testing After Deployment

1. **Test Login**
   - Buat user di Supabase Dashboard > Authentication > Users
   - Test login dengan email/password

2. **Test Signup**
   - Test signup dengan email baru
   - Check user muncul di Supabase Auth

3. **Test Database Connection**
   - Test create course
   - Check data tersimpan di Supabase Tables

## 🔐 Security Notes

- Semua environment variables sudah menggunakan production keys
- Database URL menggunakan pooled connection untuk optimasi
- JWT secret menggunakan strong key untuk production

## 🆘 Support

Jika masih ada masalah:
1. Check Netlify deploy logs
2. Check browser console
3. Verify Supabase dashboard settings
4. Test environment variables local vs production

---

**Deploy sukses! 🎉**