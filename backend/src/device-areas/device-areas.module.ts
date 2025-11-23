// System
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
// This module
import { DeviceArea } from './entities';
import { DeviceAreasService } from './device-areas.service';
import { DeviceAreasController } from './device-areas.controller';
// This path


@Module({
  controllers: [DeviceAreasController],
  providers: [DeviceAreasService],
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([DeviceArea]),
  ],
  exports : [TypeOrmModule]
})
export class DeviceAreasModule {}
