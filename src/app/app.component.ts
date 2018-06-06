import { Component } from '@angular/core';
import {AuthenticationService} from "./services/authentication.service";
import {UploadService} from "./services/upload.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  scores: any;
  constructor(private authenticationservice: AuthenticationService, private uploadservice: UploadService, private router: Router){

  }
  logout() {
    localStorage.removeItem('currentUser');
  }
  checkloggedin() {
    return this.authenticationservice.checkuserloggedin()
  }
  isPresent(value){
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser)
    {
        if(this.scores)
        {
          var userIndex = this.scores.map(function(e){return e.type; }).indexOf(currentUser.usertype);
          var valueIndex = this.scores.map(function(e){return e.type; }).indexOf('expert');
          if(this.scores[userIndex].score >= this.scores[valueIndex].score)
            return true;
          else
            return false;
        }
      }
    else
      return false;
  }
  speciesList(){
    var searchdata = {'present': 2, 'imageid': 0, usertype:'Global', level: 'All', annotation: 'false', disease: 'All', tagging: 'false'};

    this.router.navigate(['/dashboard'], {queryParams: searchdata});
  }
  ngOnInit(){
    this.uploadservice.getUserScores().subscribe(
    res => {this.scores = res; });
  }
}
