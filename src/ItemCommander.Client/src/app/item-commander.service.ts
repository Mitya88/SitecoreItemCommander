import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemCommanderService {

  constructor(private httpClient: HttpClient) {


  }

  baseUrl = "/sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/";

  fetchItems(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + id + '/children?db='+database);
  }


  copyItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/copy?db='+database, body);
  }

  moveItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/move?db='+database, body);
  }

  deleteItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/delete?db='+database, body);
  }

  lockItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/lock?db='+database, body);
  }

  copySingleItem(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/copysingle?db='+database, body);
  }

  addFolder(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/folder?db='+database, body);
  }

  rename(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/rename?db='+database, body);
  }

  packageItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/package?db='+database, body);
  }

  search(keyword: any, database:string) {
    return this.httpClient.get(this.baseUrl +'-/search?keyword='+keyword +'&db='+database);
  }
  
  fastView(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + id + '/fastview?db='+database);
  }

  insertOptions(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + id + '/insertoptions?db='+database);
  }

  mediaUrl(id: any, database:string) {
    return this.httpClient.get(this.baseUrl + id + '/mediaurl?db='+database);
  }

  getItems(body: any, database:string) {
    return this.httpClient.post(this.baseUrl + '-/GetItems?db='+database, body);
  }
}
