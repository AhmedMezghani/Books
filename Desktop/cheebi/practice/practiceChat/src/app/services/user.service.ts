import { Injectable } from '@angular/core';
import {AuthenticationRequest, AuthenticationResponse, User} from "../models/User";
import {Observable, tap} from "rxjs";
import { HttpClient ,HttpHeaders,HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { UserInformation } from '../models/User';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private URL =  'http://localhost:8075/api/v1/users';
  private userInformationSubject = new BehaviorSubject<UserInformation | null>(null);

  constructor(private http: HttpClient) { }



  getUsers(spec: string, sort: string): Observable<User[]> {

    const sort2 = 'id,asc';
    const params = new HttpParams()
      .set('sort', sort2);
    return this.http.get<User[]>(this.URL+"/recherche-avancee", { params:params});
  }
  getUserInfo(): Observable<any> {
    return this.http.get<any>(`${this.URL}/user-info`);
  }




  setUserInformation(userInformation: UserInformation): void {
    this.userInformationSubject.next(userInformation);
  }

  getUserInformation(): BehaviorSubject<UserInformation | null> {
    return this.userInformationSubject;
  }


  updateUser(updatedUser: UserInformation): Observable<any> {
    const url = `${this.URL}/update`;
    const aaa= new Uint8Array([1,2]);
    //updatedUser.coverPhoto=aaa;
    return this.http.put(url, updatedUser);
  }

}
