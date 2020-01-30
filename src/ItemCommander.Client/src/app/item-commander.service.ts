import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemCommanderService {

  constructor(private httpClient: HttpClient) {


  }

  baseUrl = "/sitecore/api/ssc/itemcommander";

  fetchItems(id: any, database:string) {
    return this.httpClient.get(this.baseUrl+'/children?db='+database+'&id='+id);
  }

  editoroptions(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + '/editoroptions?db='+database+'&id='+id);
  }

  copyItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/copy', body);
  }

  moveItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/move', body);
  }

  deleteItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/delete', body);
  }

  lockItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/lock', body);
  }

  copySingleItem(body: any) {
    return this.httpClient.post(this.baseUrl + '/copysingle', body);
  }

  addFolder(body: any) {
    return this.httpClient.post(this.baseUrl + '/folder', body);
  }

  rename(body: any) {
    return this.httpClient.post(this.baseUrl + '/rename', body);
  }

  packageItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/package', body);
  }

  search(keyword: any, database:string) {
    return this.httpClient.get(this.baseUrl +'/search?keyword='+keyword +'&db='+database);
  }
  
  fastView(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + '/fastview?db='+database+'&id='+id);
  }

  insertOptions(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + '/insertoptions?db='+database+'&id='+id);
  }

  mediaUrl(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + '/mediaurl?db='+database+'&id='+id);
  }

  getItems(body: any) {
    return this.httpClient.post(this.baseUrl + '/GetItems', body);
  }

  status(body: any, progressId:string) {
    return this.httpClient.post(this.baseUrl + '/status?progressid='+progressId, body);
  }
}
