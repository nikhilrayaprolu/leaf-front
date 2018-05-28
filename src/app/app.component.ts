import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(private authenticationservice: AuthenticationService, private router: Router){

  }
  logout() {
    console.log('Hey');
    localStorage.removeItem('currentUser');
  }
  checkloggedin() {
    return this.authenticationservice.checkuserloggedin()
  }
  checkifadmin(){
      return this.authenticationservice.checkifadmin()
  }
  speciesList(){
    var searchdata = {'present': 2, 'imageid': 0, usertype:'Global', level: 'All', annotation: 'false', disease: 'All', tagging: 'false'};

    this.router.navigate(['/dashboard'], {queryParams: searchdata});
  }
}
