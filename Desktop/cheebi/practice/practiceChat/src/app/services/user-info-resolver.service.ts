// user-info-resolver.service.ts

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { UserInformation } from '../models/User';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root',
})
export class UserInfoResolver implements Resolve<UserInformation | null> {
  constructor(private userService: UserService) {}

  resolve(): Observable<UserInformation | null> {
    return this.userService.getUserInformation();
  }
}
