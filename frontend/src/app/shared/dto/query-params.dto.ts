// This module
import { OrderDirection } from "../interfaces";

export interface QueryParamsDto {
  limit?: number;
  offset?: number;
  orderBy?: string;
  orderDirection?: OrderDirection;
  filterBy?: string[];
  filterValue?: string[];
}