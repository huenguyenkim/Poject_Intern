import { User } from '../entities/User';

/**
 * User Repository Interface
 */
export abstract class IUserRepository {
  abstract findById(id: number): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(user: Partial<User>): Promise<User>;
  abstract update(id: number, user: Partial<User>): Promise<User>;
  abstract findByResetToken(tokenHash: string): Promise<User | null>;
  abstract delete(id: number): Promise<void>;
}
