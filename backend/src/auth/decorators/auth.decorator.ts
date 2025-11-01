import { applyDecorators, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { MyValidRoles } from "../interfaces";
import { MyUserRoleGuard } from "../guards";
import { MyRoleProtected } from "./";


export function MyAuth(...roles: MyValidRoles[]) {
  return applyDecorators(
    MyRoleProtected(...roles),
    UseGuards( AuthGuard(), MyUserRoleGuard),
  );
}
