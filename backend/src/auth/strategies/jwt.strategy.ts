// System
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport"
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { Request } from 'express';
// This module
import { User } from "../entities";
import { MyJwtPayload } from "../interfaces";


@Injectable()
export class MyJwtStrategy extends PassportStrategy( Strategy ) {

  // Constructor
  constructor (
    @InjectRepository(User)
    private readonly userRepository : Repository<User>) {
    // Init super
    super({
      jwtFromRequest : ExtractJwt.fromExtractors([
        (request: Request) => request?.cookies?.token || null, // Try to get token from cookie first
        ExtractJwt.fromAuthHeaderAsBearerToken() // Fallback to Authorization header for backward compatibility
      ]),
      secretOrKey : process.env.BACKEND_JWT_SECRET!,
    });
  }
  
  // Method: Validate
  async validate(payload: MyJwtPayload): Promise<User> {
    // Get id from payload inside of jwt sent via authorization/bearer header
    const { id } = payload;
    // Get user fron database
    const user = await this.userRepository.findOneBy({id})
    // Check user
    if (!user) throw new UnauthorizedException('MyJwtParload.validate = Token not valid');
    if (!user.isActive) throw new UnauthorizedException('MyJwtParload.validate = User is inactive, talk with an admin');
    // Return user data
    return user;
  }
}