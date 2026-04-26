import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ITokenService } from '../../core/application/usecases/AuthUseCases';

/**
 * NestJS JWT Implementation of ITokenService
 */
@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(private readonly jwtService: NestJwtService) {}

  generate(payload: any): string {
    return this.jwtService.sign(payload);
  }

  verify(token: string): any {
    return this.jwtService.verify(token);
  }
}
