import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface TranscriptSubmission {
  userId: string; // Email user
  courseId: string;
  subtopic: string;
  question: string;
  answer: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: TranscriptSubmission = await req.json();
    
    // Validasi data
    if (!data.userId || !data.courseId || !data.subtopic || !data.question || !data.answer) {
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

    // Simpan QnA transcript ke database
    const transcript = await prisma.transcriptQna.create({
      data: {
        userId: user.id, // Gunakan ID user yang ditemukan
        courseId: data.courseId,
        subtopic: data.subtopic,
        question: data.question,
        answer: data.answer,
      }
    });

    return NextResponse.json({ success: true, id: transcript.id });
  } catch (error: any) {
    console.error('Error saving transcript:', error);
    return NextResponse.json(
      { error: error.message || "Failed to save transcript" },
      { status: 500 }
    );
  }
} 