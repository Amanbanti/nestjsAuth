import { IsEmail, IsString, MinLength,IsNotEmpty } from 'class-validator';

export class LoginDto {

  
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(6)
  password: string;
}
