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
    public readonly password?: string, // Password is optional when returning from logic
    public readonly deletedAt?: Date,
  ) {}

  /**
   * Static Factory Method to create a User Domain Entity
   */
  static create(data: {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
    password?: string;
    deletedAt?: Date;
  }): User {
    return new User(
      data.id,
      data.fullName,
      data.email,
      data.role,
      data.password,
      data.deletedAt,
    );
  }

  /**
   * Identity Check
   */
  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }
}
