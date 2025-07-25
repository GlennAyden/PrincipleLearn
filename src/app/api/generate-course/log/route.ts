import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

// Add CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}

interface GenerateCourseLog {
  userId: string; // Email user
  courseName: string;
  parameter: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: GenerateCourseLog = await req.json();
    
    // Validasi data
    if (!data.userId || !data.courseName) {
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

    // Simpan log generate course ke database
    const log = await prisma.generateCourse.create({
      data: {
        userId: user.id, // Gunakan ID user yang ditemukan
        courseName: data.courseName,
        parameter: data.parameter || '',
      }
    });

    console.log('Generate course log created:', log.id);
    return NextResponse.json({ success: true, id: log.id }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Error saving generate course log:', error);
    return NextResponse.json(
      { error: error.message || "Failed to save generate course log" },
      { status: 500, headers: corsHeaders }
    );
  }
} 