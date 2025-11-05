import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceAreasService } from './device-areas.service';
import { DeviceAreasController } from './device-areas.controller';
import { DeviceArea } from './entities';
import { AuthModule } from '../auth/auth.module';

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
