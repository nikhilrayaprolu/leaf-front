import { Injectable } from '@angular/core';
import {Http, Jsonp, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {server} from "../config";

@Injectable()
export class UploadService {
  server = server;
  uploadserver = this.server + '/upload';
  updateserver = this.server + '/update'
  unknownserver = this.server + '/unknownleaf';
  getunknownserver = this.server + '/getallunknown';
  userserver = this.server+'/allusers';
  approveserver = this.server+'/approve';
  bulkapproveserver = this.server + '/bulkapprove';
  familyscientificserver = this.server + '/familybyscientific';
  familycommonserver = this.server + '/familybycommon';
  familyallserver = this.server + '/getAllFamily';
  familyidserver = this.server + '/familybyid'
  leavesoffamily = this.server + '/leavesoffamily';
  leafserver = this.server + '/leafbyid';
  deleteLeafServer = this.server + '/leafdelete';
  dashboardServer = this.server + '/dashboard';
  annotationserver = this.server + '/annotationupdate';
  updatefamilyserver = this.server + '/updatefamily';
  deletefamilyserver = this.server + '/deletefamily';
  deleteunknownserver = this.server + '/deleteunknown'
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
  startUnknownUploadJob(uploadinfo) {
    console.log(uploadinfo);
      return this.http
        .post(this.unknownserver, uploadinfo).map(res => {
          return res.json();
      });
  }
  deleteLeaf(id) {
    return this.http
      .post(this.deleteLeafServer, {id: id});
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
  getFamilyById(id) {
    return this.http
      .post(this.familyidserver, {id: id}).map(res => {
        return res.json();
      });
  }
  getAllFamily() {
    return this.http
      .get(this.familyallserver).map(res => {
        return res.json();
      });
  }
  getAllUnknown() {
    return this.http
      .get(this.getunknownserver).map(res => {
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
  deleteUnknown(unknowns) {
  return this.http
    .post(this.deleteunknownserver, {unknowns: unknowns});
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

  getUserScores(){
    return this.http.get(this.server + '/userscore').map(res => {
        return res.json();
      });
  }
  getUnapprovedUploads(){
    return this.http.get(this.server + '/unapproved').map(res => {
        return res.json();
      });
  }
  approveUpload(id){
        var user = JSON.parse(localStorage.getItem('currentUser')).username;
        console.log(user);
    return this.http.post(this.server + '/approveupload', {id:id, user: user}).map(res => {
        return res.json();
      });
  }
  approveBulkUpload(leaves){
        var user = JSON.parse(localStorage.getItem('currentUser')).username;
        console.log(user);
    return this.http.post(this.server + '/bulkapprove', {leaves:leaves, user: user}).map(res => {
        return res.json();
      });
  }
}
