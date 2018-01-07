import { Injectable } from '@angular/core';
import {Http, Jsonp, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class UploadService {
  server = 'http://localhost:3002';
  uploadserver = this.server + '/upload';
  updateserver = this.server + '/update';
  familyscientificserver = this.server + '/familybyscientific';
  familycommonserver = this.server + '/familybycommon';
  familyallserver = this.server + '/getAllFamily';
  leavesoffamily = this.server + '/leavesoffamily';
  leafserver = this.server + '/leafbyid';
  deleteLeafServer = this.server + '/leafdelete';
  dashboardServer = this.server + '/dashboard';
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
          res.json();
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
  getLeavesOfFamily(id, presentcount, count, annoted, userglobal) {
    if (!annoted) {
      annoted = false;
    }
    return this.http
      .post(this.leavesoffamily, {id: id, presentcount: presentcount, count: count, annoted: annoted, username: JSON.parse(localStorage.getItem('currentUser')).username, userglobal: userglobal }).map(res => {
        return res.json();
      });
  }
  getdashboardstats() {
    return this.http
      .post(this.dashboardServer, { username: JSON.parse(localStorage.getItem('currentUser')).username }).map(res => {
        return res.json();
      });
  }
}
