import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  host = "http://localhost:3000/";
  constructor() { }
  getHostAddress(){
    return this.host;
  }
  getFilelistUrl(){
    return this.host+'api/get_files_list';
  }
  getFileUrl(){
    return this.host+'api/get_file_url';
  }
  getSearchUrl(){
    return this.host+'api/search';
  }
}
