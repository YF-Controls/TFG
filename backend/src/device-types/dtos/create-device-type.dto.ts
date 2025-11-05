import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDeviceTypeDto {

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
  
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  hwId: string;
  
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(250)
  description?: string;
  
}
