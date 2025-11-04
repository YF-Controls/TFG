import { computed, inject, Injectable, signal } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of, tap } from "rxjs";

import { environment } from "../../../environments/environment";
import { User, AuthResponse } from "../interfaces";


type AuthStatus = 'checking' | 'authenticated' | 'not-authenticated';
const baseUrl = environment.baseUrl;
const LOGIN_URL: string = `${baseUrl}/auth/login`;
const REGISTER_URL: string = `${baseUrl}/auth/register`;
const CHECK_STATUS_URL: string = `${baseUrl}/auth/check-status`;

@Injectable({providedIn: 'root'})
export class AuthService {
  
  // Private attributes/properties
  private _user = signal<User | null>(null);
  private _token = signal<string | null>(localStorage.getItem('token'));
  private _authStatus = signal<AuthStatus>('checking');
  
  private http = inject(HttpClient);

  // Public attributes/properties
  checkStatusResource = rxResource<boolean, null>({
    stream: () => this.checkStatus(),
    defaultValue: false,
  });
  
  // Constructor

  // Getters/Setters
  authStatus = computed<AuthStatus>(() => {
    if (this._authStatus() === 'checking') return 'checking';
    if (this._user()) return 'authenticated';
    return 'not-authenticated';
  });

  user = computed<User | null>(() => this._user());
  token = computed<string | null>(() => this._token());

  /**************************************
    Methods 
  ***************************************/

  // Http request POST
  login(email: string, password: string): Observable<boolean> {
    
    const body = {email, password}; // {email: xxx, password: xxx}
    
    return this.http.post<AuthResponse>(LOGIN_URL, body)
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // Http request POST
  register(email: string, fullname: string, password: string): Observable<boolean> {
    
    const body = {email, fullname, password};
    
    return this.http.post<AuthResponse>(REGISTER_URL, body)
      .pipe(
        map((authResponse: AuthResponse) => this.handleAuthSuccess(authResponse)), // Return true
        catchError((error: any) => this.handleAuthError(error)) // Return false
      );
  }
  
  // Http request GET
  checkStatus(): Observable<boolean> {
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      this.logout();
      return of(false);
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

  logout () {
    localStorage.removeItem('token');
    this._token.set(null);
    this._user.set(null);
    this._authStatus.set('not-authenticated');
  }

  private handleAuthSuccess ({user, token} : AuthResponse): boolean {
    this._user.set(user);
    this._token.set(token);
    localStorage.setItem('token', token);
    this._authStatus.set('authenticated');
    return true;
  }

  private handleAuthError(error: any): Observable<boolean> {
    this.logout();
    return of(false);
  }
}
