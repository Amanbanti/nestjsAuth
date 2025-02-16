import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {RefreshTokenDto} from './dto/refresh-token.dto'
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // /auth/register
  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    return this.authService.register(registerData);
  }

   // /auth/login
   @Post('login')
   async login(@Body() loginDto: LoginDto) {
     return this.authService.login(loginDto);
   }

   // /auth/refresh-token
  @Post('refresh-token')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshAccessToken(refreshTokenDto.refreshToken);
  }
}
