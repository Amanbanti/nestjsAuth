import { IsEmail, IsNotEmpty,MaxLength,Matches,MinLength} from 'class-validator';

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class ResetPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
    @MaxLength(20, { message: 'Password cannot be longer than 20 characters' })
    @Matches(/(?=.*[a-z])/, {
      message: 'Password must contain at least one lowercase letter',
    })
    @Matches(/(?=.*[A-Z])/, {
      message: 'Password must contain at least one uppercase letter',
    })
    @Matches(/(?=.*[@$!%*?&])/, {
      message: 'Password must contain at least one special character!',
    })
  newPassword: string;
}
