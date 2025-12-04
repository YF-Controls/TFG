// This module
import { OrderDirection } from "@shared/interfaces";

export interface QueryParamsDto {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  filterBy?: string[];
  filterValue?: string[];
}