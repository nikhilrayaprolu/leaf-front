import { Component, OnInit } from '@angular/core';
import {FileUploader, FileSelectDirective, FileDropDirective} from 'ng2-file-upload';
import {UploadService} from '../services/upload.service';
import {Router} from '@angular/router';
import {server} from "../config";
const URL = server + '/api';
declare var $: any;
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {
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
  fillallfields = 0;
  autoresults: any;
  unknown = -1;
  imagePreview = 0;
  public uploader: FileUploader = new FileUploader({url: URL});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  public submitUpload() {
    this.leafvalues.createduser = JSON.parse(localStorage.getItem('currentUser')).username;
    if(this.leafvalues.scientificName == '' || this.leafvalues.commonName == '' || !this.leafvalues.pictureType || !this.leafvalues.pictureSeason || !this.leafvalues.AnnotationComplete){
      this.fillallfields = 1;
    } else {
      console.log(this.leafvalues);
      this.uploadService.startUploadJob(this.leafvalues).subscribe(res => {
        if(res && res.oneleafid){
          this.router.navigate(['/leafedit', res.oneleafid]);
    } else {
          this.router.navigate(['/'],{ queryParams: {present: 1, imageid: res.imageid, usertype: 'Global',level:'All', annotation:'All', disease:'All'}});
        }

      });
    }

  }
  public submitUnknownUpload() {
    this.leafvalues.createduser = JSON.parse(localStorage.getItem('currentUser')).username;
      console.log(this.leafvalues);
      this.uploadService.startUnknownUploadJob(this.leafvalues).subscribe(res => {
        if(res.success){
          this.router.navigate(['/unknown']);
        }

      });
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
  constructor(private uploadService: UploadService, private router: Router) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      console.log(response, responsePath);
      this.leafvalues.listofimages.push(responsePath);
      this.leafvalues.noreccoimages.push(responsePath);
    };
  }
  changeUnknown(value){
    this.unknown = value;
    console.log(this.unknown);
  }
  changeImagePreview(value)
  {
    this.imagePreview = value;
  }
  ngOnInit() {
  }

}
