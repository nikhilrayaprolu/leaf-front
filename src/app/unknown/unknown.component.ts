import { Component, OnInit } from '@angular/core';
import {UploadService} from '../services/upload.service';
import {server} from "../config";
import {Router} from '@angular/router';

declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-unknown',
  templateUrl: './unknown.component.html',
  styleUrls: ['./unknown.component.css']
})
export class UnknownComponent implements OnInit {
  server = server;
  image_path = server + '/final_uploads/';
  fallback_path = server + '/uploads/';
leafvalues: any = {
    scientificName: '',
    commonName: '',
    pictureType: 'Level0',
    leafShape: 'Ovate',
    leafMargin: 'Entire',
    leafDivision: 'Simple',
    pictureSeason: 'Spring',
    leafHealth: 'Good',
    Disease: '',
    Description: '',
    AnnotationComplete: 'false',
    Utility: '',
    location:'',
    listofimages: [],
    reccoimages: [],
    noreccoimages: [],
    annotationtext: '',
    family: '',
    createduser: '',
    lastedituser: '',
    TaggingComplete: 'false',
  };
  leaflist = [];
  fillallfields = 0;
  autoresults: any;  items: any;
  constructor(private uploadService: UploadService, private router: Router) { }
  changeSource(event, name)
  {
    if(event.target.getAttribute('fallback') == undefined)
    {
      event.target.src = this.fallback_path + name;
      event.target.parentElement.href = this.fallback_path + name;
      event.target.setAttribute("fallback", "true");
    }
  }
  addLeaf(value,i){
  	if($('.check'+i)[0].checked)
    {
  		this.leafvalues.listofimages.push([{filename: value}]);
      this.leaflist.push(value);
    }
  	else{
  	var index1 = this.leafvalues.listofimages.indexOf([{filename: value}]);
  	if (index1 !== -1) this.leafvalues.listofimages.splice(index1, 1);
    var index2 = this.leaflist.indexOf(value);
    if (index2 !== -1) this.leaflist.splice(index2, 1);
  	}
    console.log(this.leafvalues);
    }
  ngOnInit() {
  	this.items = this.uploadService.getAllUnknown().subscribe(res => {
          this.items = res;
          });
  }
  public submitUpload() {
    this.leafvalues.createduser = JSON.parse(localStorage.getItem('currentUser')).username;
    if(this.leafvalues.scientificName == '' || this.leafvalues.commonName == '' || !this.leafvalues.pictureType || !this.leafvalues.pictureSeason || !this.leafvalues.AnnotationComplete){
      this.fillallfields = 1;
    } else {
      console.log(this.leafvalues);
      this.uploadService.startUploadJob(this.leafvalues).subscribe(res => {
        if(res){
          console.log('Onwards to deletion');
          this.uploadService.deleteUnknown(this.leaflist).subscribe(res => {  
          }); 
        window.location.reload();
      } 
      });
    }

  }
public searchscientificName($event) {
    this.uploadService.getFamilyByScientificName(this.leafvalues.scientificName).subscribe(res => {
      this.autoresults = res;
    });
  }
  public searchcommonName($event) {
    this.uploadService.getFamilyByCommonName(this.leafvalues.commonName).subscribe(res => {
        this.autoresults = res;

    });
  }
  public fillinfo(result) {
    this.leafvalues.scientificName = result.scientificName;
    this.leafvalues.family = result.family;
    this.leafvalues.Utility = result.Utility;
    this.leafvalues.commonName = result.commonName;
    this.leafvalues.leafShape = result.leafShape;
    this.leafvalues.leafMargin = result.leafMargin;
    this.leafvalues.leafDivision = result.leafDivision;
    this.leafvalues.location = result.location;
    this.leafvalues.Description = result.Description;
  }
}
