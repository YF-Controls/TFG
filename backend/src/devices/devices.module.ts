import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device } from './entities';
import { AuthModule } from '../auth/auth.module';
import { DeviceTypesModule } from 'src/device-types/device-types.module';
import { DeviceAreasModule } from 'src/device-areas/device-areas.module';
import { DeviceType } from 'src/device-types/entities';
import { DeviceArea } from 'src/device-areas/entities';

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

