import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from './entities/refreshToken.entity';
import { Op } from 'sequelize';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User) private userModel: typeof User,
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
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  // Generate Access & Refresh Tokens
  async generateTokens(user: User) {
          const payload = { userId: user.id, email: user.email };

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

  
}
