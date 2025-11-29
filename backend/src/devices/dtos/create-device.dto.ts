// System
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Max, MaxLength, Min, MinLength } from "class-validator";

export class CreateDeviceDto {

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
  
  @IsNumber()
  @Min(1)
  @Max(9999)
  number: number;

  @IsString()
  @IsOptional()
  @Length(14, 14)
  hwId?: string;
  
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(250)
  description?: string;
  
  @IsOptional()
  isActive: boolean;
  
  @IsUUID()
  @IsNotEmpty()
  deviceTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  deviceAreaId: string;

}
