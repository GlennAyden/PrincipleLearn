// src/app/api/admin/activity/quiz/[id]/route.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Fix: Ensure params is awaited before accessing its properties
    const id = params.id

    // Fetch quiz attempt with detailed answers
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id },
      include: {
        answers: {
          orderBy: { questionIndex: 'asc' } // ensure correct order
        }
      }
    })

    if (!attempt) {
      return NextResponse.json(
        { error: 'Quiz attempt not found' },
        { status: 404 }
      )
    }

    // Transform to the shape expected by QuizResultModal
    const result = attempt.answers.map((ans, idx) => ({
      no:         idx + 1,
      question:   ans.question,
      options:    ans.options,          // array of strings
      userAnswer: ans.userAnswer,
      status:     ans.isCorrect ? 'Benar' : 'Salah',
    }))

    return NextResponse.json({ id, result })
  } catch (error) {
    console.error('Error fetching quiz attempt:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quiz attempt details' },
      { status: 500 }
    );
  }
}
