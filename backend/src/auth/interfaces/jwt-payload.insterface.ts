
export interface MyJwtPayload {
  id : string;
  iat?: number; // Issued at (timestamp)
  exp?: number; // Expiration time (timestamp)
}

