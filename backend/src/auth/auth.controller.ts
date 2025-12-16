// System
import { Controller, Get, Post, Body, Patch, Delete, Query, ParseUUIDPipe, Param, Res } from '@nestjs/common';
import type { Response, CookieOptions } from 'express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
// Other modules
import { QueryParamsDto } from '@common/dtos';
// This module
import { RegisterUserDto, LoginUserDto, UpdateUserDto } from '@auth/dtos';
import { MyAuth, MyGetUser } from '@auth/decorators';
import { MyValidRoles } from '@auth/interfaces';
import { User } from '@auth/entities';
import { AuthService } from '@auth/auth.service';



@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  
  // Constructor
  constructor(private readonly authService: AuthService){}

  // CRUD Methods
  // Create: POST
  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered successfully.', type: User })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async registerOne(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response) {
    // Register
    const result = await this.authService.registerOne(registerUserDto);
    // Set JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }

  // Login: POST
  @Post('login')
  async loginOne(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) response: Response) {
    // Login
    const result = await this.authService.loginOne(loginUserDto);
    // Set JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }
  
  // Logout: POST
  @Post('logout')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  logoutOne(@Res({ passthrough: true }) response: Response) {
    // Clear the cookie
    response.clearCookie('token');
    return { message: 'Logout successful' };
  }

  // Read: GET
  @Get('users')
  @MyAuth(MyValidRoles.admin)
  findAll( @Query() queryParamsDto: QueryParamsDto ) {
    // Return all users
    return this.authService.findAll( queryParamsDto );
  }

  // Read: GET
  @Get('users/:id')
  @MyAuth(MyValidRoles.admin)
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() queryParamsDto: QueryParamsDto ) {
    // Return all users
    return this.authService.findOne( id, queryParamsDto);
  }
  
  // Read: GET
  @Get('check-user')
  @MyAuth(MyValidRoles.admin, MyValidRoles.user)
  async checkUser(
    @MyGetUser() user: User,
    @Res({ passthrough: true }) response: Response) {
    // Check
    const result = await this.authService.checkUser(user);
    // Renew JWT in HttpOnly cookie
    response.cookie('token', result.token, this.buildCookieOptions());
    // Return user
    return { user: result.user };
  }

  // Update: PATCH
  @Patch('users/:id')
  @MyAuth(MyValidRoles.admin)
  updateOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateOne(id, updateUserDto);
  }
  
  // Delete: DELETE
  @Delete('users/:id')
  @MyAuth(MyValidRoles.admin)
  deleteOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.authService.deleteOne(id);
  }
  
  // Helper Methods
  // Build Cookie Options
  private buildCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      //secure: false, // Must be false for HTTP (use true only with HTTPS)
      secure: true, // Now using HTTPS through reverse proxy
      //sameSite: 'lax', // 'lax' allows cross-port cookies on same domain
      sameSite: 'strict', // Maximum security with same domain
      maxAge: +process.env.BACKEND_COOKIE_MAX_AGE!,
      path: '/', // Cookie available for all paths
    }
  }
}
