import { SetMetadata } from "@nestjs/common";
import { MyValidRoles } from "../interfaces";


export const META_ROLES = 'roles';

export const MyRoleProtected = (...args : MyValidRoles[]) => {
  return SetMetadata(META_ROLES, args);
};