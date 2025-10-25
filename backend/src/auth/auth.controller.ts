import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, LoginUserDto } from './dtos';

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

}
