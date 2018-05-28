import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  checkSuccess = false;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService) { }

  ngOnInit() {
  }

  changePassword() {
    this.loading = true;
    this.authenticationService.changePassword(JSON.parse(localStorage.getItem('currentUser')).username, this.model.password)
      .subscribe(result => {
        if (result === true) {
        	this.checkSuccess = true;
        	this.loading = false;
        } else {
          this.error = 'Password has not been changed. Please try again!';
          this.loading = false;
        }
      });
  }
}
