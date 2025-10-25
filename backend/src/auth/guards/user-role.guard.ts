import { CanActivate, ExecutionContext, Injectable, BadRequestException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { META_ROLES } from '../decorators';
import { User } from '../entities';



@Injectable()
export class MyUserRoleGuard implements CanActivate {

  constructor (
    private readonly reflector : Reflector
  ){}


  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    
    // Get validRoles
    const validRoles : string[] = this.reflector.get( META_ROLES, context.getHandler() )

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles)
      if (validRoles.includes(role)) return true;

    // Exit with error
    throw new ForbiddenException(`User ${ user.fullname} need a valid role: [${validRoles}]`);
  }
}