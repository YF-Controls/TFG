import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceTypeDto } from './';

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {}
