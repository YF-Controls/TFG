// System
import { PartialType } from '@nestjs/mapped-types';
// This path
import { CreateDeviceDto } from './';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
