// System
import { Like } from 'typeorm';
// Other modules
import { QueryParamsDto } from "./dtos";


export function buildWhereClauseFn(queryParamsDto: QueryParamsDto, id: string | null = null, hwId: string | null = null ): any {
  // Check query parametes
  const {
    filterBy = null,
    filterValue = null } = queryParamsDto;
  // Build where clause
  const whereClause: any = {
    ...(id && { id }),
    ...(hwId && { hwId }),
  };
  // Add filters if provided (skip undefined values)
  if (filterBy && filterValue && filterBy.length > 0 && filterBy.length === filterValue.length) {
    filterBy.forEach((field, index) => {
      const value = filterValue[index];
      // Skip if field or value is undefined/null
      if (field && value !== undefined && value !== null) {
        whereClause[field] = value.includes('%') ? Like(value) : value;
      }
    });
  }
  // Return
  return whereClause;
}