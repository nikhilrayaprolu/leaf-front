import { Component, OnInit } from '@angular/core';
import {UploadService} from '../services/upload.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  family: any;
  showleaftypes = 0;

  items: any;
  presentitemcount = 0;
  presentid: any;
  totalnumberofavailablespecies = 0;
  totalannotatedspecies = 0;
  totalunannotatedspecies = 0;
  totaldieseasespecies = 0;
  dashboardstatistics = {
    familycount: 0,
    unannotated: 0,
    annotated: 0,
    diseased: 0,
    userleaves: 0,
  };
  userglobal = "Global";
  constructor(private uploadService: UploadService, private router: Router) {
    this.uploadService.getdashboardstats().subscribe(res => {
      this.dashboardstatistics.familycount = res.familycount;
      this.dashboardstatistics.unannotated = res.unannotated;
      this.dashboardstatistics.annotated = res.annotated;
      this.dashboardstatistics.diseased = res.diseased;
      this.dashboardstatistics.userleaves = res.userleaves;
    });
  }
  getAllFamily() {
    this.showleaftypes = 1;
    this.uploadService.getAllFamily().subscribe(res => {
      this.family = res;
    });
  }
  getAllUnAnnoted() {
    this.showleaftypes = 2;
    this.uploadService.getAllFamily().subscribe(res => {
      this.family = res;
    });
  }
  FamilyLeaves(id) {
    this.presentitemcount = 50;
    if (this.showleaftypes === 1) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Both', this.userglobal).subscribe(res => {
        this.items = res;
      });
    }
    if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Not', this.userglobal).subscribe(res => {
        this.items = res;
      });
    }

  }
  imageprofile(id) {
    this.router.navigate(['/leafedit', this.items[id]._id]);
  }
  onScroll () {
    if (this.showleaftypes === 1) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Both', this.userglobal ).subscribe(res => {
        this.items.push(res);
        this.presentitemcount += 50;
      });
    } else if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Not', this.userglobal).subscribe(res => {
        this.items.push(res);
        this.presentitemcount += 50;
      });
    }
  }

  ngOnInit() {
  }

}
