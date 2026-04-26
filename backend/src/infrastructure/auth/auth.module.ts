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

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: 'candy_secret_key_2024', // Nên dùng environment variable
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
