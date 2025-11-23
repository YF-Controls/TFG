// System
import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Min } from 'class-validator';
// This module
import { OrderDirection } from '../interfaces';

export class QueryParamsDto {
  
  @IsOptional()
  @IsPositive()
  @Type( () => Number ) 
  limit?: number;
    
  @IsOptional()
  @Min(0)
  @Type( () => Number ) 
  offset?: number;

  @IsOptional()
  @Type( () => Boolean )
  withInactives?: boolean = false;
  
  @IsOptional()
  @Type( () => String ) 
  orderBy?: string;

  @IsOptional()
  @IsEnum(OrderDirection)
  orderDirection?: OrderDirection;
  
}