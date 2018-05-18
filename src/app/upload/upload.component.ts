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
    listofimages: [],
    annotationtext: '',
    family: '',
    createduser: '',
    lastedituser: '',
    TaggingComplete: 'false',
  };
  fillallfields = 0;
  autoresults: any;
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
      this.uploadService.startUploadJob(this.leafvalues).subscribe(res => {
        if(res && res.oneleafid){
          this.router.navigate(['/leafedit', res.oneleafid]);
    } else {
          this.router.navigate(['/'],{ queryParams: {present: 1, imageid: res.imageid, usertype: 'Global',level:'All', annotation:'All', disease:'All'}});
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
    this.leafvalues.commonName = result.commonName;
    this.leafvalues.leafShape = result.leafShape;
    this.leafvalues.leafMargin = result.leafMargin;
    this.leafvalues.leafDivision = result.leafDivision;
    this.leafvalues.Description = result.Description;


  }
  constructor(private uploadService: UploadService, private router: Router) {
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      const responsePath = JSON.parse(response);
      console.log(response, responsePath);
      this.leafvalues.listofimages.push(responsePath);
    };
  }

  ngOnInit() {
  }

}
