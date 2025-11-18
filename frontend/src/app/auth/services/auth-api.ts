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



type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;
const LOGIN_URL: string = `${baseUrl}/auth/login`;
const REGISTER_URL: string = `${baseUrl}/auth/register`;
const USERS_URL: string = `${baseUrl}/auth/users`;
const CHECK_STATUS_URL: string = `${baseUrl}/auth/check-status`;

@Injectable({providedIn: 'root'})
export class AuthApi {
  
  // Private attributes/properties
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _authStatus = signal<AuthStatus>('checking');
  
  private http = inject(HttpClient);

  // Properties
  checkStatusResource = rxResource<string | null, null>({
    stream: () => this.checkUserStatus(),
    defaultValue: "Error",
  });
  
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());
  isAdmin = computed<boolean>(() => this._user()?.roles.includes(ValidRoles.admin) ?? false);
  isUser = computed<boolean>(() => this._user()?.roles.includes(ValidRoles.user) ?? false);
  
  // Methods
  // Http request POST
  registerUser(registerUserDto: RegisterUserDto): Observable<string | null> {
    
    return this.http.post<AuthResponse>(REGISTER_URL, registerUserDto)
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }

  // Http request POST
  loginUser(loginUserDto: LoginUserDto): Observable<string | null> {
    
    return this.http.post<AuthResponse>(LOGIN_URL, loginUserDto)
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // Http request PATCH
  updateUser(id: string, updateUserDto: UpdateUserDto): Observable<string | null> {
    return this.http.patch<AuthResponse>(`${USERS_URL}/${id}`, updateUserDto)
      .pipe(
        map((authResponse: AuthResponse) => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error updating user'))
      );
  }
  
  // Http request DELETE
  deleteUser(id: string): Observable<string | null> {
    return this.http.delete<void>(`${USERS_URL}/${id}`)
      .pipe(
        map(() => null),
        catchError((error: HttpErrorResponse) => of(error.error.message || 'Error deleting user'))
      );
  }

  // Http request GET
  getUsers(queryParamsDto: QueryParamsDto): Observable<User[]> {
    const {limit = 10, offset = 0, withInactives = false, orderBy = 'id', orderDirection = OrderDirection.ASC} = queryParamsDto;
    return this.http.get<User[]>(USERS_URL, {params : {limit, offset, withInactives, orderBy, orderDirection}});
  }
  
  // Http request GET
  checkUserStatus(): Observable<string | null> {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.logoutUser();
      return of('Not valid credentials');
    }
    
    // Done with interceptors!
    //const options = {
    //  headers: {Authorization: `Bearer ${token}`}
    //};
    
    return this.http.get<AuthResponse>(CHECK_STATUS_URL) // , options)
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // No Http
  logoutUser () {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');
  }

  private handleAuthSuccess ({user, token} : AuthResponse): null {
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    this._authStatus.set('authenticated');
    return null;
  }

  private handleAuthError(error: HttpErrorResponse): Observable<string> {
    this.logoutUser();
    return of(error.error.message);
  }
}
