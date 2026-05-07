import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IHashingService } from './AuthUseCases';
import { MailService } from '../../../infrastructure/notifications/mail.service';
import * as crypto from 'crypto';

@Injectable()
export class RequestPasswordResetUseCase {
  private readonly logger = new Logger(RequestPasswordResetUseCase.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(email: string): Promise<string | null> {
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(sanitizedEmail);
    
    if (!user) {
      this.logger.warn(`Password reset requested for NON-EXISTENT email: ${sanitizedEmail}`);
      return null;
    }

    // Generate a 6-digit OTP
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const resetTokenHash = crypto.createHash('sha256').update(resetOtp).digest('hex');
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes as requested

    await this.userRepository.update(user.id, {
      resetPasswordTokenHash: resetTokenHash,
      resetPasswordExpiresAt: expiresAt,
      resetPasswordRetryCount: 0, // Reset retry count for new request
    } as any);

    await this.mailService.sendPasswordResetEmail(sanitizedEmail, resetOtp);
    
    this.logger.log(`[SECURITY] OTP generated for ${sanitizedEmail}: ${resetOtp}`);
    
    return resetOtp; // Return OTP to the client for debugging/console use
  }
}

@Injectable()
export class VerifyResetTokenUseCase {
  private readonly logger = new Logger(VerifyResetTokenUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(email: string, otp: string): Promise<{ isValid: boolean }> {
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(sanitizedEmail);

    if (!user) {
      throw new BadRequestException('Mã OTP không hợp lệ hoặc đã hết hạn.');
    }

    // Brute-force protection: check retry count
    if (user.resetPasswordRetryCount >= 3) {
      await this.invalidateOtp(user.id);
      throw new BadRequestException('Bạn đã nhập sai quá 3 lần. Vui lòng yêu cầu mã mới.');
    }

    // Check expiration
    if (!user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      throw new BadRequestException('Mã OTP đã hết hạn.');
    }

    const resetTokenHash = crypto.createHash('sha256').update(otp).digest('hex');

    if (!user.resetPasswordTokenHash || user.resetPasswordTokenHash !== resetTokenHash) {
      // Increment retry count
      const newCount = (user.resetPasswordRetryCount || 0) + 1;
      await this.userRepository.update(user.id, { resetPasswordRetryCount: newCount } as any);
      
      this.logger.warn(`Invalid OTP attempt for ${sanitizedEmail}. Attempt: ${newCount}/3`);
      
      if (newCount >= 3) {
        await this.invalidateOtp(user.id);
        throw new BadRequestException('Bạn đã nhập sai quá 3 lần. Vui lòng yêu cầu mã mới.');
      }
      
      throw new BadRequestException(`Mã xác thực không chính xác. Bạn còn ${3 - newCount} lần thử.`);
    }

    return { isValid: true };
  }

  private async invalidateOtp(userId: number) {
    await this.userRepository.update(userId, {
      resetPasswordTokenHash: null,
      resetPasswordExpiresAt: null,
      resetPasswordRetryCount: 0
    } as any);
  }
}

@Injectable()
export class ResetPasswordUseCase {
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly mailService: MailService,
    private readonly verifyResetTokenUseCase: VerifyResetTokenUseCase
  ) {}

  async execute(email: string, otp: string, password: string): Promise<any> {
    const sanitizedEmail = email.trim().toLowerCase();
    
    // First, verify the OTP using the verify use case logic (handles retries)
    await this.verifyResetTokenUseCase.execute(sanitizedEmail, otp);

    const user = await this.userRepository.findByEmail(sanitizedEmail);
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại.');
    }

    // Hash password & update token version (Revoke all sessions)
    const hashedPassword = await this.hashingService.hash(password);
    const newTokenVersion = (user.tokenVersion || 1) + 1;

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      tokenVersion: newTokenVersion,
      resetPasswordTokenHash: null, // Invalidate OTP after success
      resetPasswordExpiresAt: null,
      resetPasswordRetryCount: 0,
      lastPasswordChangeAt: new Date(),
    } as any);

    this.logger.log(`Password reset COMPLETED for user ${user.id} (${user.email})`);

    // Send success email
    await this.mailService.sendPasswordResetSuccessEmail(user.email);

    // Fetch fresh user data to return
    return this.userRepository.findByEmail(sanitizedEmail);
  }
}
