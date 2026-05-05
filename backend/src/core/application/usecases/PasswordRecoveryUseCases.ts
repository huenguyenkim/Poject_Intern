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
      // Security: don't reveal if user exists to the frontend
      // But log internally for monitoring
      this.logger.warn(`Password reset requested for NON-EXISTENT email: ${sanitizedEmail}`);
      return null;
    }

    this.logger.log(`Password reset requested for VALID email: ${sanitizedEmail}. User ID: ${user.id}`);

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await this.userRepository.update(user.id, {
      resetPasswordTokenHash: resetTokenHash,
      resetPasswordExpiresAt: expiresAt,
    });

    await this.mailService.sendPasswordResetEmail(sanitizedEmail, resetToken);
    return resetToken;
  }
}

@Injectable()
export class VerifyResetTokenUseCase {
  private readonly logger = new Logger(VerifyResetTokenUseCase.name);

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(token: string): Promise<{ isValid: boolean }> {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.userRepository.findByResetToken(resetTokenHash);

    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      this.logger.warn(`Invalid or expired token verification attempt: ${token.substring(0, 5)}...`);
      throw new BadRequestException('Invalid or expired reset token');
    }

    return { isValid: true };
  }
}

@Injectable()
export class ResetPasswordUseCase {
  private readonly logger = new Logger(ResetPasswordUseCase.name);

  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly mailService: MailService,
  ) {}

  async execute(token: string, password: string): Promise<void> {
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const user = await this.userRepository.findByResetToken(resetTokenHash);

    if (!user || !user.resetPasswordExpiresAt || user.resetPasswordExpiresAt < new Date()) {
      this.logger.error(`Critical: Unauthorized password reset attempt with invalid token hash: ${resetTokenHash}`);
      throw new BadRequestException('Invalid or expired reset token');
    }

    // Hash password & update token version (Revoke all sessions)
    const hashedPassword = await this.hashingService.hash(password);
    const newTokenVersion = (user.tokenVersion || 1) + 1;

    await this.userRepository.update(user.id, {
      password: hashedPassword,
      tokenVersion: newTokenVersion,
      resetPasswordTokenHash: undefined, // Step 6: Invalidate token
      resetPasswordExpiresAt: undefined,
      lastPasswordChangeAt: new Date(),
    });

    this.logger.log(`Password reset COMPLETED for user ${user.id} (${user.email})`);

    // Step 8: Send success email
    await this.mailService.sendPasswordResetSuccessEmail(user.email);
  }
}
