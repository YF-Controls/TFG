import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device } from './entities';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports : [
    TypeOrmModule.forFeature([Device]),
  ],
  exports: [TypeOrmModule]

})
export class DevicesModule {}
