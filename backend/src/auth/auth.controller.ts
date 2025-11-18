// System
import { Controller, Get, Post, Body, Patch, Delete, Query, ParseUUIDPipe, Param } from '@nestjs/common';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from './dtos';
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
    return this.authService.loginUser( loginUserDto );
  }
  
  @Get('users')
  @MyAuth(MyValidRoles.admin)
  findAll( @Query() queryParamsDto: QueryParamsDto ) {
    return this.authService.findAll( queryParamsDto );
  }

  @Patch('users/:id')
  @MyAuth(MyValidRoles.admin)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser(id, updateUserDto);
  }

  @Delete('users/:id')
  @MyAuth(MyValidRoles.admin)
  deleteUser(
    @Param('id', ParseUUIDPipe) id: string) {
    return this.authService.deleteUser(id);
  }
  
  @Get('check-status')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  checkAuthStatus(@MyGetUser() user: User){
    return this.authService.checkAuthStatus(user);
  }

}
