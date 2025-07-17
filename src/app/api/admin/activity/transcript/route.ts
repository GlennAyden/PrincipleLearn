// src/app/api/admin/activity/transcript/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const date   = searchParams.get('date')       // format: 'YYYY-MM-DD'
    const course = searchParams.get('course')     // from query param "course"
    const topic  = searchParams.get('topic')      // from query param "topic"
  
    // Build filter object
    const where: any = {}
    if (userId)  where.userId   = userId
    if (date) {
      const start = new Date(date)
      const end   = new Date(date)
      end.setDate(start.getDate() + 1)
      where.createdAt = { gte: start, lt: end }
    }
    if (course) where.courseId = course
    if (topic)  where.subtopic = topic
  
    // Fetch logs from transcriptQna table with user information
    const logs = await prisma.transcriptQna.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id:        true,
        createdAt: true,
        subtopic:  true,
        question:  true,
        answer:    true,
        userId:    true,
        user: {
          select: {
            email: true
          }
        }
      },
    })
  
    // Shape response to match TranscriptLogItem in AdminActivityPage
    const payload = logs.map((log) => ({
      id:        log.id,
      // format timestamp as DD/MM/YYYY
      timestamp: log.createdAt.toLocaleDateString('id-ID'),
      topic:     log.subtopic,
      // embed question and answer for modal parsing
      content:   `Q: ${log.question}\nA: ${log.answer}`,
      userEmail: log.user?.email || 'unknown',
      userId:    log.userId
    }))
  
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error fetching transcript logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transcript logs' },
      { status: 500 }
    );
  }
}
