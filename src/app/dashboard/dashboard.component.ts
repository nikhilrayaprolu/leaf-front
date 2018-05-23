import { Component, OnInit } from '@angular/core';
import {UploadService} from '../services/upload.service';
import {ActivatedRoute, Router} from "@angular/router";
import {server} from "../config";
import {AuthenticationService} from "../services/authentication.service";
declare var anno: any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  family: any;
  showleaftypes = 0;
  server = server;
  image_path = server + '/final_uploads/';
  fallback_path = server + '/uploads/';
  items: any;
  presentitemcount = 50;
  presentid: any;
  totalnumberofavailablespecies = 0;
  totalannotatedspecies = 0;
  totalunannotatedspecies = 0;
  totaldieseasespecies = 0;
  presentleaf = -1;
  dashboardstatistics = {
    familycount: 0,
    unannotated: 0,
    annotated: 0,
    diseased: 0,
    userleaves: 0,
  };
  logged ="col-sm-6";
  annotationstate = 0;
  presentimageannotated = -1;
  presentedit = 1;
  all_families = [];
  search="";
  searchdata = {'present': 0, 'imageid': 0, usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All'};
  constructor(private uploadService: UploadService, private router: Router, private activatedroute: ActivatedRoute, private authentication: AuthenticationService) {
    this.activatedroute.queryParams.subscribe(query => {
      if(this.checkuserloggedin())
        this.logged = "col-sm-3";
      else
        this.logged = "col-sm-6";
      if (query['present']) {
        this.searchdata['present'] = query['present'];
        this.showleaftypes = parseInt(query['present']);
        this.uploadService.getAllFamily().subscribe(res => {
          this.family = res;
          this.all_families = res;
          if (query['imageid'])
          this.presentleaf = this.family.map(function(e){return e._id; }).indexOf(parseInt(query['imageid']));
        });
      } else {
        this.showleaftypes = 0;
        this.presentleaf = -1;
      }
      if (query['usertype']) {
        this.searchdata['usertype'] = query['usertype'];
      }
      if (query['imageid']) {
        this.searchdata['imageid'] = query['imageid'];
        if(this.showleaftypes === 1)
          this.FamilyLeaves(parseInt(query['imageid']));
      }
    });
      this.uploadService.getdashboardstats().subscribe(res => {
      this.dashboardstatistics.familycount = res.familycount;
      this.dashboardstatistics.unannotated = res.unannotated;
      this.dashboardstatistics.annotated = res.annotated;
      this.dashboardstatistics.diseased = res.diseased;
      this.dashboardstatistics.userleaves = res.userleaves;
    });
  }
  getAllFamily(num) {
    this.searchdata.present = num;
    this.showleaftypes = num;
    this.uploadService.getAllFamily().subscribe(res => {
      this.family = res;
      this.all_families=res;
    });
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
  }
  searchFamily(value){
    if(value!="")
    { 
      this.family = this.all_families.filter(family => (family.scientificName.toLowerCase().includes(value.toLowerCase())||family.commonName.toLowerCase().includes(value.toLowerCase())));
    }
    else
    {
      this.family = this.all_families;
    }
    if(this.family.length > 0)
    {
      this.presentleaf = this.family.map(function(e){return e._id; }).indexOf(this.family[0]._id);
      this.searchdata.imageid = this.family[0]._id;
      if (this.showleaftypes === 1) {
        this.uploadService.getLeavesOfFamily(this.family[0]._id, 0, 50, 'Not', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
          this.items = res;
        });
      }
    }
    else
      this.items = [];
}
  getAllUnAnnoted(num) {
    this.searchdata.present = num;
    this.showleaftypes = num;
    this.uploadService.getAllFamily().subscribe(res => {
      this.family = res;
    });
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
  }
  FamilyLeaves(id){
    //this.searchdata['usertype'] = this.userglobal;
    this.showleaftypes = 1;
    this.searchdata.present = 1;
    this.presentitemcount = 50;
    if(this.family)
    {
      this.presentleaf = this.family.map(function(e){return e._id; }).indexOf(id);
    }
    this.searchdata.imageid = id;
    if (this.showleaftypes === 1) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Both', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
        this.items = res;
      });
    }
    if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Not', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
        this.items = res;
      });
    }
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
  }
  imageprofile(id) {
    this.router.navigate(['/leafedit', this.items[id]._id]);
  }
  onScroll () {
    if (this.showleaftypes === 1) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Both', this.searchdata.usertype,this.searchdata.level, this.searchdata.annotation, this.searchdata.disease,this.searchdata.tagging ).subscribe(res => {

        this.items = this.items.concat(res);
        if(res.length > 49){
          this.presentitemcount += 50;
        }

      });
    } else if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Not', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
        this.items = this.items.concat(res);
        if(res.length > 49){
          this.presentitemcount += 50;
        }
      });
    }
  }
  annotateimage(i) {
    if (this.presentimageannotated != -1)
      this.savepresentannotation();
    anno.makeAnnotatable(document.getElementById('image'+ i));
    this.presentimageannotated = i;
  }

  myFunction(imgno) {
    let ans = '';
    for (let i = 0;i < anno.getAnnotations().length; i++){
      ans=ans+ "{" + anno.getAnnotations()[i].text +  "," + anno.getAnnotations()[i].shapes["0"].geometry.height +","+anno.getAnnotations()[i].shapes["0"].geometry.width+","+anno.getAnnotations()[i].shapes["0"].geometry.x+","+anno.getAnnotations()[i].shapes["0"].geometry.y+ "},"
    }
    document.getElementById("annotation"+imgno).innerHTML = ans;
    console.log(anno.getAnnotations());
  }
  savepresentannotation() {
    let annotationdata = {leafid :'', annotationvalue:'' };
    if(this.items.length)
      annotationdata.leafid = this.items[this.presentimageannotated]._id;
    let ans = '';
    for (let i = 0;i < anno.getAnnotations().length; i++){
      ans=ans+ "{" + anno.getAnnotations()[i].text +  "," + anno.getAnnotations()[i].shapes["0"].geometry.height +","+anno.getAnnotations()[i].shapes["0"].geometry.width+","+anno.getAnnotations()[i].shapes["0"].geometry.x+","+anno.getAnnotations()[i].shapes["0"].geometry.y+ "},"
    }
    annotationdata.annotationvalue = ans;
    this.presentimageannotated = -1;
    anno.destroy();
    this.uploadService.updateannotation(annotationdata).subscribe(res => {
      console.log(res);
    });

  }
  checkuserloggedin() {
    return this.authentication.checkuserloggedin()
  }
  editfamily() {
    this.presentedit = 0;
  }
  savefamily(family) {
    this.uploadService.updatefamily(this.family[this.presentleaf]).subscribe(res => {
    window.location.reload();
    });
    this.presentedit = 1;
  }
  deletefamily(){
    this.family[this.presentleaf].leaves.forEach(function(leaf)
    {
    console.log(leaf['_id']);
    });
  this.uploadService.deletefamily(this.family[this.presentleaf]).subscribe(res => {
    this.uploadService.getAllFamily().subscribe(res => {
    this.family = res;
    this.searchdata = {'present': 1, 'imageid': this.family[0]['_id'], usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All'}
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
    });
    });
  }
  changeSource(event, name)
  {
    if(event.target.getAttribute('fallback') == undefined)
    {
      event.target.src = this.fallback_path + name;
      event.target.setAttribute("fallback", "true");
    }
  }
    clearSearch()
  {
    this.search = "";
    this.searchFamily("");
  }
  ngOnInit() {
  }
}
