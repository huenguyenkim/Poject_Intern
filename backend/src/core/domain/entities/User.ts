import { UserRole } from '../../../common/constants/user-role.enum';

/**
 * User Domain Entity
 */
export class User {
  constructor(
    public readonly id: number,
    public readonly fullName: string,
    public readonly email: string,
    public readonly role: UserRole,
    public readonly password?: string,
    public readonly deletedAt?: Date,
    public readonly tokenVersion: number = 1,
    public readonly resetPasswordTokenHash?: string,
    public readonly resetPasswordExpiresAt?: Date,
    public readonly resetPasswordRetryCount: number = 0,
    public readonly lastPasswordChangeAt?: Date,
    public readonly username?: string,
    public readonly avatarUrl?: string,
    public readonly coverUrl?: string,
    public readonly phone?: string,
    public readonly bio?: string,
    public readonly dob?: string,
    public readonly address?: string,
    public readonly gender?: string,
  ) {}

  static create(data: {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
    password?: string;
    deletedAt?: Date;
    tokenVersion?: number;
    resetPasswordTokenHash?: string;
    resetPasswordExpiresAt?: Date;
    resetPasswordRetryCount?: number;
    lastPasswordChangeAt?: Date;
    username?: string;
    avatarUrl?: string;
    coverUrl?: string;
    phone?: string;
    bio?: string;
    dob?: string;
    address?: string;
    gender?: string;
  }): User {
    return new User(
      data.id,
      data.fullName,
      data.email,
      data.role,
      data.password,
      data.deletedAt,
      data.tokenVersion ?? 1,
      data.resetPasswordTokenHash,
      data.resetPasswordExpiresAt,
      data.resetPasswordRetryCount ?? 0,
      data.lastPasswordChangeAt,
      data.username,
      data.avatarUrl,
      data.coverUrl,
      data.phone,
      data.bio,
      data.dob,
      data.address,
      data.gender,
    );
  }

  /**
   * Identity Check
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
