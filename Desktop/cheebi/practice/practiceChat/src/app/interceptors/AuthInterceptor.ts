// auth.interceptor.ts

import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable, throwError, EMPTY } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (
      this.shouldExcludeRequest(request.url)
    ) {
      return next.handle(request);
    }
    const refreshToken = this.tokenService.getRefreshToken();
    const token = this.tokenService.getAccessToken();

    if (this.shouldHandleRefreshTokenRequest(request.url, refreshToken, token)) {
       return this.handleRefreshTokenRequest(request, refreshToken, token, next);
    }

    return this.handleAuthenticatedRequest(request, refreshToken, token, next);
  }

  private shouldExcludeRequest(url: string): boolean {
    return url.includes('/register') || url.includes('/authenticate');
  }

  private shouldHandleRefreshTokenRequest(
    url: string,
    refreshToken:string | null,
    token: string | null
  ): boolean {
    return url.includes('/refresh-token') && refreshToken !== null && token !== null;
  }

  private handleRefreshTokenRequest(
    request: HttpRequest<any>,
    refreshToken: string | null,
    token: string | null,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isValidRefreshToken = refreshToken && this.tokenService.isTokenValid(refreshToken);
    const isValidToken = token && this.tokenService.isTokenValid(token);
    if (isValidRefreshToken && !isValidToken) {
      request = this.addToken(request, refreshToken)
      return next.handle(request).pipe(
        catchError((refreshError) => {
          this.authService.logout();
          return throwError(refreshError);
        })
      );
    } else if (isValidRefreshToken && isValidToken) {
      return EMPTY;
    } else {
      this.authService.logout();
      return EMPTY;
    }
  }


  private handleAuthenticatedRequest(
    request: HttpRequest<any>,
    refreshToken: string | null,
    token: string | null,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const isValidRefreshToken = refreshToken && this.tokenService.isTokenValid(refreshToken);
    const isValidToken = token && this.tokenService.isTokenValid(token);

    if (isValidRefreshToken && isValidToken) {
      request = this.addToken(request, token!);
      return next.handle(request);
    } else if (isValidRefreshToken && !isValidToken) {
      return this.authService.refreshToken().pipe(
        switchMap((response: any) => {
          this.tokenService.setAccessToken(response.accessToken);
          return next.handle(this.addToken(request, response.accessToken));
        }),
        catchError((refreshError) => {
          this.authService.logout();
          return throwError(refreshError);
        })
      );
        } else {
      this.authService.logout();
      return EMPTY;
    }
  }

  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return request;
  }
}
