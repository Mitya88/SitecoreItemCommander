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

    moveItems(body:any){
      return this.httpClient.post('/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/move',body);
      }

      deleteItems(body:any){
        return this.httpClient.post('/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/delete',body);
        }

        copySingleItem(body:any){
          return this.httpClient.post('/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copysingle',body);
          }

          addFolder(body:any){
            return this.httpClient.post('/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/folder',body);
            }
}
