import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UploadService} from '../services/upload.service';
import {server} from "../config";
import {AuthenticationService} from "../services/authentication.service";
declare var anno: any;
@Component({
  selector: 'app-leafedit',
  templateUrl: './leafedit.component.html',
  styleUrls: ['./leafedit.component.css']
})
export class LeafeditComponent implements OnInit {
  server = server;
  image_path = server + '/final_uploads/';
  fallback_path = server + '/uploads/';
  leafid: number;
  leafdata: any;
  autoresults: any;
  leafvalues: any = {
    scientificName: '',
    commonName: '',
    pictureType: '',
    leafShape: '',
    leafMargin: '',
    leafDivision: '',
    pictureSeason: '',
    leafHealth: '',
    Disease: '',
    Description: '',
    AnnotationComplete: 'false',
    annotationtext: '',
    family: '',
    Utility: '',
    createduser: '',
    lastedituser: '',
    TaggingComplete: 'false'
  };
  presentedit = 0;
  constructor(private route: ActivatedRoute, private uploadservice: UploadService, private router: Router, private authentication: AuthenticationService) {

  }
  public deleteleaf() {
    this.uploadservice.deleteLeaf(this.leafid).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
  public checkuserloggedin() {
    return this.authentication.checkuserloggedin();
  }
  public editopen(num) {
    if (this.presentedit === num) {
      this.presentedit = 0;
    } else {
      this.presentedit = num;
    }
  }
  public submitUpload() {
    this.leafvalues.lastedituser = JSON.parse(localStorage.getItem('currentUser')).username;
    this.uploadservice.startUpdateJob(this.leafvalues).subscribe(res => {
      this.router.navigate(['/']);
    });
  }
  public searchscientificName($event) {
    this.uploadservice.getFamilyByScientificName(this.leafvalues.scientificName).subscribe(res => {
      this.autoresults = res;
    });
  }
  public searchcommonName($event) {
    this.uploadservice.getFamilyByCommonName(this.leafvalues.commonName).subscribe(res => {
      this.autoresults = res;


    });
  }

  public fillinfo(result) {
    this.leafvalues.scientificName = result.scientificName;
    this.leafvalues.commonName = result.commonName;
    this.leafvalues.leafShape = result.leafShape;
    this.leafvalues.leafMargin = result.leafMargin;
    this.leafvalues.leafDivision = result.leafDivision;
    this.leafvalues.Description = result.Description;


  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leafid = params['id'];
      this.uploadservice.getLeafById(this.leafid).subscribe(res => {
        this.leafvalues = res;
        this.leafvalues.AnnotationComplete = this.leafvalues.AnnotationComplete.toString();

      });
    });
    anno.makeAnnotatable(document.getElementById('blah'));
  }
  myFunction() {
    let ans = '';
    for (let i = 0;i < anno.getAnnotations().length; i++){
      ans=ans+ "{" + anno.getAnnotations()[i].text +  "," + anno.getAnnotations()[i].shapes["0"].geometry.height +","+anno.getAnnotations()[i].shapes["0"].geometry.width+","+anno.getAnnotations()[i].shapes["0"].geometry.x+","+anno.getAnnotations()[i].shapes["0"].geometry.y+ "},"
    }
    this.leafvalues.annotationtext = ans;
    console.log(anno.getAnnotations());
  }
  changeSource(event, name)
  {
    if(event.target.getAttribute('fallback') == undefined)
    {
      event.target.src = this.fallback_path + name;
      event.target.setAttribute("fallback", "true");
    }
  }
}
