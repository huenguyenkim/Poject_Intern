import { IsEmail, IsString, MinLength, Length } from 'class-validator';

export class RequestPasswordResetDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;
}

export class VerifyPasswordResetDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  otp: string;
}

export class ResetPasswordDto {
  @IsEmail({}, { message: 'Please enter a valid email' })
  email: string;

  @IsString()
  @Length(6, 6, { message: 'OTP must be exactly 6 characters' })
  otp: string;

  @IsString()
  @MinLength(8, { message: 'New password must be at least 8 characters' })
  newPassword: string;
}
