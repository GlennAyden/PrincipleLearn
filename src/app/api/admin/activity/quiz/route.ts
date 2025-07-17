// src/app/api/admin/activity/quiz/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const date   = searchParams.get('date')     // from filter "Tanggal"
    const course = searchParams.get('course')   // from filter "Course"
    const topic  = searchParams.get('topic')    // from filter "Topic/Subtopic"
  
    // Build dynamic filters
    const where: any = {}
    if (userId)  where.userId   = userId
    if (course)  where.courseId = course
    if (topic)   where.subtopic = topic
    if (date) {
      const start = new Date(date)
      const end   = new Date(date)
      end.setDate(start.getDate() + 1)
      where.createdAt = { gte: start, lt: end }
    }
  
    // Fetch quiz attempts with user information
    const attempts = await prisma.quizAttempt.findMany({
      where,
      select: {
        id:        true,
        createdAt: true,
        subtopic:  true,
        score:     true,
        userId:    true,
        user: {
          select: {
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    })
  
    // Shape response to match QuizLogItem in AdminActivityPage
    const payload = attempts.map((a) => ({
      id:        a.id,
      // Format as DD/MM/YYYY for UI
      timestamp: a.createdAt.toLocaleDateString('id-ID'),
      topic:     a.subtopic,
      score:     a.score,
      userEmail: a.user?.email || 'unknown',
      userId:    a.userId
    }))
  
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error fetching quiz logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz logs' },
      { status: 500 }
    );
  }
}
