// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
import { DeviceType } from '@device-types/entities';
import { DeviceArea } from '@device-areas/entities';
import { DeviceTypesModule } from '@device-types/index';
import { DeviceAreasModule } from '@device-areas/index';
// This module
import { Device } from './entities';
// This path
import { DevicesService, DevicesController } from './';


@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports : [
    AuthModule,
    DeviceTypesModule,
    DeviceAreasModule,
    TypeOrmModule.forFeature([Device, DeviceType, DeviceArea]),
  ],
  exports: [ DevicesModule, TypeOrmModule]

})
export class DevicesModule {}

