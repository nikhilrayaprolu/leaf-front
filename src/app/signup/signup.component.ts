import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UploadService } from '../services/upload.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  model: any = {};
  loading = false;
  checkEmail = false;
  error = '';

  constructor(
    private router: Router,
    private uploadService: UploadService) { }

  ngOnInit() {
  }

  signUp() {
    this.loading = true;
    this.uploadService.signUp(this.model.username, this.model.password, this.model.name, this.model.email, this.model.affiliation)
      .subscribe(result => {
        if (result === true) {
          this.checkEmail = true;
          this.loading = false;
        } 
        else {
          this.error = 'Registration unsuccessful. Please try again with another username';
          this.loading = false;
        }
      });
  }
}
