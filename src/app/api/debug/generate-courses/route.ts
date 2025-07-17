import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  console.log('[Debug API] Checking generate-course records');
  
  try {
    // Get total count
    const totalCount = await prisma.generateCourse.count();
    console.log(`[Debug API] Found ${totalCount} total generate-course records`);
    
    // Get all records ordered by most recent
    const records = await prisma.generateCourse.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          }
        }
      }
    });
    
    console.log(`[Debug API] Retrieved ${records.length} generate-course records`);
    
    // Format the response
    const formattedRecords = records.map(record => ({
      id: record.id,
      courseName: record.courseName,
      createdAt: record.createdAt.toISOString(),
      userId: record.userId,
      userEmail: record.user.email,
    }));
    
    // Return detailed information
    return NextResponse.json({
      totalCount,
      records: formattedRecords
    });
  } catch (error) {
    console.error('[Debug API] Error retrieving generate-course records:', error);
    if (error instanceof Error) {
      console.error('[Debug API] Error details:', error.message);
      console.error('[Debug API] Error stack:', error.stack);
    }
    
    return NextResponse.json(
      { error: 'Failed to retrieve generate-course records' },
      { status: 500 }
    );
  }
} 