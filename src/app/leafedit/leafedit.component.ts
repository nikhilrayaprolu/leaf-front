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
  family: any;
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
    location: '',
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
    this.uploadservice.getAllFamily().subscribe(res => {
      this.family = res;
      this.family = this.family.filter(family => (family.scientificName == this.leafvalues.scientificName));
      var searchdata = {'present': 1, 'imageid': this.family[0]._id, usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'false', 'type': 2};
      this.router.navigate(['/dashboard'], {queryParams: searchdata});
    });
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
    console.log('After submitting');
    this.leafvalues.lastedituser = JSON.parse(localStorage.getItem('currentUser')).username;
    console.log(this.leafvalues);
    this.uploadservice.getAllFamily().subscribe(res => {
      this.family = res;
      this.uploadservice.startUpdateJob(this.leafvalues).subscribe(res => {
      this.family = this.family.filter(family => (family.scientificName == this.leafvalues.scientificName));
      var searchdata = {'present': 1, 'imageid': this.family[0]._id, usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'false', 'type': 2};
      this.router.navigate(['/dashboard'], {queryParams: searchdata});
    });
    });
    this.presentedit = 1;
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
    this.leafvalues.location = result.location;
  }
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.leafid = params['id'];
      this.uploadservice.getLeafById(this.leafid).subscribe(res => {
        this.leafvalues = res;
        console.log('Upon loading');
        console.log(this.leafvalues);
        console.log(this.leafvalues.TaggingComplete);
        this.leafvalues.AnnotationComplete = this.leafvalues.AnnotationComplete.toString();

      });
    });
    if(this.checkuserloggedin())
    anno.makeAnnotatable(document.getElementById('blah'));
  }
  myFunction() {
    let ans = '';
    var annotation = anno.getAnnotations();
    for (let i = 0;i < annotation.length; i++){
      if(annotation[i].text =="")
        annotation[i].text = "leaf";
      ans=ans+ "{" + annotation[i].text +  "," + annotation[i].shapes["0"].geometry.height +","+annotation[i].shapes["0"].geometry.width+","+annotation[i].shapes["0"].geometry.x+","+annotation[i].shapes["0"].geometry.y+ "},"
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
