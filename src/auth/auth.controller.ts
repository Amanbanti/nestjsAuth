import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
// import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //Post  /auth/register
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

  // @Post('login')
  // async login(@Body() loginDto: LoginDto) {
  //   const user = await this.authService.findOne(loginDto.email);
  //   if (!user) {
  //     return { message: 'User not found' };
  //   }
  //   return { message: 'Login successful', user };
  // }
}
