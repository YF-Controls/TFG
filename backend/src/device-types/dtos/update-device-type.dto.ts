// System
import { PartialType } from '@nestjs/mapped-types';
// This path
import { CreateDeviceTypeDto } from './';

export class UpdateDeviceTypeDto extends PartialType(CreateDeviceTypeDto) {}
