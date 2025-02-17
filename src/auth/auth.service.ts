import { Injectable, ConflictException, UnauthorizedException,BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refreshToken.entity';
import { Op } from 'sequelize';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ForgotPasswordDto,ResetPasswordDto } from './dto/forgot-password.dto';
import { MailService } from '../mail/mail.service';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
    private mailService: MailService,
    @InjectModel(RefreshToken) private refreshTokenModel: typeof RefreshToken,
    private jwtService: JwtService
  ) {}

  // Register API
  async register(registerData: CreateAuthDto): Promise<User> {
    const { name, email, password } = registerData;

    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use!');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.userModel.create({ name, email, password: hashedPassword });

    return newUser;
  }

  // Login API
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.userModel.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid email or passowrd!');
    }

    return this.generateTokens(user);
  }

  // Generate Access & Refresh Tokens
  async generateTokens(user: User) {
          const payload = { id : user.id, email: user.email };
          const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
          const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

        // Store refresh token in DB
        await this.refreshTokenModel.create({
          token: refreshToken,
          userId: Number(user.id),
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
          revoked: false,
      } as RefreshToken);
    


    return { access_token: accessToken, refresh_token: refreshToken };
  }

  // Refresh Token API
  async refreshAccessToken(refreshToken: string) {
        const storedToken = await this.refreshTokenModel.findOne({
          where: {
            token: refreshToken,
            revoked: false,
            expiresAt: { [Op.gt]: new Date() },
          },
        });

        if (!storedToken) {
          throw new UnauthorizedException('Invalid or expired refresh token, Login again!');
        }

        const payload = this.jwtService.verify(refreshToken);
        const newAccessToken = this.jwtService.sign({ userId: payload.userId, email: payload.email }, { expiresIn: '1h' });

        return { access_token: newAccessToken };
  }



     // change password api end-point
      async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
    
        const user = await this.userModel.findByPk(userId);
       
        if (!user) {
          throw new UnauthorizedException('User not found');
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
          throw new UnauthorizedException('Old password is incorrect');
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return { message: 'Password changed successfully' };
      }



      // Generate Reset Token & Send Email
      async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
        const { email } = forgotPasswordDto;
        const user = await this.userModel.findOne({ where: { email } });
    
        if (!user) throw new NotFoundException('User not found');
    
        const resetToken = this.jwtService.sign({ id: user.id }, { expiresIn: '1h' });
    
        // Send Email with Reset Link
        await this.mailService.sendResetPasswordEmail(email, resetToken);
    
        return { message: 'Password reset link has been sent to your email' };
      }

      //Step 2: Verify Token & Reset Password
      async resetPassword(resetPasswordDto: ResetPasswordDto) {
        const { token, newPassword } = resetPasswordDto;

        try {
          const decoded = this.jwtService.verify(token);
          const user = await this.userModel.findByPk(decoded.id);

          if (!user) throw new NotFoundException('User not found');

          //Hash new password
          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await user.update({ password: hashedPassword });

          return { message: 'Password reset successfully' };
        } catch (error) {
          throw new BadRequestException('Invalid or expired reset token');
        }
      }
      
}
