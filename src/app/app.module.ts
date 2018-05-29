import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {RouterModule, Routes} from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UploadComponent } from './upload/upload.component';
import {FormsModule} from '@angular/forms';
import {FileUploadModule} from "ng2-file-upload";
import {UploadService} from "./services/upload.service";
import {HttpModule, JsonpModule} from "@angular/http";
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import { LeafeditComponent } from './leafedit/leafedit.component';
import { LoginComponent } from './login/login.component';
import {AuthGuard} from "./services/auth.guard";
import {AuthenticationService} from "./services/authentication.service";
import {UserService} from "./services/user.service";
import { SignupComponent } from './signup/signup.component';
import { ManageusersComponent } from './manageusers/manageusers.component';
import { PasswordComponent } from './password/password.component';
import {HashLocationStrategy, Location, LocationStrategy} from '@angular/common';

const appRoutes: Routes = [
  {path: '', component: DashboardComponent},
  {path: 'upload', component: UploadComponent, canActivate: [AuthGuard]},
  {path: 'manage', component: ManageusersComponent, canActivate: [AuthGuard]},
  {path: 'leafedit/:id', component: LeafeditComponent},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent},
  {path: 'password', component: PasswordComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
];
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UploadComponent,
    LeafeditComponent,
    LoginComponent,
    SignupComponent,
    ManageusersComponent,
    PasswordComponent,
  ],
  imports: [
    BrowserModule,
    FileUploadModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    InfiniteScrollModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [UploadService, AuthGuard,
    AuthenticationService,
    Location, {provide: LocationStrategy, useClass: HashLocationStrategy},
    UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
