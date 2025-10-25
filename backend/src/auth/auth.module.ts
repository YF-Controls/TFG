import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';
import { MyJwtStrategy } from './strategies/jwt.strategy';



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
