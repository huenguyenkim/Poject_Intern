import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
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
  ) {}

  async execute(data: { name: string; email: string; password: string }): Promise<User> {
    const existing = await this.userRepository.findByEmail(data.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }

    const hashedPassword = await this.hashingService.hash(data.password);
    
    return this.userRepository.create({
      ...data,
      password: hashedPassword,
      role: UserRole.CUSTOMER,
    });
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
    const user = await this.userRepository.findByEmail(email);
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

    const payload = { sub: user.id, role: user.role };
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
