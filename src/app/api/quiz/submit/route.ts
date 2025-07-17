import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface QuizAnswer {
  question: string;
  options: string[];
  userAnswer: string;
  isCorrect: boolean;
  questionIndex: number;
}

interface QuizSubmission {
  userId: string; // Ini adalah email user
  courseId: string;
  subtopic: string;
  score: number;
  answers: QuizAnswer[];
}

export async function POST(req: NextRequest) {
  try {
    const data: QuizSubmission = await req.json();
    
    // Validasi data
    if (!data.userId || !data.courseId || !data.subtopic) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Temukan user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: data.userId }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Simpan quiz attempt ke database
    const quizAttempt = await prisma.quizAttempt.create({
      data: {
        userId: user.id, // Gunakan ID user yang ditemukan
        courseId: data.courseId,
        subtopic: data.subtopic,
        score: data.score,
        answers: {
          create: data.answers.map(answer => ({
            question: answer.question,
            options: answer.options,
            userAnswer: answer.userAnswer,
            isCorrect: answer.isCorrect,
            questionIndex: answer.questionIndex,
          }))
        }
      }
    });

    return NextResponse.json({ success: true, id: quizAttempt.id });
  } catch (error: any) {
    console.error('Error saving quiz attempt:', error);
    return NextResponse.json(
      { error: error.message || "Failed to save quiz attempt" },
      { status: 500 }
    );
  }
} 