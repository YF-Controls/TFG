// System
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Min } from 'class-validator';
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
    default: false,
    description: 'Whether to include inactive items in the results'
  })
  @IsOptional()
  @Type( () => Boolean )
  withInactives?: boolean = false;
  
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
    description: 'Filter by field name'
  })
  @IsOptional()
  @Type( () => String )
  filterBy?: string;

  @ApiProperty({
    required: false,
    description: 'Value to be filtered by'
  })
  @IsOptional()
  @Type( () => String )
  filterValue?: string;
}