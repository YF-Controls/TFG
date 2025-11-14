// System
import { PartialType } from '@nestjs/mapped-types';
// This path
import { CreateDeviceAreaDto } from './';

export class UpdateDeviceAreaDto extends PartialType(CreateDeviceAreaDto) {}
