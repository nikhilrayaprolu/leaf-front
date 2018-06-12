import { Component, OnInit } from '@angular/core';
import { UploadService } from '../services/upload.service';
import { Router } from '@angular/router';
import {server} from "../config";
declare var jquery:any;
declare var $ :any;

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent implements OnInit {
  server = server;
  image_path = server + '/final_uploads/';
  fallback_path = server + '/uploads/';
  approvesignup = true;
  approveupload = false;
  changeuser = false;
  viewlog = false;
  newusers: any;
  existusers: any;
  all_users: any;
  scores: any;
  items: any;
  search ='';
  leaflist = [];
  constructor(private router:Router, private uploadService: UploadService){
    this.uploadService.getUsers('false').subscribe(res =>{
  		this.newusers = res;
  	});
  	this.uploadService.getUsers('accept').subscribe(res =>{
  		this.existusers = res;
      this.all_users = res;
  	});
    this.uploadService.getUserScores().subscribe(
    res => {this.scores = res; });
    this.uploadService.getUnapprovedUploads().subscribe(
    res => {
    this.items = res;
    this.items.forEach(function(item){
      uploadService.getFamilyById(item.scientificName).subscribe(
        res => {
              item.scientificName = res[0].scientificName;
              item.commonName = res[0].commonName;
              console.log(item);
        });
    });
    });
   }
   isPresent(value){
    var currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if(currentUser)
    {
      if(this.scores)
      {
      var userIndex = this.scores.map(function(e){return e.type; }).indexOf(currentUser.usertype);
      var valueIndex = this.scores.map(function(e){return e.type; }).indexOf(value);
      if(this.scores[userIndex].score >= this.scores[valueIndex].score)
        return true;
      }
      else
        return false;
    }
    else
      return false;
  }
  changeView(value){
      this.approvesignup = false;
      this.approveupload = false;
      this.changeuser = false;
      this.viewlog = false;

      if(value == 'sign')
        this.approvesignup = true;
      else if(value == 'upload')
        this.approveupload = true;
      else if(value == 'privilege')
        this.changeuser = true;
      else if(value == 'log')
        this.viewlog = true;
  }
  approve(username, i, status){
  	var e = document.getElementsByClassName('type'+i)[0] as HTMLSelectElement;
  	var type = e.options[e.selectedIndex].value;
  	this.uploadService.approveUser(username, type, status).subscribe(res =>{
  	if(res === true)
        this.router.navigate(['/']);
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
  changeSource(event, name)
  {
    if(event.target.getAttribute('fallback') == undefined)
    {
      event.target.src = this.fallback_path + name;
      event.target.parentElement.href = this.fallback_path + name;
      event.target.setAttribute("fallback", "true");
    }
  }
  imageprofile(id) {
    this.router.navigate(['/leafedit', this.items[id]._id]);
  }
  approveUpload(id){
    this.uploadService.approveUpload(id).subscribe(res =>{
      if(res.success)
        window.location.reload();
    });
  }
  approveMarked(){
    this.uploadService.approveBulkUpload(this.leaflist).subscribe(res =>{
      if(res.success)
        window.location.reload();
    });
  }
  addLeaf(value,i){
    if($('.check'+i)[0].checked)
    {
      this.leaflist.push(value);
    }
    else{
    var index = this.leaflist.indexOf(value);
    if (index !== -1) this.leaflist.splice(index, 1);
    }
    console.log(this.leaflist);
    }
  ngOnInit() {
    
  }
}
