// principle-learn/src/app/api/admin/register/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcrypt'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validasi: email & password wajib diisi
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi' },
        { status: 400 }
      )
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Format email tidak valid' },
        { status: 400 }
      )
    }

    // Cek apakah admin sudah terdaftar
    const existing = await prisma.user.findUnique({
      where: { email }
    })
    if (existing) {
      return NextResponse.json(
        { message: 'Admin sudah terdaftar' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Buat record admin baru
    const admin = await prisma.user.create({
      data: {
        email,
        passwordHash,
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(
      { message: 'Admin berhasil didaftarkan', data: admin },
      { status: 201 }
    )
  } catch (err: any) {
    console.error('Error di /api/admin/register:', err)
    return NextResponse.json(
      { message: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
