import { Injectable } from '@nestjs/common';
import { CreateLandlordDto } from './dto/create-landlord.dto';
import { UpdateLandlordDto } from './dto/update-landlord.dto';

@Injectable()
export class LandlordService {
  create(createLandlordDto: CreateLandlordDto) {
    return 'This action adds a new landlord';
  }

  findAll() {
    return `This action returns all landlord`;
  }

  findOne(id: number) {
    return `This action returns a #${id} landlord`;
  }

  update(id: number, updateLandlordDto: UpdateLandlordDto) {
    return `This action updates a #${id} landlord`;
  }

  remove(id: number) {
    return `This action removes a #${id} landlord`;
  }
}
