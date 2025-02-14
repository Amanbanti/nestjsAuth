import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/auth.entity';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}

