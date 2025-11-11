// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Ohter modules
import { AuthModule } from '@auth/index';
// This module
import { DeviceArea } from './entities';
import { DeviceAreasController, DeviceAreasService } from './';


@Module({
  controllers: [DeviceAreasController],
  providers: [DeviceAreasService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DeviceArea]),
  ],
  exports : [DeviceAreasModule, TypeOrmModule]
})
export class DeviceAreasModule {}
