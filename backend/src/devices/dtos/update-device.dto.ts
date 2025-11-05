import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceDto } from './';

export class UpdateDeviceDto extends PartialType(CreateDeviceDto) {}
