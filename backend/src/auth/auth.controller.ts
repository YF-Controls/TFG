// System
import { Controller, Get, Post, Body, Patch, Delete, Query } from '@nestjs/common';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { RegisterUserDto, LoginUserDto } from './dtos';
import { MyAuth, MyGetUser } from './decorators';
import { MyValidRoles } from './interfaces';
import { User } from './entities';
// This path
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
  
  // Constructor
  constructor(private readonly authService: AuthService){}

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
  findAll( @Query() queryParamsDto: QueryParamsDto ) {
    return this.authService.findAll( queryParamsDto );
  }

  @Get('check-status')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  checkAuthStatus(@MyGetUser() user: User){
    return this.authService.checkAuthStatus(user);
  }

}
