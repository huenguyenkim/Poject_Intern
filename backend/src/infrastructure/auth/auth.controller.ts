import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHash } from 'crypto';
import type { Response } from 'express';
import { Repository } from 'typeorm';
import { RegisterUseCase, RegisterRequestUseCase, RegisterVerifyUseCase, LoginUseCase, GetMeUseCase, IHashingService, ITokenService } from '../../core/application/usecases/AuthUseCases';
import { RequestPasswordResetUseCase, VerifyResetTokenUseCase, ResetPasswordUseCase } from '../../core/application/usecases/PasswordRecoveryUseCases';
import { JwtAuthGuard } from './jwt-auth.guard';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, VerifyPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { User as UserEntity } from '../../users/entities/user.entity';
import { RememberToken } from './entities/remember-token.entity';
import { blacklistToken } from './token-blacklist.store';

const REMEMBER_COOKIE_NAME = 'candy_remember';
const REMEMBER_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly registerRequestUseCase: RegisterRequestUseCase,
    private readonly registerVerifyUseCase: RegisterVerifyUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
    private readonly hashingService: IHashingService,
    private readonly tokenService: ITokenService,
    private readonly requestResetUseCase: RequestPasswordResetUseCase,
    private readonly verifyResetTokenUseCase: VerifyResetTokenUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(RememberToken)
    private readonly rememberTokenRepository: Repository<RememberToken>,
  ) { }

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.registerUseCase.execute(createUserDto);
  }

  @Post('register/request')
  async registerRequest(@Body() createUserDto: CreateUserDto) {
    return this.registerRequestUseCase.execute(createUserDto);
  }

  @Post('register/verify')
  async registerVerify(@Body() dto: { email: string; otp: string }) {
    return this.registerVerifyUseCase.execute(dto.email, dto.otp);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);

    // Always issue a refresh token (cookie), but its persistence depends on rememberMe
    await this.issueRememberCookie(result.user.id, response, !!loginDto.rememberMe);

    return result;
  }

  @Post('remember')
  @HttpCode(HttpStatus.OK)
  async remember(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const rawCookie = this.getCookie(req.headers?.cookie || '', REMEMBER_COOKIE_NAME);
    if (!rawCookie) {
      throw new UnauthorizedException('No remember session found');
    }

    const [selector, validator] = rawCookie.split(':');
    if (!selector || !validator) {
      this.clearRememberCookie(response);
      throw new UnauthorizedException('Invalid remember session');
    }

    const rememberToken = await this.rememberTokenRepository.findOne({
      where: { selector },
      relations: ['user'],
    });

    const validatorHash = this.sha256(validator);
    if (!rememberToken || rememberToken.validatorHash !== validatorHash || rememberToken.expiresAt < new Date() || rememberToken.user.deletedAt) {
      this.clearRememberCookie(response);
      if (rememberToken) {
        await this.rememberTokenRepository.delete(rememberToken.id);
      }
      throw new UnauthorizedException('Remember session expired');
    }

    // Token Rotation: Delete old and issue new one
    await this.rememberTokenRepository.delete(rememberToken.id);
    
    // Maintain the same persistence as before by checking if cookie had an expiration hint
    // If the expiration is far in the future (> 24h), we assume it was a persistent cookie
    const isPersistent = rememberToken.expiresAt.getTime() - Date.now() > 24 * 60 * 60 * 1000;
    await this.issueRememberCookie(rememberToken.user.id, response, isPersistent);

    const user = await this.getMeUseCase.execute(rememberToken.user.id);
    return {
      user,
      accessToken: this.tokenService.generate({ sub: user.id, role: user.role, version: user.tokenVersion }),
    };
  }

  // Changed from password/forgot to forgot-password/request to match frontend Auth.jsx
  @Post('forgot-password/request')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: RequestPasswordResetDto) {
    const otp = await this.requestResetUseCase.execute(dto.email);
    return { 
      message: 'If that email exists, an OTP has been sent.',
      devOtp: process.env.NODE_ENV === 'development' ? otp : undefined
    };
  }

  @Post('forgot-password/verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() dto: VerifyPasswordResetDto) {
    return this.verifyResetTokenUseCase.execute(dto.email, dto.otp);
  }

  @Post('forgot-password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto, @Res({ passthrough: true }) response: Response) {
    const user = await this.resetPasswordUseCase.execute(dto.email, dto.otp, dto.newPassword);
    
    // Automatically login the user after password reset
    await this.issueRememberCookie(user.id, response, true); // Persistent by default for UX
    
    const accessToken = this.tokenService.generate({ 
      sub: user.id, 
      role: user.role, 
      version: user.tokenVersion 
    });

    return { 
      message: 'Mật khẩu đã được cập nhật. Bạn đã được đăng nhập tự động!', 
      user,
      accessToken
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req: any, @Res({ passthrough: true }) response: Response) {
    const token = this.extractBearerToken(req);
    if (token) {
      blacklistToken(token);
    }

    const rawCookie = this.getCookie(req.headers?.cookie || '', REMEMBER_COOKIE_NAME);
    const selector = rawCookie?.split(':')[0];
    if (selector) {
      await this.rememberTokenRepository.delete({ selector });
    }

    this.clearRememberCookie(response);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    return this.getMeUseCase.execute(req.user.id);
  }

  private async issueRememberCookie(userId: number, response: Response, isPersistent: boolean) {
    const selector = randomBytes(12).toString('hex');
    const validator = randomBytes(32).toString('hex');
    
    // If not persistent, token expires in 2 hours in DB (Session-like)
    // If persistent, token expires in 30 days
    const expirationMs = isPersistent ? REMEMBER_MAX_AGE_MS : 2 * 60 * 60 * 1000;

    const token = this.rememberTokenRepository.create({
      selector,
      validatorHash: this.sha256(validator),
      expiresAt: new Date(Date.now() + expirationMs),
      user: { id: userId } as UserEntity,
    });

    await this.rememberTokenRepository.save(token);

    const cookieOptions: any = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    if (isPersistent) {
      cookieOptions.maxAge = REMEMBER_MAX_AGE_MS;
    }
    // If NOT persistent, we don't set maxAge/expires -> Browser treats as Session Cookie

    response.cookie(REMEMBER_COOKIE_NAME, `${selector}:${validator}`, cookieOptions);
  }

  private clearRememberCookie(response: Response) {
    response.clearCookie(REMEMBER_COOKIE_NAME, { path: '/' });
  }

  private getCookie(cookieHeader: string, name: string): string | null {
    const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
    const target = cookies.find((cookie) => cookie.startsWith(`${name}=`));
    return target ? decodeURIComponent(target.slice(name.length + 1)) : null;
  }

  private sha256(value: string): string {
    return createHash('sha256').update(value).digest('hex');
  }

  private extractBearerToken(req: any): string | null {
    const [type, token] = req.headers?.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : null;
  }
}
