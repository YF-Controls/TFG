// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/index';
// This module
import { DeviceType } from './entities';
// This path
import { DeviceTypesService, DeviceTypesController } from './';




@Module({
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DeviceType]),
  ],
  exports : [DeviceTypesModule, TypeOrmModule]
})
export class DeviceTypesModule {}
