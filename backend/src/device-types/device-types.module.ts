import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';
import { DeviceType } from './entities';
import { AuthModule } from '../auth/auth.module';

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
