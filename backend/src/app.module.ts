// System
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
// Other modules
import { AuthModule } from '@auth/auth.module';
import { DevicesModule } from '@devices/devices.module';
import { CommonModule } from '@common/common.module';
import { DeviceTypesModule } from '@device-types/device-types.module';
import { DeviceAreasModule } from '@device-areas/device-areas.module';
import { IOSystemModule } from '@io-system/io-system.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV !== 'production',
      envFilePath: '.env',
    }),
    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // Always false when using migrations
      migrationsRun: true, // Run migrations automatically on app start
      migrations: ['dist/migrations/*.js'], // Path to compiled migrations
    }),
    IOSystemModule.forRoot({
      host: process.env.IO_SYSTEM_HOST!,
      port: parseInt(process.env.IO_SYSTEM_PORT!, 10),
      maxReconnectAttempts: 10,
      reconnectDelay: 5000,
    }),
    AuthModule,
    DevicesModule,
    DeviceTypesModule,
    DeviceAreasModule,
    CommonModule,

  ],
})
export class AppModule {}
