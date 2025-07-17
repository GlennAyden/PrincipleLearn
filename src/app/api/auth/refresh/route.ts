import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';
import { verifyToken, generateAccessToken, getTokenExpiration } from '@/lib/jwt';
import { randomBytes } from 'crypto';

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const refreshToken = cookieStore.get('refresh_token')?.value;
    
    // If no refresh token exists, return unauthorized
    if (!refreshToken) {
      return NextResponse.json(
        { error: 'No refresh token provided' },
        { status: 401 }
      );
    }
    
    // Verify the refresh token
    const payload = verifyToken(refreshToken);
    
    // If token is invalid or expired, return unauthorized
    if (!payload) {
      const response = NextResponse.json(
        { error: 'Invalid or expired refresh token' },
        { status: 401 }
      );
      
      // Clear the invalid tokens
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      cookieStore.delete('csrf_token');
      
      return response;
    }
    
    // Find user by ID
    const user = await prisma.user.findUnique({
      where: { id: payload.userId }
    });
    
    // Check if user exists and the refresh token matches
    if (!user || user.refreshToken !== refreshToken) {
      const response = NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
      
      // Clear the invalid tokens
      cookieStore.delete('access_token');
      cookieStore.delete('refresh_token');
      cookieStore.delete('csrf_token');
      
      return response;
    }
    
    // Generate new access token
    const newAccessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });
    
    // Set new access token cookie
    cookieStore.set('access_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    // Set new CSRF token
    const csrfToken = randomBytes(32).toString('hex');
    cookieStore.set('csrf_token', csrfToken, {
      httpOnly: false, // Accessible from JavaScript
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60, // 15 minutes
      path: '/'
    });
    
    // Return success with new CSRF token
    return NextResponse.json({
      success: true,
      csrfToken
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to refresh token' },
      { status: 500 }
    );
  }
} 