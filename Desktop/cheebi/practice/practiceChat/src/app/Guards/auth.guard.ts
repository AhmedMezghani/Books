// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService,private tokenService: TokenService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const isAuthenticated = this.authService.getIsAuthenticated();

    if (!isAuthenticated) {
      if (state.url.includes('/register') || state.url.includes('/login')) {
        return true;
      } else {
        this.router.navigate(['']);
        return false;
      }
    }

    const userRole = this.tokenService.getUserRole();

    if (route.data['allowedRoles']) {
      const allowedRoles: string[] = route.data['allowedRoles'];

      if (!allowedRoles.includes(userRole)) {
        return false;
      }
      return true;
    }

    return true;
  }
}
