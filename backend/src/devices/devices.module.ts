// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
import { DeviceTypesModule } from '@device-types/device-types.module';
import { DeviceAreasModule } from '@device-areas/device-areas.module';
import { IOSystemModule } from '@io-system/io-system.module';
import { DeviceType } from '@device-types/entities';
import { DeviceArea } from '@device-areas/entities';
// This module
import { Device } from './entities';
import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { DevicesGateway } from './devices.gateway';


@Module({
  controllers: [DevicesController],
  providers: [DevicesService, DevicesGateway],
  imports : [
    AuthModule,
    DeviceTypesModule,
    DeviceAreasModule,
    IOSystemModule,
    TypeOrmModule.forFeature([Device, DeviceType, DeviceArea]),
  ],
  exports: [TypeOrmModule, DevicesService]

})
export class DevicesModule {}

