import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {server} from "../config";

@Injectable()
export class AuthenticationService {
  public token: string;
  public usertype: string;
  server = server;
  constructor(private http: Http) {
    // set token if saved in local storage

    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.token = currentUser && currentUser.token;
  }
  checkuserloggedin() {
    if (this.token) {
      return true;
    } else {
      return false;
    }
  }

  checkifadmin(){
    if(this.usertype == "admin")
      return true;
    else 
      return false;
  }
  checkifexpert(){
    if(this.usertype == "expert")
      return true;
    else 
      return false;
  }
  changePassword(username, password){
   return this.http.post(this.server + '/authentication/password',{ username: username, password: password }).map((response: Response) => {
   if(response.json().success === true)
    return true;
   else
    return false;
   });
  }
  login(username: string, password: string): Observable<boolean> {
    return this.http.post(this.server + '/authentication/authenticate',{ username: username, password: password })
      .map((response: Response) => {
        // login successful if there's a jwt token in the response
        let token = response.json() && response.json().token;
        var approved = response.json().approved;
        if (token && (approved =="accept")) {
          // set token property
          this.token = token;
          this.usertype = response.json().usertype;
          // store username and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentUser', JSON.stringify({ username: username, token: token, usertype: this.usertype }));

          // return true to indicate successful login
          return true;
        } else {
          // return false to indicate failed login
          return false;
        }
      });
  }

  logout(): void {
    console.log('called');
    // clear token remove user from local storage to log user out
    this.token = null;
    localStorage.removeItem('currentUser');
  }
}
