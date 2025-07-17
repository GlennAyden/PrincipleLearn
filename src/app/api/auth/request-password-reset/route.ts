import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { validateEmail } from '@/lib/validation';
import { sendPasswordResetEmail } from '@/lib/email';
import { randomBytes } from 'crypto';
import { resetPasswordRateLimiter } from '@/lib/rate-limit';

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    if (!resetPasswordRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
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
    
    // For security reasons, don't reveal if the email exists or not
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link.'
      });
    }
    
    // Generate reset token
    const resetToken = randomBytes(32).toString('hex');
    
    // Set token expiry (1 hour)
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);
    
    // Save token to user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetTokenExpires
      }
    });
    
    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken);
    
    return NextResponse.json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link.'
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process password reset request' },
      { status: 500 }
    );
  }
} 