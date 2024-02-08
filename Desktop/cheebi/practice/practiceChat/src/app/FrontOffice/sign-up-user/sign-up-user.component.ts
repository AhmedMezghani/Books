import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { trigger, transition, style, animate } from '@angular/animations';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up-user',
  templateUrl: './sign-up-user.component.html',
  styleUrls: ['./sign-up-user.component.css'],
  providers: [{ provide: MAT_SNACK_BAR_DATA, useValue: {} }],

})
export class SignUPUserComponent implements OnInit {
  registerRequest: {
    firstname: string;
    lastname: string;
    email: string;
    password: string;
    role: string;
    recaptchaToken:string;
    status:string;

  } = {
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    role: '',
    recaptchaToken:'',
    status:'ACTIVE'

  };
  successMessage: string = '';
  roles: string[] = ['ADMIN', 'MANAGER', 'USER'];
  errorMessage: string = '';
  passwordrecheck: string = ''; // Declare passwordrecheck variable
  recaptchSiteKey:string='6Ld6tlwpAAAAAMJ2yM0M_htOftsgRXzXkgVFDwQN';
  constructor(
    private authService: AuthService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private notificationService: NotificationService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  ngOnInit(): void {
  }

  register() {

    this.errorMessage = ''; // Clear previous error messages
    if (!this.isValidFirstname()) {
      this.errorMessage = 'First name is required and should not contain special characters';
      return;
    }
    if (!this.isValidEmail()) {
      this.errorMessage = 'Invalid email format';
      return;
    }

    /*if (!this.isValidPassword()) {
      this.errorMessage = 'Invalid password format';
      return;
    }*/

    if (!this.isValidRole()) {
      this.errorMessage = 'Role not selected';
      return;
    }
    /*if(this.passwordrecheck !== this.registerRequest.password){
      this.errorMessage = 'Invalid Password';
      return;
    }*/
    this.recaptchaV3Service.execute("importantAction").subscribe((token) => {
        this.registerRequest.recaptchaToken = token;
        this.authService.register(this.registerRequest).subscribe(
          response => {
            console.log(response);
            this.successMessage = 'Le compte a été créé avec succès !';
            this.notificationService.openSuccessSnackBar('User created successfully',"Close",4000);

            this.router.navigate(['login']);
          },
          error => {
            console.error(error);
            if (error.status === 409) {
              this.errorMessage = 'L\'adresse e-mail existe déjà. Veuillez utiliser une autre adresse e-mail.';
              this.notificationService.openFailureSnackBar('Email already exists. Please use another email.',"Close",4000);

            } else {
              this.errorMessage = 'Une erreur s\'est produite lors de la création du compte.';
              this.notificationService.openFailureSnackBar("Une erreur s\'est produite lors de la création du compte","Close",4000);
            }
          }
        );
    });
  }
  private isValidEmail(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.registerRequest.email);
  }

  private isValidPassword(): boolean {
    const password = this.registerRequest.password;
    const isLengthValid = password.length >= 8 && password.length <= 15;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasSpecialCharacter = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return isLengthValid && hasUppercase && hasLowercase && hasSpecialCharacter;
  }

  private isValidRole(): boolean {
    return this.registerRequest.role !== '';
  }
  isValidFirstname(): boolean {
    const firstnameRegex = /^[a-zA-Z ]+$/;
    return this.registerRequest.firstname.trim() !== '' && firstnameRegex.test(this.registerRequest.firstname);
  }
  isValidLastname(): boolean {
    const lastnameRegex = /^[a-zA-Z ]+$/;
    return this.registerRequest.lastname.trim() !== '' && lastnameRegex.test(this.registerRequest.lastname);
  }
  isInvalidField(fieldName: string): boolean {
    switch (fieldName) {
      case 'firstname':
        return !this.isValidFirstname();
      case 'lastname':
        return !this.isValidLastname();
      case 'role':
        return !this.isValidRole();
      case 'email':
        return !this.isValidEmail();
      case 'password':
        return !this.isValidPassword();
      // Add more cases for other fields if needed
      default:
        return false; // Default to false if the field name is not recognized
    }
  }
  isInvalidPasswordRecheck(): boolean {
    //return this.passwordrecheck !== this.registerRequest.password;
    return true;
  }
  preventPaste(event: ClipboardEvent): void {
    event.preventDefault();
  }
  handleCaptchaResolved(response: string): void {
    console.log('reCAPTCHA Resolved:', response);
    // You can use the reCAPTCHA response as needed (e.g., send it to the server during registration).
  }


}
