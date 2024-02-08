import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AllTemplateUserComponent } from './FrontOffice/all-template-user/all-template-user.component';
import { HomeUserComponent } from './FrontOffice/home-user/home-user.component';
import { SignINUserComponent } from './FrontOffice/sign-in-user/sign-in-user.component';
import { SignUPUserComponent } from './FrontOffice/sign-up-user/sign-up-user.component';
import { ClientHomeComponent } from './FrontOffice/client-home/client-home.component';
import { ManagerHomeComponent } from './FrontOffice/manager-home/manager-home.component';
import { AuthGuard } from './Guards/auth.guard';
import { ProfilComponent } from './FrontOffice/profil/profil.component';
import { GalleryComponent } from './FrontOffice/gallery/gallery.component';
import { ModifyProfileComponent } from './FrontOffice/modify-profile/modify-profile.component';
import { UserInfoResolver } from './services/user-info-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: AllTemplateUserComponent,
    children: [
      { path: '', component: HomeUserComponent },
      { path: 'register', component: SignUPUserComponent,canActivate: [AuthGuard] },
      { path: 'login', component: SignINUserComponent ,canActivate: [AuthGuard]},
      { path: 'client', component: ClientHomeComponent, canActivate: [AuthGuard], data: { allowedRoles: ['USER'] } },
      { path: 'profile',
        component: ProfilComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['USER'] }

      },
      { path: 'manager', component: ManagerHomeComponent, canActivate: [AuthGuard], data: { allowedRoles: ['MANAGER'] } },
      { path: 'profile/modify',
        component: ModifyProfileComponent,
        canActivate: [AuthGuard],
        data: { allowedRoles: ['USER'] } ,
        resolve: { userInformation: UserInfoResolver },},

      { path: '**', redirectTo: '' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
