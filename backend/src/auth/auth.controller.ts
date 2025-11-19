// System
import { Controller, Get, Post, Body, Patch, Delete, Query, ParseUUIDPipe, Param, Res } from '@nestjs/common';
import type { Response, CookieOptions } from 'express';
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
  
  // ##################################
  // Methods
  // ##################################
  constructor(private readonly authService: AuthService){}

  @Post('register')
  async registerUser(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response) {
    // Register
    const result = await this.authService.registerUser(registerUserDto);
    // Set JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }

  @Post('login')
  async loginUser(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response) {
    // Login
    const result = await this.authService.loginUser(loginUserDto);
    // Set JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }
  
  @Get('users')
  @MyAuth(MyValidRoles.admin)
  findAll( @Query() queryParamsDto: QueryParamsDto ) {
    // Return all users
    return this.authService.findAll( queryParamsDto );
  }

  @Get('roles')
  @MyAuth(MyValidRoles.admin)
  getRoles() {
    return Object.values(MyValidRoles);
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
  deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.deleteUser(id);
  }
  
  @Get('check-user')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  async checkUser(
    @MyGetUser() user: User,
    @Res({ passthrough: true }) response: Response) {
    // Check
    const result = await this.authService.checkAuthStatus(user);
    // Renew JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }

  @Post('logout')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  logoutUser(@Res({ passthrough: true }) response: Response) {
    // Clear the cookie
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }


  private buildCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: Number(process.env.COOKIE_MAX_AGE)
    }
  }
}
