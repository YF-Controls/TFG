import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DevicesService } from './devices.service';
import { DevicesController } from './devices.controller';
import { Device } from './entities';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [DevicesController],
  providers: [DevicesService],
  imports : [
    AuthModule,
    TypeOrmModule.forFeature([Device]),
  ],
  exports: [ DevicesModule, TypeOrmModule]

})
export class DevicesModule {}
