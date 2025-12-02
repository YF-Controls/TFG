// System
import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, tap } from "rxjs";
// Other modules
import { environment } from "@env/environment";
import { QueryParamsDto } from "@shared/dto";
import { OrderDirection } from '@shared/interfaces';
// This module
import { User, AuthResponse, ValidRoles } from "../interfaces";
import { LoginUserDto, RegisterUserDto, UpdateUserDto } from "../dtos";


// Authentication status
export enum AuthStatus {
  checking = 'checking',
  authenticated = 'authenticated',
  notAuthenticated = 'not-authenticated'};

// URLs
const baseUrl = environment.baseUrl;
const LOGIN_URL: string = `${baseUrl}/auth/login`;
const REGISTER_URL: string = `${baseUrl}/auth/register`;
const LOGOUT_URL: string = `${baseUrl}/auth/logout`;
const CHECK_USER_URL: string = `${baseUrl}/auth/check-user`;
const USERS_URL: string = `${baseUrl}/auth/users`;

@Injectable({providedIn: 'root'})
export class AuthApi {
  
  // Injections
  private readonly http = inject(HttpClient);
  
  // Properties
  private _user = signal<User | null>(null);
  private _status = signal<AuthStatus>(AuthStatus.checking);
  
  // Properties
  checkStatusResource = rxResource<string | null, null>({
    stream: () => this.checkUser(),
    defaultValue: "Error",
  });
  user = computed<User | null>(() => this._user());
  status = computed<AuthStatus>(() => {
    if (this._status() === AuthStatus.checking) return AuthStatus.checking;
    if (this._user()) return AuthStatus.authenticated;
    return AuthStatus.notAuthenticated;
  });
  isAdmin = computed<boolean>(() => this._user()?.roles.includes(ValidRoles.admin) ?? false);
  isUser = computed<boolean>(() => this._user()?.roles.includes(ValidRoles.user) ?? false);
  
  // CRUD Methods
  // Create: POST
  registerUser(registerUserDto: RegisterUserDto): Observable<string | null> {
    
    return this.http.post<AuthResponse>(REGISTER_URL, registerUserDto, { withCredentials: true })
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // Update: PATCH
  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<string | null> {
    return this.http.patch<AuthResponse>(`${USERS_URL}/${id}`, updateUserDto, { withCredentials: true })
      .pipe(
        map((authResponse: AuthResponse) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error updating user'))
      );
  }
  
  // Delete: DELETE
  deleteUser(id: string): Observable<string | null> {
    return this.http.delete<void>(`${USERS_URL}/${id}`)
      .pipe(
        map(() => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting user'))
      );
  }


  // Read: GET
  getUsers(queryParamsDto: QueryParamsDto): Observable<User[]> {
    const params: any = { ...queryParamsDto };
    if (params.withInactives !== true) delete params.withInactives;
    return this.http.get<User[]>(USERS_URL, {params : params});
  }
  

  // Read: GET
  checkUser(): Observable<string | null> {
    // Token is now in HttpOnly cookie, sent automatically
    return this.http.get<AuthResponse>(CHECK_USER_URL, { withCredentials: true })
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)),
        catchError((error: any) => this.handleAuthError(error))
      );
  }
  

  // Login: POST
  loginUser(loginUserDto: LoginUserDto): Observable<string | null> {
    return this.http.post<AuthResponse>(LOGIN_URL, loginUserDto, { withCredentials: true })
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // Logout: POST
  logoutUser(): Observable<string | null> {
    return this.http.post<{ message: string }>(LOGOUT_URL, {}, { withCredentials: true })
      .pipe(
        map(() => {
          this._user.set(null);
          this._status.set(AuthStatus.notAuthenticated);
          return null;
        }),
        catchError((error: HttpErrorResponse) => {
          // Clear state even if request fails
          this._user.set(null);
          this._status.set(AuthStatus.notAuthenticated);
          return of(error.error?.message || 'Logout failed');
        })
      );
  }


  private handleAuthSuccess ({user} : AuthResponse): null {
    this._user.set(user);
    this._status.set(AuthStatus.authenticated);
    return null;
  }
  

  private handleAuthError(error: HttpErrorResponse): Observable<string> {
    // Clear state directly without HTTP request
    this._user.set(null);
    this._status.set(AuthStatus.notAuthenticated);
    return of(error.error.message);
  }
}
