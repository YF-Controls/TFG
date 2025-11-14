// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
import { DeviceTypesModule } from '@device-types/device-types.module';
import { DeviceAreasModule } from '@device-areas/device-areas.module';
import { DeviceType } from '@device-types/entities';
import { DeviceArea } from '@device-areas/entities';
// This module
import { Device } from './entities';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
// This path


@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports : [
    AuthModule,
    DeviceTypesModule,
    DeviceAreasModule,
    TypeOrmModule.forFeature([Device, DeviceType, DeviceArea]),
  ],
  exports: [TypeOrmModule]

})
export class DevicesModule {}

