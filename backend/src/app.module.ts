// System
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// Ohter modules
import { AuthModule } from '@auth/auth.module';
import { DevicesModule } from '@devices/devices.module';
import { CommonModule } from '@common/common.module';
import { DeviceTypesModule } from '@device-types/device-types.module';
import { DeviceAreasModule } from '@device-areas/device-areas.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // In production must be false
    }),

    AuthModule,
    DevicesModule,
    DeviceTypesModule,
    DeviceAreasModule,
    CommonModule,
  ],
})
export class AppModule {}
