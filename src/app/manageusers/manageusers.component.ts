import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent implements OnInit {
  newusers: any;
  existusers: any;
  all_users: any;
  search ='';
  constructor(private router:Router, private uploadService: UploadService){
    this.uploadService.getUsers('false').subscribe(res =>{
  		this.newusers = res;
  	});
  	this.uploadService.getUsers('accept').subscribe(res =>{
  		this.existusers = res;
      this.all_users = res;
  	});
   }
  approve(username, i, status){
  	var e = document.getElementsByClassName('type'+i)[0] as HTMLSelectElement;
  	var type = e.options[e.selectedIndex].value;
  	this.uploadService.approveUser(username, type, status).subscribe(res =>{
  	if(res === true)
      window.location.reload();
  	});
  }
  edit(i)
  {
    $('.edit').eq(i).addClass('hidden');
    $('.save').eq(i).removeClass('hidden');
  }
  save(i){
    $('.save').eq(i).addClass('hidden');
    $('.edit').eq(i).removeClass('hidden');
  }
  clearSearch()
  {
    this.search = "";
    this.searchUsers("");
  }
  searchUsers(value){
    if(value!="")
      this.existusers = this.all_users.filter(user => (user.username.toLowerCase().includes(value.toLowerCase())||user.name.toLowerCase().includes(value.toLowerCase())));
    else
      this.existusers = this.all_users;
  }
  ngOnInit() {

  }

}
