import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dtos';
import { MyAuth, MyGetUser } from './decorators';
import { MyValidRoles } from './interfaces';

import { PaginationDto } from '../common/dtos';
import { User } from './entities';

@Controller('auth')
export class AuthController {
  
  // Attributes or Properties


  // Constructor
  constructor(
    private readonly authService: AuthService)
  {}

  // Methods
  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto ) {
    return this.authService.login( loginUserDto );
  }
  
  @Get()
  @MyAuth(MyValidRoles.admin)
  findAll( @Query() paginationDto:PaginationDto ) {
    return this.authService.findAll( paginationDto );
  }

  @Get('check-status')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  checkAuthStatus(@MyGetUser() user: User){
    return this.authService.checkAuthStatus(user);
  }


}
