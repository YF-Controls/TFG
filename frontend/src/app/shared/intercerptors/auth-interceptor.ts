// System
import { HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
// Other modules
import { AuthApi } from "@auth/services";


export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {

  // Inject the current `AuthApi` and use it to get an authentication token:
  const token = inject(AuthApi).token();

  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('Authorization', `Bearer ${token}`),
  });
  
  return next(newReq);
}