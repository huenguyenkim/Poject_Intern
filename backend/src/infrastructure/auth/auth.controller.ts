import { Controller, Post, Get, Body, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterUseCase, LoginUseCase, GetMeUseCase } from '../../core/application/usecases/AuthUseCases';
import { JwtAuthGuard } from './jwt-auth.guard';
import { UserRole } from '../../common/constants/user-role.enum';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
    private readonly getMeUseCase: GetMeUseCase,
  ) {}

  @Post('register')
  async register(@Body() body: any) {
    return this.registerUseCase.execute(body);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.loginUseCase.execute(body.email, body.password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@Request() req: any) {
    return this.getMeUseCase.execute(req.user.id);
  }
}
