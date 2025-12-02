// System
import { Type, Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Min, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
// This module
import { OrderDirection } from '../interfaces';


export class QueryParamsDto {
  
  @ApiProperty({
    required: false,
    default: 10,
    description: 'Maximum number of items to return' 
  })
  @IsOptional()
  @IsPositive()
  @Type( () => Number )
  limit?: number;
  
  @ApiProperty({
    required: false,
    default: 0,
    description: 'Number of items to skip before starting to collect the result set'
  })
  @IsOptional()
  @Min(0)
  @Type( () => Number ) 
  offset?: number;
    
  @ApiProperty({
    required: false,
    default: 'id',
    description: 'Field to order the results by'
  })
  @IsOptional()
  @Type( () => String ) 
  orderBy?: string;

  @ApiProperty({
    required: false,
    enum() {return OrderDirection;},
    description: 'Direction to order the results by'
  })
  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  
  @ApiProperty({
    required: false,
    description: 'Filter by field name(s). Can be single value or array.',
    type: [String],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @IsString({ each: true })
  filterBy?: string[];

  @ApiProperty({
    required: false,
    description: 'Value(s) to be filtered by. Can be single value or array.',
    type: [String],
    isArray: true
  })
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  @IsArray()
  @IsString({ each: true })
  filterValue?: string[];
}