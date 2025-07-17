import nodemailer from 'nodemailer';

// For development, we'll use a test account from Ethereal
// In production, use your actual SMTP settings
let transporter: nodemailer.Transporter;

async function createTransporter() {
  // Create a test account if we don't have SMTP settings
  if (!process.env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    console.log('Using test email account:', testAccount.user);
    return;
  }
  
  // Use actual SMTP settings if available
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

// Initialize the transporter
createTransporter().catch(console.error);

/**
 * Send a verification email
 * @param to Recipient email address
 * @param token Verification token
 */
export async function sendVerificationEmail(to: string, token: string) {
  if (!transporter) {
    await createTransporter();
  }
  
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  
  const info = await transporter.sendMail({
    from: `"Principle Learn" <${process.env.SMTP_FROM || 'noreply@principlelearn.com'}>`,
    to,
    subject: 'Verify Your Email Address',
    text: `Please verify your email address by clicking the following link: ${verificationUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e78c0;">Welcome to Principle Learn!</h2>
        <p>Thank you for signing up. Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="display: inline-block; background-color: #1e78c0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Verify Email Address
        </a>
        <p>If you didn't create an account, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
  });
  
  // For development, log the preview URL
  if (!process.env.SMTP_HOST) {
    console.log('Verification email preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
}

/**
 * Send a password reset email
 * @param to Recipient email address
 * @param token Password reset token
 */
export async function sendPasswordResetEmail(to: string, token: string) {
  if (!transporter) {
    await createTransporter();
  }
  
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password`;
  
  const info = await transporter.sendMail({
    from: `"Principle Learn" <${process.env.SMTP_FROM || 'noreply@principlelearn.com'}>`,
    to,
    subject: 'Reset Your Password',
    text: `Please go to the following link to reset your password: ${resetUrl}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1e78c0;">Reset Your Password</h2>
        <p>You requested a password reset. Click the button below to go to the password reset page:</p>
        <a href="${resetUrl}" style="display: inline-block; background-color: #1e78c0; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
          Reset Password
        </a>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
      </div>
    `,
  });
  
  // For development, log the preview URL
  if (!process.env.SMTP_HOST) {
    console.log('Password reset email preview URL:', nodemailer.getTestMessageUrl(info));
  }
  
  return info;
} 