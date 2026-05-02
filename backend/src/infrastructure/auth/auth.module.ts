import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { RegisterUseCase, LoginUseCase, GetMeUseCase, IHashingService, ITokenService } from '../../core/application/usecases/AuthUseCases';
import { IUserRepository } from '../../core/domain/repositories/IUserRepository';
import { TypeOrmUserRepository } from '../persistence/repositories/TypeOrmUserRepository';
import { BcryptService } from './bcrypt.service';
import { JwtTokenService } from './jwt.service';
import { User as UserEntity } from '../../users/entities/user.entity';
import { RememberToken } from './entities/remember-token.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, RememberToken]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'candy_secret_key_2024',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    RegisterUseCase,
    LoginUseCase,
    GetMeUseCase,
    {
      provide: IUserRepository,
      useClass: TypeOrmUserRepository,
    },
    {
      provide: IHashingService,
      useClass: BcryptService,
    },
    {
      provide: ITokenService,
      useClass: JwtTokenService,
    },
  ],
  exports: [IUserRepository, IHashingService, ITokenService],
})
export class AuthModule {}
