import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { subtopicId, moduleIndex, subtopicIndex, feedback, userId, courseId } = await req.json();
    
    // Validasi data
    if (!feedback) {
      return NextResponse.json(
        { error: "Feedback is required" },
        { status: 400 }
      );
    }
    
    // Jika userId dan courseId tersedia, simpan sebagai jurnal refleksi
    if (userId && courseId) {
      try {
        // Temukan user berdasarkan email
        const user = await prisma.user.findUnique({
          where: { email: userId }
        });

        if (!user) {
          console.warn(`User with email ${userId} not found`);
        } else {
          await prisma.jurnalRefleksi.create({
            data: {
              userId: user.id,
              courseId,
              subtopic: `Module ${moduleIndex + 1} - Subtopic ${subtopicIndex + 1}`,
              content: feedback,
            }
          });
          
          console.log('Jurnal refleksi saved to database');
        }
      } catch (dbError: any) {
        console.error('Error saving jurnal refleksi:', dbError);
        // Tetap kirim respons sukses ke client meskipun gagal menyimpan ke database
      }
    }
    
    // Kirim kembali respons ke client
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error saving feedback:', error);
    return NextResponse.json(
      { error: error.message || "Failed to save feedback" },
      { status: 500 }
    );
  }
} 