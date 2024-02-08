import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders,HttpParams } from '@angular/common/http';
import {AuthenticationRequest, AuthenticationResponse, User} from "../models/User";
import {Observable,catchError,of, tap,throwError } from "rxjs";
import { TokenService } from './token.service';
import { CookieService } from './cookie-service';

import { Router } from '@angular/router';  // Import Router

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  private URL =  'http://localhost:8075/api/v1/auth';
  private readonly tokenKey = 'Token';
  private readonly refreshTokenKey = 'RefreshToken';


  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private cookieService: CookieService,
    private router: Router) {
    const storedAuthInfo = localStorage.getItem('authInfo');
    if (storedAuthInfo) {
      this.isAuthenticated = true;
    }
  }
  private isAuthenticated = false;

  getIsAuthenticated(): boolean {
    return this.isAuthenticated;
  }

  register(registerRequest: any) {
    return this.http.post<User>(`${this.URL}/register`, registerRequest);
  }

  //sans cookie
  authenticate(request: AuthenticationRequest): Observable<AuthenticationResponse |null> {
    return this.http.post<AuthenticationResponse>(`${this.URL}/authenticate`, request)
      .pipe(
        tap(response => {
          this.isAuthenticated = true;
          localStorage.setItem('authInfo', JSON.stringify({ isAuthenticated: true }));
        }),
        catchError(error => {
          console.error('Authentication failed:', error);
          return throwError(error);
        })
      );
  }

  logout() {

    this.isAuthenticated = false;
    localStorage.removeItem('authInfo');
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.cookieService.deleteCookie('userInformation');
    this.router.navigate(['/login']);  // Specify the path of your home page

  }








  refreshToken(): Observable<void> {
    const refreshToken = this.tokenService.getRefreshToken();
    if (!refreshToken) {
      return throwError('No refresh token available');
    }
    return this.http.post<void>(this.URL+'/refresh-token', { refreshToken }).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }


}
