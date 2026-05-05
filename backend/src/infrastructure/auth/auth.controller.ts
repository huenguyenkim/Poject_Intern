import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus, Res, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes, createHash } from 'crypto';
import type { Response } from 'express';
import { Repository } from 'typeorm';
import { RegisterUseCase, LoginUseCase, GetMeUseCase, IHashingService, ITokenService } from '../../core/application/usecases/AuthUseCases';
import { RequestPasswordResetUseCase, VerifyResetTokenUseCase, ResetPasswordUseCase } from '../../core/application/usecases/PasswordRecoveryUseCases';
import { JwtAuthGuard } from './jwt-auth.guard';

import { CreateUserDto } from '../../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RequestPasswordResetDto, ResetPasswordDto } from './dto/password-reset.dto';
import { User as UserEntity } from '../../users/entities/user.entity';
import { RememberToken } from './entities/remember-token.entity';
import { blacklistToken } from './token-blacklist.store';

const REMEMBER_COOKIE_NAME = 'candy_remember';
const REMEMBER_MAX_AGE_MS = 30 * 24 * 60 * 60 * 1000;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
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

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto, @Res({ passthrough: true }) response: Response) {
    const result = await this.loginUseCase.execute(loginDto.email, loginDto.password);

    if (loginDto.rememberMe) {
      await this.issueRememberCookie(result.user.id, response);
    }

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

    await this.rememberTokenRepository.delete(rememberToken.id);
    await this.issueRememberCookie(rememberToken.user.id, response);

    const user = await this.getMeUseCase.execute(rememberToken.user.id);
    return {
      user,
      accessToken: this.tokenService.generate({ sub: user.id, role: user.role, version: user.tokenVersion }),
    };
  }

  @Post('password/forgot')
  @HttpCode(HttpStatus.OK)
  async forgotPassword(@Body() dto: RequestPasswordResetDto) {
    const token = await this.requestResetUseCase.execute(dto.email);
    return { 
      message: 'If that email exists, a password reset link has been sent.',
      devToken: process.env.NODE_ENV === 'development' ? token : undefined
    };
  }

  @Post('password/verify')
  @HttpCode(HttpStatus.OK)
  async verifyToken(@Body() dto: { token: string }) {
    return this.verifyResetTokenUseCase.execute(dto.token);
  }

  @Post('password/reset')
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Body() dto: ResetPasswordDto) {
    await this.resetPasswordUseCase.execute(dto.token, dto.newPassword);
    return { message: 'Password has been reset successfully. Please login with your new password.' };
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

  private async issueRememberCookie(userId: number, response: Response) {
    const selector = randomBytes(12).toString('hex');
    const validator = randomBytes(32).toString('hex');
    const token = this.rememberTokenRepository.create({
      selector,
      validatorHash: this.sha256(validator),
      expiresAt: new Date(Date.now() + REMEMBER_MAX_AGE_MS),
      user: { id: userId } as UserEntity,
    });

    await this.rememberTokenRepository.save(token);
    response.cookie(REMEMBER_COOKIE_NAME, `${selector}:${validator}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: REMEMBER_MAX_AGE_MS,
      path: '/',
    });
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
