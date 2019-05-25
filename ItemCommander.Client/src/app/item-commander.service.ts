import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemCommanderService {

  constructor(private httpClient: HttpClient) {


  }

  baseUrl = "/sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/";

  fetchItems(id: any) {
    return this.httpClient.get(this.baseUrl + id + '/children');
  }


  copyItems(body: any) {
    return this.httpClient.post(this.baseUrl + '-/copy', body);
  }

  moveItems(body: any) {
    return this.httpClient.post(this.baseUrl + '-/move', body);
  }

  deleteItems(body: any) {
    return this.httpClient.post(this.baseUrl + '-/delete', body);
  }

  copySingleItem(body: any) {
    return this.httpClient.post(this.baseUrl + '-/copysingle', body);
  }

  addFolder(body: any) {
    return this.httpClient.post(this.baseUrl + '-/folder', body);
  }

  setDatabase(id: any) {
    return this.httpClient.get(this.baseUrl + id + '/database');
  }

  packageItems(body: any) {
    return this.httpClient.post(this.baseUrl + '-/package', body);
  }
}
