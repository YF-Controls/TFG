import { PartialType } from '@nestjs/mapped-types';
import { CreateDeviceAreaDto } from '../../devices/dtos';

export class UpdateDeviceAreaDto extends PartialType(CreateDeviceAreaDto) {}
