import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { PassportModule } from '@nestjs/passport';
import { User } from './entities/auth.entity';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load .env globally
    SequelizeModule.forFeature([User]),
    PassportModule, // Needed for AuthGuard('jwt')
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'), // Get JWT secret from .env
        signOptions: { expiresIn: '1h' }, // Token expiration
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy], // Register JwtStrategy here
  exports: [AuthService, JwtModule], // Export JWT for other modules
})
export class AuthModule {}
