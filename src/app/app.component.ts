import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  logout() {
    localStorage.removeItem('currentUser');
  }
  checkloggedin() {
    return this.authenticationservice.checkuserloggedin()
  }
  constructor(private authenticationservice: AuthenticationService){

  }
}
