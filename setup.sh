#!/bin/bash

echo "========================================"
echo "   Media Pembelajaran dengan AI"
echo "   Setup Script untuk Linux/Mac"
echo "========================================"
echo

echo "[1/5] Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js tidak ditemukan!"
    echo "Silakan download dan install Node.js dari: https://nodejs.org/"
    exit 1
fi
echo "✓ Node.js sudah terinstall"
echo

echo "[2/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Gagal install dependencies!"
    exit 1
fi
echo "✓ Dependencies berhasil diinstall"
echo

echo "[3/5] Checking .env.local file..."
if [ ! -f ".env.local" ]; then
    echo "WARNING: File .env.local tidak ditemukan!"
    echo
    echo "Silakan buat file .env.local dengan isi:"
    echo
    echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/principle_learn\""
    echo "JWT_SECRET=\"your-secret-key\""
    echo "OPENAI_API_KEY=\"your-openai-api-key\""
    echo "EMAIL_USER=\"your-email@gmail.com\""
    echo "EMAIL_PASS=\"your-app-password\""
    echo
    read -p "Tekan Enter untuk melanjutkan..."
else
    echo "✓ File .env.local ditemukan"
fi
echo

echo "[4/5] Generating Prisma client..."
npx prisma generate
if [ $? -ne 0 ]; then
    echo "WARNING: Gagal generate Prisma client"
    echo "Pastikan database sudah disetup dengan benar"
fi
echo

echo "[5/5] Setup selesai!"
echo
echo "Untuk menjalankan aplikasi:"
echo "  npm run dev"
echo
echo "Kemudian buka browser dan akses:"
echo "  http://localhost:3000"
echo
echo "Jika ada masalah, cek file README.md untuk troubleshooting"
echo 