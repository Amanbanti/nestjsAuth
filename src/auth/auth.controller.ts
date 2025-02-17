import { Controller, Post, Body,Put,UseGuards,Request  } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import {RefreshTokenDto} from './dto/refresh-token.dto'
import { JwtAuthGuard } from './guards/auth.guard';
import {ChangePasswordDto} from './dto/change-password.dto'
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

  // /auth/change-password
  @Put('change-password')
  @UseGuards(JwtAuthGuard) // Protect the route
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.authService.changePassword(req.user.id, changePasswordDto);
  }
  

}
