import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuditModule } from '../audit/audit.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { IHashingService } from '../core/application/usecases/AuthUseCases';
import { BcryptService } from '../infrastructure/auth/bcrypt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    AuditModule,
    NotificationsModule,
  ],
  providers: [
    UsersService,
    {
      provide: IHashingService,
      useClass: BcryptService,
    },
  ],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
