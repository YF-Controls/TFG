// System
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from './dtos';
import { User } from './entities';
import { MyJwtPayload } from './interfaces';
// This path


@Injectable()
export class AuthService {
  
  // Properties
  private readonly logger = new Logger('AuthService');

  // Constructor
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>,
    private readonly jwtService : JwtService,
  ) {}

  // Methods
  async registerUser(registerUserDto: RegisterUserDto) {
    try {
      // password, email, fullName...
      const { password, ...userData } = registerUserDto;
      // Create user entity
      const user = this.repository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      // Save user
      await this.repository.save(user);
      // Delete password to send response
      delete user.password;
      // Return user info
      return {
        user,
        token : this.generateJwt({id: user.id})
      };
    } catch (error) {this.handleDBErrors( error );}
  }
  
  async loginUser( loginUserDto : LoginUserDto) {
    // Get data
    const {email, password} = loginUserDto;
    // Find user
    const user = await this.repository.findOne({
      where : { email },
      select : {id : true, email : true, fullname: true, password : true, isActive: true, roles: true}
    });
    // Check user and password
    if (!user) throw new UnauthorizedException('Credentials are not valid (email)');
    if (!bcrypt.compareSync(password, user.password!)) throw new UnauthorizedException('Credentials are not valid (password)');
    if (!user.isActive) throw new UnauthorizedException('User is not active. Contact with admin.');
    // Delete password to send response
    delete user.password;
    // Return user info
    return {
      user,
      token : this.generateJwt({id: user.id})
    };
  }
  
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Query
    const result = await this.repository.update(
      {id},
      {...updateUserDto}
    );
    // Result
    if (result.affected === 0)
      throw new NotFoundException(`User with ID ${id} was not found`);
  }


  async deleteUser(id: string) {
    // Return
    return await this.repository.delete({id});
  }


  async checkAuthStatus(user: User) {
    // Delete password to send response
    delete user.password;
    // Return user info
    return {
      user,
      token : this.generateJwt({id: user.id})
    };
  }
  
  async findAll(queryParamsDto: QueryParamsDto) {
    // Check query parametes
    const {
      limit = 10,
      offset = 0,
      withInactives = false,
      orderBy = 'id',
      orderDirection = 'ASC' } = queryParamsDto;
            
    return await this.repository.find({
      take : limit,
      skip : offset,
      order : { [orderBy] : orderDirection },
      ...(!withInactives && { where : { isActive : true } })
    });
  }
  
  private generateJwt(payload : MyJwtPayload): String {
    return this.jwtService.sign(payload);
  }
  
  private handleDBErrors( error: any ): never {
    if ( error.code === '23505' ) 
      throw new BadRequestException( error.detail );
    
    this.logger.error( error.detail );
    throw new InternalServerErrorException('Please check server logs');
  }
}
