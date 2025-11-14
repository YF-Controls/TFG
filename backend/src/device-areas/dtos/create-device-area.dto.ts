// System
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateDeviceAreaDto {

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
  
  @IsString()
  @MinLength(4)
  @MaxLength(8)
  hwId: string;
  
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  description: string;
  
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

}
