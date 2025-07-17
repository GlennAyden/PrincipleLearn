import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

interface JurnalSubmission {
  userId: string; // Email user
  courseId: string;
  subtopic: string;
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: JurnalSubmission = await req.json();
    
    // Validasi data
    if (!data.userId || !data.courseId || !data.subtopic || !data.content) {
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

    // Simpan jurnal refleksi ke database
    const jurnal = await prisma.jurnalRefleksi.create({
      data: {
        userId: user.id, // Gunakan ID user yang ditemukan
        courseId: data.courseId,
        subtopic: data.subtopic,
        content: data.content,
      }
    });

    return NextResponse.json({ success: true, id: jurnal.id });
  } catch (error: any) {
    console.error('Error saving jurnal refleksi:', error);
    return NextResponse.json(
      { error: error.message || "Failed to save jurnal refleksi" },
      { status: 500 }
    );
  }
} 