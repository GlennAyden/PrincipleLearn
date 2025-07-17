import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    
    // Check if user is an admin
    if (user.role === 'ADMIN') {
      return NextResponse.json(
        { error: "Cannot delete admin users" },
        { status: 403 }
      );
    }
    
    // Delete all related data in the correct order to respect foreign key constraints
    // Use transaction to ensure all operations succeed or fail together
    await prisma.$transaction(async (tx) => {
      // 1. Delete quiz answers first (they reference quiz attempts)
      await tx.quizAnswer.deleteMany({
        where: {
          quizAttempt: {
            userId: userId
          }
        }
      });
      
      // 2. Delete quiz attempts
      await tx.quizAttempt.deleteMany({
        where: { userId: userId }
      });
      
      // 3. Delete journal reflections
      await tx.jurnalRefleksi.deleteMany({
        where: { userId: userId }
      });
      
      // 4. Delete soal otomatis
      await tx.soalOtomatis.deleteMany({
        where: { userId: userId }
      });
      
      // 5. Delete transcript QnAs
      await tx.transcriptQna.deleteMany({
        where: { userId: userId }
      });
      
      // 6. Delete generated courses
      await tx.generateCourse.deleteMany({
        where: { userId: userId }
      });
      
      // 7. Finally delete the user
      await tx.user.delete({
        where: { id: userId }
      });
    });
    
    return NextResponse.json({ 
      success: true,
      message: `User ${user.email} and all associated data successfully deleted`
    });
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
