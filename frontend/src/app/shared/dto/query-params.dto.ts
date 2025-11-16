// This module
import { OrderDirection } from "../interfaces";

export interface QueryParamsDto {
  limit?: number;
  offset?: number;
  withInactives?: boolean;
  orderBy?: string;
  orderDirection?: OrderDirection;
}