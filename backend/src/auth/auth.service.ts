import { BadRequestException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { RegisterUserDto, LoginUserDto } from './dtos';
import { User } from './entities';
import { MyJwtPayload } from './interfaces';



@Injectable()
export class AuthService {

  // Attributes or Properties
  private readonly logger = new Logger('AuthService');

  // Constructor
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService : JwtService,
  ) {}

  // Methods
  async registerUser(registerUserDto: RegisterUserDto) {

    try {
      // password, email, fullName
      const { password, ...userData } = registerUserDto;

      // Prepare the user entity
      // email, password, fullName, isActive, roles
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });

      // Save the user entity to the database
      await this.userRepository.save(user);
      
      // Return user info
      return {
        id : user.id,
        email : user.email,
        fullname : user.fullname,
        token : this.generateJwt({id: user.id})
      };
      
    } catch (error) {this.handleDBErrors( error );}
  }


  async login( loginUserDto : LoginUserDto) {
    try {
      // Get data
      const {email, password} = loginUserDto;

      // Find user
      const user = await this.userRepository.findOne({
        where : { email },
        select : {id : true, email : true, fullname: true, password : true}
      });

      // Check user and password
      if (!user) throw new UnauthorizedException('Credentials are not valid (email)');
      if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Credentials are not valid (password)');

      // Return user info
      return {
        id : user.id,
        email : user.email,
        fullname : user.fullname,
        token : this.generateJwt({id: user.id})
      };
    } catch (error) {this.handleDBErrors( error );}
  }
  

  private generateJwt(payload : MyJwtPayload) {
    return this.jwtService.sign(payload);
  }
  

  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );
    
    this.logger.error( error.detail );
    throw new InternalServerErrorException('Please check server logs');
  }
}
