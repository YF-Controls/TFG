import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { DeviceTypes } from "../interfaces/device-types.interface";

export class CreateDeviceDto {

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(250)
  description?: string;
  
  @IsString()
  @IsEnum(DeviceTypes)
  type: string;

}
