import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail } from '@/lib/validation';
import { resetPasswordRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    if (!resetPasswordRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    const { email } = await req.json();
    
    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      );
    }
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    // Return 404 if user doesn't exist
    if (!user) {
      return NextResponse.json(
        { error: 'No account found with this email address' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email validated successfully'
    });
  } catch (error: any) {
    console.error('Email validation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate email' },
      { status: 500 }
    );
  }
} 