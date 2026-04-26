import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IHashingService } from '../../core/application/usecases/AuthUseCases';

/**
 * Bcrypt Implementation of IHashingService
 */
@Injectable()
export class BcryptService implements IHashingService {
  private readonly saltRounds = 10;

  async hash(data: string | Buffer): Promise<string> {
    return bcrypt.hash(data, this.saltRounds);
  }

  async compare(data: string | Buffer, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}
