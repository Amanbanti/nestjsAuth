import { Test, TestingModule } from '@nestjs/testing';
import { LandlordController } from './landlord.controller';
import { LandlordService } from './landlord.service';

describe('LandlordController', () => {
  let controller: LandlordController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LandlordController],
      providers: [LandlordService],
    }).compile();

    controller = module.get<LandlordController>(LandlordController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
