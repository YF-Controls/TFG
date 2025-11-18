// System
import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";
// This module
import { MyValidRoles } from "@auth/interfaces";


export class UpdateUserDto {

  @IsOptional()
  @IsString()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(4)
  fullname?: string;
  
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
  
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(MyValidRoles, { each: true })
  roles?: MyValidRoles[];
}
