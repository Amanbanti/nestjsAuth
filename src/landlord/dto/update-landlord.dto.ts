import { PartialType } from '@nestjs/mapped-types';
import { CreateLandlordDto } from './create-landlord.dto';

export class UpdateLandlordDto extends PartialType(CreateLandlordDto) {}
