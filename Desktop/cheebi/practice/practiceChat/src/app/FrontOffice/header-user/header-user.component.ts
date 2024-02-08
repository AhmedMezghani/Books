import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-header-user',
  templateUrl: './header-user.component.html',
  styleUrls: ['./header-user.component.css']
})
export class HeaderUserComponent implements OnInit {

  constructor(private authService: AuthService,
    private tokenService: TokenService) { }

  ngOnInit(): void {
  }
  get isAuthenticated(): boolean {
    const isAuthenticated = this.authService.getIsAuthenticated();
    return isAuthenticated;
  }
  get getUserRole(): String {
    const userRole = this.tokenService.getUserRole();
    return userRole;
  }
  onLogout(): void {
    this.authService.logout();
  }
}
