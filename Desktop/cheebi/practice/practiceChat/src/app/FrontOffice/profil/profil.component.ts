import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { FormBuilder, FormGroup, Validators ,AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { UserInformation } from 'src/app/models/User';
import { Router } from '@angular/router';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'src/app/services/cookie-service';
import { AuthService } from 'src/app/services/auth.service';

declare var require: any


@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent implements OnInit {

  userInformation: UserInformation = {} as UserInformation;
  profileImageSrc: string = 'assets/Images/man.png'; // Default image source


  constructor(private userService:UserService,
    private router:Router,
    private cookieService: CookieService,
    private authService: AuthService

    ) { }
  ngOnInit(): void {
    this.userInformation = this.cookieService.getDecryptedCookie('userInformation') as UserInformation ;
    if (!this.userInformation){this.authService.logout();}
    this.loadProfileImage();

  }
  private loadProfileImage(): void {
    /**if (this.userInformation.coverPhoto) {
      this.profileImageSrc = URL.createObjectURL(this.userInformation.coverPhoto);
    }*/
  }

  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }



  encryptAndSetUserInformation(userInfo: UserInformation): String {
    const userInfoString = JSON.stringify(userInfo);
    const encryptionKey = 'YOUR_ENCRYPTION_KEY';
    const encryptedData = CryptoJS.AES.encrypt(userInfoString, encryptionKey).toString();
    return encryptedData;
  }

}
