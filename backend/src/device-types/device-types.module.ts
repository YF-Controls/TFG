// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
// This module
import { DeviceType } from './entities';
import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';
// This path




@Module({
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DeviceType]),
  ],
  exports : [TypeOrmModule]
})
export class DeviceTypesModule {}
