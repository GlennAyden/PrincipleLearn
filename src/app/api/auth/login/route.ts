import { NextRequest, NextResponse } from 'next/server';
import bcrypt from bcryptjs';
import { generateAccessToken, generateRefreshToken, getTokenExpiration } from '@/lib/jwt';
import { validateEmail } from '@/lib/validation';
import { loginRateLimiter } from '@/lib/rate-limit';
import { randomBytes } from 'crypto';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Get client IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown';
    
    // Check rate limiting
    if (!loginRateLimiter.isAllowed(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }
    
    const { email, password, rememberMe = false } = await req.json();

    // Validate email format
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.message },
        { status: 400 }
      );
    }

    // Validation for required fields
    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email }
    });

    // Check if user exists
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }
    
    // Check if account is locked
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      return NextResponse.json(
        { 
          error: 'Account is temporarily locked due to multiple failed login attempts',
          unlockTime: user.lockedUntil.toISOString()
        },
        { status: 403 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      // Increment failed login attempts
      const failedAttempts = (user.failedLoginAttempts || 0) + 1;
      
      // Lock account after 5 failed attempts
      const updateData: any = { failedLoginAttempts: failedAttempts };
      
      if (failedAttempts >= 5) {
        // Lock account for 15 minutes
        const lockUntil = new Date();
        lockUntil.setMinutes(lockUntil.getMinutes() + 15);
        updateData.lockedUntil = lockUntil;
      }
      
      await prisma.user.update({
        where: { id: user.id },
        data: updateData
      });
      
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Reset failed login attempts on successful login
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    const refreshTokenExpiration = getTokenExpiration(refreshToken);
    
    // Generate access token
    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    // Update user with refresh token and last login
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
        lastLogin: new Date(),
        refreshToken: rememberMe ? refreshToken : null,
        refreshTokenExpires: rememberMe && refreshTokenExpiration ? refreshTokenExpiration : null
      }
    });
    
    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      }
    });
    
    // Set access token cookie (short-lived)
    response.cookies.set('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    // Set refresh token cookie if "remember me" is selected
    if (rememberMe && refreshToken) {
      response.cookies.set('refresh_token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });
    }
    
    // Set CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    response.cookies.set('csrf_token', csrfToken, {
      httpOnly: false, // Accessible from JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    // Add CSRF token to response body
    response.cookies.set = response.cookies.set || {};
    response.cookies.set.csrfToken = csrfToken;

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to login' },
      { status: 500 }
    );
  }
} 