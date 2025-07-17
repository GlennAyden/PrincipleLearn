// src/app/api/admin/activity/jurnal/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const date   = searchParams.get('date')     // filter "Tanggal"
    const course = searchParams.get('course')   // filter "Course"
    const topic  = searchParams.get('topic')    // filter "Topic/Subtopic"
  
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
  
    // Fetch reflection journal logs with user information
    const logs = await prisma.jurnalRefleksi.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      select: {
        id:        true,
        createdAt: true,
        subtopic:  true,
        content:   true,
        userId:    true,
        user: {
          select: {
            email: true
          }
        }
      },
    })
  
    // Shape response to match JournalLogItem in AdminActivityPage
    const payload = logs.map((log) => ({
      id:        log.id,
      // Format as DD/MM/YYYY for UI
      timestamp: log.createdAt.toLocaleDateString('id-ID'),
      topic:     log.subtopic,
      content:   log.content,  // full text for modal
      userEmail: log.user?.email || 'unknown',
      userId:    log.userId
    }))
  
    return NextResponse.json(payload)
  } catch (error) {
    console.error('Error fetching journal logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch journal logs' },
      { status: 500 }
    );
  }
}
