import { Component, OnInit } from '@angular/core';
import {UploadService} from '../services/upload.service';
import {ActivatedRoute, Router} from "@angular/router";
import {server} from "../config";
import {AuthenticationService} from "../services/authentication.service";
import { Chart } from 'chart.js';
declare var anno: any;
declare var jquery:any;
declare var $ :any;
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
  type = 1;
  presentitemcount = 50;
  presentid: any;
  totalnumberofavailablespecies = 0;
  totalannotatedspecies = 0;
  totalunannotatedspecies = 0;
  totaldieseasespecies = 0;
  presentleaf = -1;
  gotop = 0;
  dashboardstatistics = {
    familycount: 0,
    unannotated: 0,
    annotated: 0,
    diseased: 0,
    userleaves: 0,
    totalleaves: 0,
    leafday: 0,
    leafweek: 0,
    leafmonth: 0,
    leafyear: 0
  };
  logged ="col-sm-6";
  optionslogged ="col-md-4"
  annotationstate = 0;
  presentimageannotated = -1;
  presentedit = 1;
  all_families = [];
  search="";
  searchdata = {'present': 0, 'imageid': 0, usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All'};

  constructor(private uploadService: UploadService, private router: Router, private activatedroute: ActivatedRoute, private authentication: AuthenticationService) {
    this.activatedroute.queryParams.subscribe(query => {
      if(query['type'] != undefined)
        this.type = query['type'];
      if(this.checkuserloggedin())
        {
          this.logged = "col-sm-3";
          this.optionslogged ="col-md-2";
        }
      else
      {
        this.logged = "col-sm-6";
        this.optionslogged ="col-md-4";
      }
      if (query['present']) {
        this.searchdata['present'] = query['present'];
        this.showleaftypes = parseInt(query['present']);
        this.uploadService.getAllFamily().subscribe(res => {
          this.family = res;
          this.all_families = res;
          if (query['imageid'])
          { 
            var index = this.family.map(function(e){return e._id; }).indexOf(parseInt(query['imageid']));
            if(query['present'] == 1 && this.gotop)
            {
             var temp = this.family[0];
             this.family[0] = this.family[index];
             this.family[index] = temp;
             this.presentleaf = 0;
            } 
            else
              this.presentleaf = index;
         }
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
      this.dashboardstatistics.totalleaves = this.dashboardstatistics.unannotated + this.dashboardstatistics.annotated; 
      this.dashboardstatistics.diseased = res.diseased;
      this.dashboardstatistics.userleaves = res.userleaves;
      this.dashboardstatistics.leafday = res.leafday;
      this.dashboardstatistics.leafweek = res.leafweek;
      this.dashboardstatistics.leafmonth = res.leafmonth;
      this.dashboardstatistics.leafyear = res.leafyear;


    var canvas = <HTMLCanvasElement> document.getElementById('myChart1')
    var ctx =  canvas.getContext('2d');
    var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {
            labels: ['Species', 'Leaves', 'Unannotated Leaves', 'Annotated leaves', 'Diseased leaves', 'My leaves'],
            datasets: [{
                label: 'Quanitity',
                data: [this.dashboardstatistics.familycount, this.dashboardstatistics.totalleaves,this.dashboardstatistics.unannotated, this.dashboardstatistics.annotated, this.dashboardstatistics.diseased, this.dashboardstatistics.userleaves],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1,
                scaleFontColor: "#ff0000",
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: false
        }
    });

    var canvas2 = <HTMLCanvasElement> document.getElementById('myChart2');
    var ctx2 =  canvas2.getContext('2d');
    var myBarChart = new Chart(ctx2, {
    type: 'bar',
    data: {
            labels: ['Leaves last day', 'Leaves last week', 'Leaves last month', 'Leaves last year'],
            datasets: [{
                label: 'Quanitity',
                data: [this.dashboardstatistics.leafday, this.dashboardstatistics.leafweek, this.dashboardstatistics.leafmonth, this.dashboardstatistics.leafyear],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                ],
                borderColor: [
                    'rgba(255,99,132,1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                ],
                borderWidth: 1,
                scaleFontColor: "#ff0000",
            }]
        },
        options: {

            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero:true
                    }
                }]
            },
            responsive: false
        }
  });

    
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
      var index = this.family.map(function(e){return e._id; }).indexOf(this.family[0]._id);
      if(this.showleaftypes ==1)
      {     
            var temp = this.family[0];
            this.family[0] = this.family[index];
            this.family[index] = temp;
            this.presentleaf = 0;
      }
      else
      this.presentleaf = index;
      this.searchdata.imageid = this.family[0]._id;
      if (this.showleaftypes === 1) {
        this.uploadService.getLeavesOfFamily(this.family[0]._id, 0, 50, 'Not', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
        if(this.type == 1)
        this.items = res.slice(0,5);
        else
        this.items = res;
        });
      }
    }
    else
      this.items = [];
}
  setType(type)
  {
    this.type = type;
    if(type == 2)
      this.searchdata.tagging = 'false';
    else if(type == 3)
      this.searchdata.annotation = 'false';
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
      if(this.type == 1)
        this.items = res.slice(0,5);
      else
        this.items = res;
      });
    }
    if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Not', this.searchdata.usertype, this.searchdata.level, this.searchdata.annotation, this.searchdata.disease, this.searchdata.tagging).subscribe(res => {
        if(this.type == 1)
        this.items = res.slice(0,5);
      else
        this.items = res;
      });
    }
          console.log(this.items);
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
    var annotation = anno.getAnnotations();
    for (let i = 0;i < annotation.length; i++){
      if(annotation[i].text =="")
        annotation[i].text = "leaf";
      ans=ans+ "{" + annotation[i].text +  "," + annotation[i].shapes["0"].geometry.height +","+annotation[i].shapes["0"].geometry.width+","+annotation[i].shapes["0"].geometry.x+","+annotation[i].shapes["0"].geometry.y+ "},"
    }
    annotationdata.annotationvalue = ans;
    this.presentimageannotated = -1;
    anno.destroy();
    this.uploadService.updateannotation(annotationdata).subscribe(res => {
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
    var searchdata = {'present': 1, 'imageid': this.family[this.presentleaf]['_id'], usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All', 'type': this.type};
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
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
    var searchdata = {'present': 1, 'imageid': this.family[0]['_id'], usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All', 'type': this.type};
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
    });
    });
  }
  changeSource(event, name)
  {
    if(event.target.getAttribute('fallback') == undefined)
    {
      event.target.src = this.fallback_path + name;
      event.target.parentElement.href = this.fallback_path + name;
      event.target.setAttribute("fallback", "true");
    }
  }
  clearSearch()
  {
    this.search = "";
    this.searchFamily("");
  }
  highlight(i)
  {
    if(i == this.presentleaf)
      return "alert alert-success";
  }
  reset(){
    this.searchdata ={'present': 1, 'imageid': this.family[0]._id, usertype:'Global', level: 'All', annotation: 'All', disease: 'All', tagging: 'All'};
    this.router.navigate(['/dashboard'], {queryParams: this.searchdata});
  }
  getFontSize(value)
  {
    let styles = {'font-size': (value.length > 40)?'12px':((value.length > 30)?'13px':'15px')};
    return styles;
  }
  changeFirst(value){
    this.gotop = value;
  }
  ngOnInit() {
  $(document).ready(function(){
    $(this).scrollTop(0);
  }); 
  }
}
