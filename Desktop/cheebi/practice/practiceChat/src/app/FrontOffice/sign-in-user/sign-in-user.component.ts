import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationRequest,User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'src/app/services/cookie-service';

import { UserInformation } from 'src/app/models/User';

@Component({
  selector: 'app-sign-in-user',
  templateUrl: './sign-in-user.component.html',
  styleUrls: ['./sign-in-user.component.css']
})

export class SignINUserComponent implements OnInit {
  authenticateRequest: {
    email: string;
    password: string;
  } = {
    email: '',
    password: ''
  };
  errorMessage: string = '';

  role!:string;
  constructor(private authService: AuthService,
    private userService: UserService,
    private cookieService : CookieService,
    private tokenService: TokenService,
    private router: Router) { }

  ngOnInit(): void {
  }
  onSubmit() {
    const request: AuthenticationRequest = { email: this.authenticateRequest.email, password: this.authenticateRequest.password };
    this.errorMessage = '';
    if (!this.isValidEmail()) {
      this.errorMessage = 'A valid Email is required ';
      return;
    }
    if (!this.isValidPassword()) {
      this.errorMessage = 'Email is required';
      return;
    }
    this.authService.authenticate(request).subscribe(
      response => {
        console.log(response);
        if (response) {
        const { accessToken, refreshToken } = response;
        this.tokenService.setAccessToken(accessToken);
        this.tokenService.setRefreshToken(refreshToken);
        const user: User = this.tokenService.decodeJwtToken(accessToken);
        this.userService.getUserInfo().subscribe(
          (data: UserInformation) => {
            console.log(data);
            console.log(typeof data.coverPhoto )
            if (data.coverPhoto){

const uint8Array = new Uint8Array([...atob(data.coverPhoto)].map(char => char.charCodeAt(0)));
              const coverPhotoArray: number[] = Array.from(uint8Array);

              const base64String: string = btoa(String.fromCharCode.apply(null, coverPhotoArray ));
              localStorage.setItem('coverPhoto', base64String);
              data.coverPhoto = "";

            }
            else {
              localStorage.setItem('coverPhoto', "");
            }

            this.cookieService.setEncryptedCookie('userInformation',data,60);
          },
          (error) => {
            console.error('Error fetching user information', error);
            // Handle error as needed
          }
        );
        this.navigateBasedOnUserRole(user);
        }
      },
      error => {
        console.error('Authentication error:', error);
        if (error.status === 401) {
          this.errorMessage = 'Invalid email or password.';
        } else {
          this.errorMessage = 'An error occurred during authentication.';
        }
      }
    );
  }
  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.authenticateRequest.email);
  }

  private isValidPassword(): boolean {
    const password = this.authenticateRequest.password;
    const isLengthValid = password.length >= 8 && password.length <= 15;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return isLengthValid && hasUppercase && hasLowercase && hasSpecialCharacter;
  }



  private navigateBasedOnUserRole(user: User): void {
    switch (user.role) {
      case 'USER':
        this.router.navigate(['client']);
        break;
      case 'MANAGER':
        this.router.navigate(['manager']);
        break;
      case 'ADMIN':
        this.router.navigate(['admin']);
        break;
      default:
        // Handle other roles or scenarios
        break;
    }
  }
}


