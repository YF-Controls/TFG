// System
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
// Other modules
// This module
import { User } from './entities';
import { MyJwtStrategy } from './strategies';
// This path
import { AuthService, AuthController } from './';


@Module({
  controllers: [AuthController],
  providers: [AuthService, MyJwtStrategy],
  imports: [
    ConfigModule,

    TypeOrmModule.forFeature([User]),

    PassportModule.register({defaultStrategy: 'jwt'}),
    
    JwtModule.registerAsync({
      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory : (configService: ConfigService ) => {
        return {
          secret : configService.get('JWT_SECRET'),
          signOptions: {expiresIn: configService.get('JWT_EXPIRES_IN')}}}
    }),
  ],
  exports: [TypeOrmModule, MyJwtStrategy, PassportModule, JwtModule]
})
export class AuthModule {}
