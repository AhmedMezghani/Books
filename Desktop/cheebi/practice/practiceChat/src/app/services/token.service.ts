import { Injectable } from '@angular/core';
import {AuthenticationRequest, AuthenticationResponse, User} from "../models/User";
import {Observable, tap} from "rxjs";
import { HttpClient ,HttpHeaders,HttpParams } from '@angular/common/http';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private URL =  'http://localhost:8075/api/v1/auth';
  private readonly tokenKey = 'Token';
  private readonly refreshTokenKey = 'RefreshToken';
  constructor(private http: HttpClient) { }


  decodeJwtToken(token: string): User {
    return JSON.parse(atob(token.split('.')[1]));
  }

  getUserRole(): string {
    const token = this.getAccessToken();
      if (token === null) {
        throw new Error('Token not found'); // or return some default value or handle the error as needed
      }
      else {
        const user: User = this.decodeJwtToken(token);
        return user.role;
      }
  }

   getAccessToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

   getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }
  setAccessToken(token:string): void {
    localStorage.setItem('Token', token);
  }
  setRefreshToken(refreshToken:string): void {
    localStorage.setItem('RefreshToken', refreshToken);
  }
  public isTokenValid(token: string): boolean {
    try {
      const decodedToken: any = jwtDecode(token);
      console.log(decodedToken);
      // Check if the token is expired
      const currentTime = Date.now() / 1000; // Convert to seconds
      return decodedToken.exp > currentTime;
    } catch (error) {
      // Handle decoding errors (e.g., invalid token format)
      console.error('Error decoding token:', error);
      return false;
    }
  }



}
