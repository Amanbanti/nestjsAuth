import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User) private userModel: typeof User) {}



  //register service
  async register(registerData: CreateAuthDto): Promise<User> {

    const { name, email, password } = registerData;
  
    // Check if user already exists
    const existingUser = await this.userModel.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email is already in use!');
    }
  
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
  
    //Create an instance of the model before saving
    const newUser = new this.userModel({ name, email, password: hashedPassword });
  
    await newUser.save(); 
  
    return newUser;
  }
  
}