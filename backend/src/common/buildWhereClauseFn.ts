// System
import { Like } from 'typeorm';
// Other modules
import { QueryParamsDto } from "./dtos";


export function buildWhereClauseFn(queryParamsDto: QueryParamsDto, id: string | null = null): any {
    // Check query parametes
    const {
      withInactives = false,
      filterBy = null,
      filterValue = null } = queryParamsDto;
    
    // Build where clause
    const whereClause: any = {
      ...(id && { id }),
      ...(!withInactives && { isActive: true }),
    };

    // Add filter if provided
    if (filterBy && filterValue) {
      if (filterValue.includes('%'))
        whereClause[filterBy] = Like(filterValue.replace(/%/g, '%'));
      else
        whereClause[filterBy] = filterValue;
    }
    
    console.log('!DELETE buildWhereClauseFn:', whereClause);
    return whereClause;
  }