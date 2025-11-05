import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength, Min, MinLength } from "class-validator";

export class CreateDeviceDto {

  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string;
  
  @IsNumber()
  @Min(1)
  nr: number;
  
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  hwId: string;
   
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(250)
  description?: string;
  
  @IsUUID()
  @IsNotEmpty()
  deviceTypeId: string;

  @IsUUID()
  @IsNotEmpty()
  deviceAreaId: string;

}
