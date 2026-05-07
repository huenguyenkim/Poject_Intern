import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { UserRole } from '../../../common/constants/user-role.enum';

/**
 * Interface for Password Hashing (Port)
 */
export abstract class IHashingService {
  abstract hash(data: string | Buffer): Promise<string>;
  abstract compare(data: string | Buffer, encrypted: string): Promise<boolean>;
}

/**
 * Interface for Token Generation (Port)
 */
export abstract class ITokenService {
  abstract generate(payload: any): string;
  abstract verify(token: string): any;
}

/**
 * Register Use Case
 */
@Injectable()
export class RegisterUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(data: { fullName: string; email: string; password: string }): Promise<{ user: User; accessToken: string }> {
    const sanitizedEmail = data.email.trim().toLowerCase();
    const existing = await this.userRepository.findByEmail(sanitizedEmail);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashingService.hash(data.password);
    
    const user = await this.userRepository.create({
      ...data,
      email: sanitizedEmail,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });

    const payload = { sub: user.id, role: user.role, version: user.tokenVersion || 1 };
    const token = this.tokenService.generate(payload);

    return {
      user,
      accessToken: token,
    };
  }
}

/**
 * Stage 1: Request Registration OTP
 */
@Injectable()
export class RegisterRequestUseCase {
  private otpStore = new Map<string, { otp: string; data: any; expiresAt: number }>();

  constructor(private readonly userRepository: IUserRepository) {}

  async execute(data: { fullName: string; email: string; password: string }): Promise<{ message: string; devOtp?: string }> {
    const input = data.email.trim().toLowerCase();
    const isEmail = input.includes('@');
    
    // Check if already registered
    const existing = isEmail 
      ? await this.userRepository.findByEmail(input)
      : await this.userRepository.findByPhone(input);

    if (existing) {
      throw new ConflictException(isEmail ? 'Email này đã được sử dụng' : 'Số điện thoại này đã được sử dụng');
    }
    
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Store temporarily
    this.otpStore.set(input, {
      otp,
      data: {
        ...data,
        email: isEmail ? input : `${input}@phone.com`, // Placeholder for required email field
        phone: isEmail ? undefined : input
      },
      expiresAt
    });

    console.log(`[OTP] Registration OTP for ${input}: ${otp}`);

    return {
      message: 'OTP sent to your email/phone',
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
  }

  getPendingData(email: string, otp: string) {
    const pending = this.otpStore.get(email.trim().toLowerCase());
    if (!pending) return null;
    if (pending.otp !== otp) return null;
    if (pending.expiresAt < Date.now()) {
      this.otpStore.delete(email.trim().toLowerCase());
      return null;
    }
    return pending.data;
  }

  clearPending(email: string) {
    this.otpStore.delete(email.trim().toLowerCase());
  }
}

/**
 * Stage 2: Verify OTP and Finish Registration
 */
@Injectable()
export class RegisterVerifyUseCase {
  constructor(
    private readonly requestUseCase: RegisterRequestUseCase,
    private readonly registerUseCase: RegisterUseCase,
  ) {}

  async execute(email: string, otp: string): Promise<{ user: User; accessToken: string }> {
    const data = this.requestUseCase.getPendingData(email, otp);
    if (!data) {
      throw new BadRequestException('Mã xác thực không chính xác hoặc đã hết hạn.');
    }

    const result = await this.registerUseCase.execute(data);
    this.requestUseCase.clearPending(email);
    return result;
  }
}

/**
 * Login Use Case
 */
@Injectable()
export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashingService: IHashingService,
    private readonly tokenService: ITokenService,
  ) {}

  async execute(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const sanitizedEmail = email.trim().toLowerCase();
    const user = await this.userRepository.findByEmail(sanitizedEmail);
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.deletedAt) {
      throw new UnauthorizedException('Account has been deactivated');
    }

    const isMatch = await this.hashingService.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { sub: user.id, role: user.role, version: user.tokenVersion || 1 };
    const token = this.tokenService.generate(payload);

    return {
      user,
      accessToken: token,
    };
  }
}

/**
 * Get Current User Use Case
 */
@Injectable()
export class GetMeUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
