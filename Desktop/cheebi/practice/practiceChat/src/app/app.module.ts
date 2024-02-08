import { NgModule } from '@angular/core';
import { BrowserModule ,HammerGestureConfig, HAMMER_GESTURE_CONFIG,HammerModule} from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule,HTTP_INTERCEPTORS} from "@angular/common/http";

import { AllTemplateUserComponent } from './FrontOffice/all-template-user/all-template-user.component';
import { HomeUserComponent } from './FrontOffice/home-user/home-user.component';
import { FooterUserComponent } from './FrontOffice/footer-user/footer-user.component';
import { HeaderUserComponent } from './FrontOffice/header-user/header-user.component';
import { SignINUserComponent } from './FrontOffice/sign-in-user/sign-in-user.component';
import { SignUPUserComponent } from './FrontOffice/sign-up-user/sign-up-user.component';
import { ProfilComponent } from './FrontOffice/profil/profil.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { ClientHomeComponent } from './FrontOffice/client-home/client-home.component';
import { ManagerHomeComponent } from './FrontOffice/manager-home/manager-home.component';
import { ReactiveFormsModule } from '@angular/forms'; // Add this import
import { CommonModule } from '@angular/common';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module } from 'ng-recaptcha';
import { environment } from '../environments/environment';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { GalleryComponent } from './FrontOffice/gallery/gallery.component';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { ModifyProfileComponent } from './FrontOffice/modify-profile/modify-profile.component';
import { CoverImageSettingsComponent } from './FrontOffice/cover-image-settings/cover-image-settings.component';
import {MatSliderModule} from '@angular/material/slider';
import { AuthInterceptor } from './interceptors/AuthInterceptor';
import { ConfirmationDialogComponent } from './FrontOffice/confirmation-dialog/confirmation-dialog.component';

export class MyHammerConfig extends HammerGestureConfig {
  override overrides = {
    pinch: { enable: true },
    rotate: { enable: true }
  };
}


@NgModule({
  declarations: [
    AppComponent,
    AllTemplateUserComponent,
    HomeUserComponent,
    FooterUserComponent,
    HeaderUserComponent,
    SignINUserComponent,
    SignUPUserComponent,
    ClientHomeComponent,
    ManagerHomeComponent,
    ProfilComponent,
    GalleryComponent,
    ModifyProfileComponent,
    CoverImageSettingsComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RecaptchaV3Module,
    MatSnackBarModule,
    MatButtonModule,
    BrowserAnimationsModule,
    NgbCarouselModule,
    NgxPaginationModule,
    HammerModule,
    MatSliderModule
  ],
  providers: [
    {
      provide: RECAPTCHA_V3_SITE_KEY,
      useValue: environment.recaptcha.siteKey,
    },
    { provide: MAT_SNACK_BAR_DATA, useValue: {} },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: MyHammerConfig
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
