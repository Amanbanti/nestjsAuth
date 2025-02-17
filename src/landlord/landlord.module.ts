import { Module } from '@nestjs/common';
import { LandlordService } from './landlord.service';
import { LandlordController } from './landlord.controller';

@Module({
  controllers: [LandlordController],
  providers: [LandlordService],
})
export class LandlordModule {}
