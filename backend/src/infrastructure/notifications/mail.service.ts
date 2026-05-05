import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;
  private readonly logger = new Logger(MailService.name);

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'smtp.ethereal.email',
      port: Number(process.env.MAIL_PORT) || 587,
      secure: process.env.MAIL_SECURE === 'true',
      auth: {
        user: process.env.MAIL_USER || 'mock_user',
        pass: process.env.MAIL_PASS || 'mock_pass',
      },
    });
  }

  async sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const resetUrl = `${process.env.FRONTEND_URL}/vi/auth?step=3&token=${token}`;
    
    const mailOptions = {
      from: '"Candy Shop Support" <support@candyshop.com>',
      to: email,
      subject: 'Reset Your Password - Candy Shop',
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 40px; background-color: #fcf6fa;">
          <h1 style="color: #e040a0; font-size: 32px; font-weight: 900; margin-bottom: 24px;">🍭 CANDY SHOP</h1>
          <h2 style="color: #2d2a4a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Password Recovery Request</h2>
          <p style="color: #5d5a8a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            We received a request to reset your password. If you didn't make this request, you can safely ignore this email.
          </p>
          <a href="${resetUrl}" style="display: inline-block; background-color: #e040a0; color: #ffffff; padding: 18px 36px; border-radius: 20px; text-decoration: none; font-weight: 900; font-size: 16px; box-shadow: 0 10px 20px rgba(224, 64, 160, 0.2);">
            RESET MY PASSWORD
          </a>
          <p style="color: #5d5a8a; font-size: 14px; margin-top: 40px; opacity: 0.7;">
            This link will expire in 15 minutes.
          </p>
        </div>
      `,
    };

    try {
      if (process.env.NODE_ENV === 'development' && (!process.env.MAIL_USER || process.env.MAIL_USER === 'mock_user')) {
        this.logger.log(`[MAIL MOCK] Sending reset email to ${email}. Token: ${token}`);
        this.logger.log(`[MAIL MOCK] Reset URL: ${resetUrl}`);
        return;
      }
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send password reset email to ${email}`, error.stack);
    }
  }

  async sendPasswordResetSuccessEmail(email: string): Promise<void> {
    const mailOptions = {
      from: '"Candy Shop Support" <support@candyshop.com>',
      to: email,
      subject: 'Password Changed Successfully - Candy Shop',
      html: `
        <div style="font-family: 'DM Sans', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 40px; background-color: #f6fcf8;">
          <h1 style="color: #2ecc71; font-size: 32px; font-weight: 900; margin-bottom: 24px;">🍭 CANDY SHOP</h1>
          <h2 style="color: #2d2a4a; font-size: 24px; font-weight: 800; margin-bottom: 20px;">Security Alert: Password Updated</h2>
          <p style="color: #5d5a8a; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Your password has been changed successfully. You can now log in using your new credentials.
          </p>
          <div style="background-color: #e8f8f0; padding: 20px; border-radius: 15px; border-left: 5px solid #2ecc71;">
            <p style="margin: 0; color: #27ae60; font-weight: bold; font-size: 14px;">
              If you did not perform this change, please contact our support team immediately.
            </p>
          </div>
          <p style="color: #5d5a8a; font-size: 14px; margin-top: 40px; opacity: 0.7;">
            Stay sweet!
          </p>
        </div>
      `,
    };

    try {
      if (process.env.NODE_ENV === 'development' && (!process.env.MAIL_USER || process.env.MAIL_USER === 'mock_user')) {
        this.logger.log(`[MAIL MOCK] Sending SUCCESS notification to ${email}`);
        return;
      }
      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Password reset success email sent to ${email}`);
    } catch (error) {
      this.logger.error(`Failed to send success email to ${email}`, error.stack);
    }
  }
}
