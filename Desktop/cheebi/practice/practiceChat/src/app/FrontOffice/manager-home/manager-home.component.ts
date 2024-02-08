import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-manager-home',
  templateUrl: './manager-home.component.html',
  styleUrls: ['./manager-home.component.css']
})
export class ManagerHomeComponent implements OnInit {
  users: User[] = [];
  spec: string = '';
  sort: string = 'id,asc';
  pageNumber: number = 0;
  pageSize: number = 5;
  pageTotal: number = 0;
  role!:string;

  constructor(private userService: UserService,private authService: AuthService,private tokenService: TokenService, private router: Router) { }

  ngOnInit(): void {
    console.log("ngOnInit: getUsers()");
    this.getUsers();
  }
  getUsers() {

    if( this.authService.getIsAuthenticated()){
      const spec = encodeURIComponent(this.spec);
      const sort = encodeURIComponent(this.sort);
      const token = this.tokenService.getAccessToken();
      console.log("getUsers: spec =", spec, "sort =", sort);
      this.userService.getUsers(spec, sort).subscribe(response => {
        console.log("getUsers: response =", response);
        this.users = response;
      });
    }

  }

  onSpecChange() {
    this.sort = 'id,asc'; // réinitialisation du tri par défaut
    this.pageNumber = 0; // réinitialisation du numéro de page
    this.getUsers();
  }

  onSortChange(sort: string) {
    this.sort = sort;
    this.getUsers();
  }

  onPageChange(pageNumber: number) {
    this.pageNumber = pageNumber;
    this.getUsers();
  }

  get pages(): number[] {
    const pageCount = Math.ceil(this.users.length / this.pageSize);
    return Array.from(Array(pageCount), (_, i) => i);
  }

  get itemsToDisplay(): any[] {
    const startIndex = this.pageNumber * this.pageSize;
    return this.users.slice(startIndex, startIndex + this.pageSize);
  }

}
