import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';


export const MyGetUser = createParamDecorator(
  ( userField: string, ctx: ExecutionContext ) => {

    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if ( !user ) throw new InternalServerErrorException('User not found (request)');
        
    return (!userField) ? user : user[userField]; // return all User or parts of user according to data 
    }
);
