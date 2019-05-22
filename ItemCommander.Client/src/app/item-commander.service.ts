import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ItemCommanderService {

  constructor(private httpClient: HttpClient) {

    
   }

   fetchItems(id:any){
    return this.httpClient.get(`/sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/`+id+'/children');
  }
   

  copyItems(body:any){
    return this.httpClient.post('/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy',body);
    }
}
