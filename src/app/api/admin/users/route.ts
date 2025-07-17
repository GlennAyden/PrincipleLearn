// principle-learn/src/app/api/admin/users/route.ts

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    // 1. Ambil semua user dengan field dasar
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            generateCourses: true,
            transcriptQnas: true,
            quizAttempts: true,
            jurnalRefleksis: true,
            soalOtomatis: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // 2. Format the response data
    const payload = users.map((u) => ({
      id: u.id,
      email: u.email,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      totalGenerate: u._count.generateCourses,
      totalTranscripts: u._count.transcriptQnas,
      totalQuizzes: u._count.quizAttempts,
      totalJournals: u._count.jurnalRefleksis,
      totalSoalOtomatis: u._count.soalOtomatis,
      lastActivity: u.updatedAt.toISOString().split('T')[0], // YYYY-MM-DD
    }))

    return NextResponse.json(payload)
  } catch (err: any) {
    console.error('Error di /api/admin/users', err)
    return NextResponse.json(
      { message: err.message || 'Internal Server Error' },
      { status: 500 }
    )
  }
}
