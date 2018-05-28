import { Injectable } from '@angular/core';
import {Http, Jsonp, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {server} from "../config";

@Injectable()
export class UploadService {
  server = server;
  uploadserver = this.server + '/upload';
  updateserver = this.server + '/update';
  userserver = this.server+'/allusers';
  approveserver = this.server+'/approve';
  familyscientificserver = this.server + '/familybyscientific';
  familycommonserver = this.server + '/familybycommon';
  familyallserver = this.server + '/getAllFamily';
  leavesoffamily = this.server + '/leavesoffamily';
  leafserver = this.server + '/leafbyid';
  deleteLeafServer = this.server + '/leafdelete';
  dashboardServer = this.server + '/dashboard';
  annotationserver = this.server + '/annotationupdate';
  updatefamilyserver = this.server + '/updatefamily';
  deletefamilyserver = this.server + '/deletefamily';
  signupserver = this.server + '/authentication/signup'
  constructor(
    private http: Http,
    private jsonp: Jsonp,
  ) { }


  private handleError (error: any) {
    // In some advance version we can include a remote logging of errors
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // Right now we are logging to console itself
    return Observable.throw(errMsg);
  }

  startUploadJob(uploadinfo) {
    console.log(uploadinfo);
      return this.http
        .post(this.uploadserver, uploadinfo).map(res => {
          return res.json();
      });
  }
  deleteLeaf(id) {
    return this.http
      .post(this.deleteLeafServer, {id: id}).map(res => {
        res.json();
      });
  }
  startUpdateJob(uploadinfo) {
    console.log(uploadinfo);
    return this.http
      .post(this.updateserver, uploadinfo).map(res => {
        res.json();
      });
  }
  getFamilyByScientificName(name) {
    return this.http
      .post(this.familyscientificserver, {name: name}).map(res => {
        return res.json();
      });
  }
  getFamilyByCommonName(name) {
    return this.http
      .post(this.familycommonserver, {name: name}).map(res => {
        return res.json();
      });
  }
  getAllFamily() {
    return this.http
      .get(this.familyallserver).map(res => {
        return res.json();
      });
  }
  getLeafById(id) {
    return this.http
      .post(this.leafserver, {id: id}).map(res => {
        return res.json();
      });
  }
  getLeavesOfFamily(id, presentcount, count, annoted, userglobal, level, annotation, disease, tagging) {
    if (!annoted) {
      annoted = false;
    }
    let username = '';
    if (JSON.parse(localStorage.getItem('currentUser'))){
      username = JSON.parse(localStorage.getItem('currentUser')).username;
    } else {
      username = 'guest';
    }
    return this.http
      .post(this.leavesoffamily, {id: id, presentcount: presentcount, count: count, annoted: annoted, username: username, userglobal: userglobal, level: level , annotation: annotation, disease: disease, tagging: tagging }).map(res => {
        return res.json();
      });
  }
  getdashboardstats() {
    let username = '';
    if (JSON.parse(localStorage.getItem('currentUser'))){
      username = JSON.parse(localStorage.getItem('currentUser')).username;
    } else {
      username = 'guest';
    }
    return this.http
      .post(this.dashboardServer, { username: username }).map(res => {
        return res.json();
      });
  }
  updatefamily(family) {
    return this.http
      .post(this.updatefamilyserver, family);
  }
  deletefamily(family) {
  return this.http
    .post(this.deletefamilyserver, family);
  }
  updateannotation(uploadinfo) {
        return this.http
      .post(this.annotationserver, uploadinfo).map(res => {
        res.json();
      });
  }
  signUp(username, password, name, email, affiliation){
    return this.http
      .post(this.signupserver, {username: username, password: password, name: name, email: email, affiliation: affiliation}).map(res => {
      return res.json().success;
      });
  }

  getUsers(approved)
  {
    return this.http
      .post(this.userserver, {approved: approved}).map(res => {
        return res.json();
      });
  }
  approveUser(username, type, approved)
  {
    return this.http
      .post(this.approveserver, {username:username, type: type, approved: approved}).map(res => {
        return res.json().success;
      });
  }
}
