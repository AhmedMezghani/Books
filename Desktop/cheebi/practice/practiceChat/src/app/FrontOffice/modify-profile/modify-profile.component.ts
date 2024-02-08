import { Component, OnInit } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { MatDialog,MatDialogRef  } from '@angular/material/dialog';

import { FormBuilder, FormGroup, Validators ,AbstractControl } from '@angular/forms';
import { CoverImageSettingsComponent } from '../cover-image-settings/cover-image-settings.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
import { UserInformation } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { CookieService } from 'src/app/services/cookie-service';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';
import { NotificationService } from 'src/app/services/notification.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { ChangeDetectorRef } from '@angular/core';
import { Ng2ImgMaxService } from 'ng2-img-max';

declare var require: any
@Component({
  selector: 'app-modify-profile',
  templateUrl: './modify-profile.component.html',
  styleUrls: ['./modify-profile.component.css']
})
export class ModifyProfileComponent implements OnInit {
  constructor(private fb: FormBuilder,
    public modalService: NgbModal,
    private route: ActivatedRoute,
    private userService : UserService,
    private cookieService: CookieService,
    private authService: AuthService,
    private tokenService: TokenService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
    ) { }
  userForm!: FormGroup;

user: {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  profilePicture?:string;
  photos ?: string[];
} = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  role: '',
  profilePicture:'',
  photos:[],

};
countryOptions: { value: string, label: string }[] = [];
phoneNumberUtil = PhoneNumberUtil.getInstance();
userInformation: UserInformation = {} as UserInformation;

  ngOnInit(): void {
    this.userInformation = this.cookieService.getDecryptedCookie('userInformation') as UserInformation ;
    if (!this.userInformation){this.authService.logout();}

    console.log(this.userInformation);
    this.fetchCountryCodes();
    this.initForm();
    this.setImageSrc();
  }
  initForm(): void {
    this.userForm = this.fb.group({
      //coverPhoto: [""],
      firstname: [this.userInformation.firstname, Validators.required],
      lastname: [this.userInformation.lastname, Validators.required],
      email: [this.userInformation.email, [Validators.required, Validators.email]],
      countryCode: [this.userInformation.countryCode], // Bind this to the validator function
      phone: [this.userInformation.phone, [ this.phoneValidator.bind(this)]], // Bind this to the validator function
      address: [this.userInformation.address],
      city: [this.userInformation.city],
      country: [this.userInformation.country],
      codePostal: [this.userInformation.codePostal],
      aboutme: [this.userInformation.aboutme],

    });
  }
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode(...new Uint8Array(buffer));
    return btoa(binary);
  }

  phoneValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const phoneNumber = control.value;
    const selectedCountryCodeControl = this.userForm?.get('countryCode');
    if (selectedCountryCodeControl && selectedCountryCodeControl.value!="" && selectedCountryCodeControl.value!=null) {
      const selectedCountryCode = selectedCountryCodeControl.value;
      if (phoneNumber!="" && !this.validatePhoneNumber(phoneNumber, selectedCountryCode)) {
        return { 'invalidPhone': true };
      }
      return null;
    }

    return null;
  }
  validatePhoneNumber(phoneNumber: string, countryCode: string): boolean {
    try {
      const parsedNumber = this.phoneNumberUtil.parseAndKeepRawInput(phoneNumber, countryCode);
      return this.phoneNumberUtil.isValidNumber(parsedNumber);
    } catch (e) {
      return false;
    }
  }
  fetchCountryCodes():void{
    const countryCodes = require('country-codes-list')
    const myCountryCodesObject: { [key: string]: string } = countryCodes.customList('countryCode', '{countryNameEn} (+{countryCallingCode})');
    console.log(myCountryCodesObject);
    this.countryOptions = Object.keys(myCountryCodesObject).map(key => {
      const country = myCountryCodesObject[key];
      return {
        value: key,
        label: country
      };
    });
  }

  uploadProfilePicture(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.user.profilePicture = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadPhotos(event: any): void {
    const files = event.target.files;
    if (files) {
      for (let i = 0; i < Math.min(files.length, 10); i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (!this.user.photos) {
            this.user.photos = [];
          }
          this.user.photos.push(e.target?.result as string);
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }





  imageUrl = 'assets/Images/man.png'; // Initial image URL
  openFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }
  previewImage(input: HTMLInputElement) {
    const file = input.files?.[0];

    if (file) {

      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Convert the base64 data URL to a byte array
        const byteString = atob(e.target.result.split(',')[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const uint8Array = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteString.length; i++) {
          uint8Array[i] = byteString.charCodeAt(i);
        }
        this.openModal(uint8Array);
      };
      reader.readAsDataURL(file);
    }
  }

  openModal(imageByteArray: Uint8Array) {
    const modalRef = this.modalService.open(CoverImageSettingsComponent);
    modalRef.componentInstance.imageByteArray = imageByteArray; // Pass the byte array
    modalRef.result.then(
      (result:Blob) => {
        if (result) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const resultImageSrc: string | null = reader.result as string;
            if (resultImageSrc) {
              debugger;
              this.imageSrc = resultImageSrc;
            } else {
              console.error('Error reading result image.');
            }
          };

          reader.readAsDataURL(result);
  /*
          const blob = new Blob([result], { type: 'image/png' });
          const reader = new FileReader();
          reader.onload = (event: any) => {
            this.imageSrc = event.target.result;
          };
          reader.readAsDataURL(blob);*/
        }
      },
      (error) => {
        // Handle the error here
        console.error('Error in modal result:', error);
      }
    );
  }
  base64ToUint8Array(base64String: string): Uint8Array {
    // Extract the base64 part
    const base64Part = base64String.split(';base64,')[1];

    // Decode the base64 string to binary string
    const binaryString = atob(base64Part);

    // Convert the binary string to Uint8Array
    const uint8Array = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      uint8Array[i] = binaryString.charCodeAt(i);
    }

    return uint8Array;
  }

  saveProfile(): void {
    if (this.userForm.valid) {
      const updatedUser = this.userForm.value as UserInformation;
      if (this.imageSrc){
        debugger;
        const base64String = this.imageSrc.split(',')[1];
        const binaryData = new Uint8Array(atob(base64String).split('').map(char => char.charCodeAt(0)));
        let updatedBase64String = '';
        for (let i = 0; i < binaryData.length; i++) {
          updatedBase64String += String.fromCharCode(binaryData[i]);
        }

        // Assign the updated base64 string to the user's coverPhoto
        updatedUser.coverPhoto = btoa(updatedBase64String);

        //updatedUser.coverPhoto=binaryData;

      }

      this.userService.updateUser(updatedUser).subscribe(
        (response) => {
          const { accessToken, refreshToken } = response;
          this.tokenService.setAccessToken(accessToken);
          this.tokenService.setRefreshToken(refreshToken);
          this.cookieService.deleteCookie('userInformation');
          this.cookieService.setEncryptedCookie('userInformation',updatedUser,60);
          this.notificationService.openSuccessSnackBar('User modified successfully',"Close",4000);
        },
        (error) => {
          this.notificationService.openFailureSnackBar('Error updating user information',"Close",4000);
          console.error('Error updating user:', error);
        }
      );
    }
  }
  imageSrc: string | null = null;

  setImageSrc(): void{
    const blobImage = localStorage.getItem("coverPhoto") ;
    if (blobImage) {
      this.imageSrc = `data:image/png;base64,${blobImage}`;
    } else {
      this.imageSrc = null;
    }
  }


  removeImage(event:Event):void {
    const modalRef = this.modalService.open(ConfirmationDialogComponent);
    event.stopPropagation();

  modalRef.result.then(
    (result) => {
      if (result) {
        this.imageSrc = null;
      }
    },
    (reason) => {
      // User dismissed the dialog (e.g., clicked "Cancel")
    }
  );
  }

}
