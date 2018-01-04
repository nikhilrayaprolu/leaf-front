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
  constructor(private uploadService: UploadService, private router: Router) { }
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
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Both').subscribe(res => {
        this.items = res;
      });
    }
    if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(id, 0, 50, 'Not').subscribe(res => {
        this.items = res;
      });
    }

  }
  imageprofile(id) {
    this.router.navigate(['/leafedit', this.items[id]._id]);
  }
  onScroll () {
    if (this.showleaftypes === 1) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Both').subscribe(res => {
        this.items.push(res);
        this.presentitemcount += 50;
      });
    } else if (this.showleaftypes === 2) {
      this.uploadService.getLeavesOfFamily(this.presentid, this.presentitemcount, 50, 'Not').subscribe(res => {
        this.items.push(res);
        this.presentitemcount += 50;
      });
    }
  }

  ngOnInit() {
  }

}
