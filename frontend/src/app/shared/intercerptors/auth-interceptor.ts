// System
import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";

/*
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Add the withCredentials option to the request
  const newReq = req.clone({withCredentials: true});
  return next(newReq);
}
*/

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  // Add the withCredentials option to the request
  const newReq = req.clone({withCredentials: true});
  return next(newReq);
}

/*
  Hoisting
  Function: Define before or after to use.
  Conts: Define before to use.
  
*/