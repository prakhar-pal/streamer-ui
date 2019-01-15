import { Component,OnInit, ViewEncapsulation } from '@angular/core';
import {UrlService} from './service/url.service';
import { HttpClient } from '@angular/common/http';
import {FormGroup,FormBuilder} from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css','./app.component.videojs.css','./app.tooltip.component.css'],
})
//"http://vjs.zencdn.net/7.0.3/video-js.css",
export class AppComponent {
  constructor(private urlService:UrlService,
    private http:HttpClient,
    private fb:FormBuilder){}
  showVideo:boolean;
  showPhoto:boolean;
  videoUrl:string;
  photoUrl:string;
  files:string[];
  dirs:string[];
  filesEnc:string[];
  dirsEnc:string[];
  levels:any; // to track number of levels inside the root directory of the app
  activeDir:string;
  activeFile:string;
  path:string[];
  serverUrl:string;
  searchForm:FormGroup;
  rootPath:string;

  ngOnInit(){
    this.showPhoto = false;
    this.showVideo = false;
    this.rootPath = 'f58b739373fe30804177217a493306f7';
    this.levels = -1; 
    //-1 is set for convienience, so that when the this.updateListing() is called for the first time
    //this.levels becomes 0 and incremented for every call to this.updateListing(dir)
    this.serverUrl = this.urlService.getHostAddress();
    //initialize empty path
    this.path = [];
    // get file,dir lists
     //update values for levels and path
    this.levels+=1;
    this.path.push(this.rootPath);
    this.updateListing(this.rootPath); // this.rootPath is encoded root directory name
    this.initForm(); //initialize the forms of search
  }
  initForm(){
    this.searchForm = this.fb.group({
      searchText:"",
    })
  }
  updateListing(dir){
    console.log(`update listing with ${dir}`);
    /*updates values of files and dirs (and their encoded parts) for given dir*/
    this.http.post(this.urlService.getFilelistUrl(),{dirEnc:dir}).subscribe(
      (success:any)=>{
        //console.log(JSON.stringify(success,null,2));
        this.files = success.data.files;
        this.dirs =  success.data.directories; 
       // this.filesEnc =  success.data.filesEncoded;
        //this.dirsEnc =  success.data.dirsEncoded;
      }
      ,(err)=>{
        console.log(err);
      });
  }
  openDir(dir){
    console.log('open '+dir.name);
    this.updateListing(dir.nameEncoded);
    this.activeDir = dir.name;
    this.levels+=1;
    this.path.push(dir.nameEncoded);
  }
  openFile(file){
    console.log('open '+JSON.stringify(file.nameEncoded));
    this.showVideo = false;
    this.showPhoto = false;
    this.activeFile = file.name;
    this.http.post(this.urlService.getFileUrl(),{fileEnc:file.nameEncoded})
    .subscribe((success:any)=>{
      console.log(JSON.stringify(success,null,2));
      switch(success.data.extension){
        case '.mp4':
        case '.gif':
        case '.ogg':
        case '.webm':
        case '.mkv':
            this.videoUrl = this.serverUrl+success.data.url;
            this.showVideo = true;
            break;
        case '.png':
        case '.jpg':
        case '.jpeg':
        case '.bmp':
            this.photoUrl = this.serverUrl+success.data.url;
            this.showPhoto = true;
            break;
      }
    });
  }
  goBack(){
    this.levels-=1;
    console.log('path before going back:'+this.path+', levels:'+this.levels);
    if(this.path.length>1){
      this.path.pop();
      this.updateListing(this.path[this.path.length-1]);
    }
    console.log('path after going back:'+this.path+', levels:'+this.levels);
  }
  search(){
    console.log('searching for :'+this.searchForm.get("searchText").value);
    let data = {
      pattern:this.searchForm.get("searchText").value
    };
    this.http.post(this.urlService.getSearchUrl(),data).subscribe(
      (success:any)=>{
        //console.log('got following data.\n:'+JSON.stringify(success.data,null,2));
        this.files = success.data;
        this.dirs = [];
      },
      (err)=>{}
    )
  }

}
