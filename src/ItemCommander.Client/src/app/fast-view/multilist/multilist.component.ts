import { Component, OnInit, Input } from '@angular/core';
import { ItemCommanderService } from '../../item-commander.service';
import { GetItemRequest } from '../../contract/getItemRequest';

@Component({
  selector: 'app-multilist',
  templateUrl: './multilist.component.html',
  styleUrls: ['./multilist.component.scss']
})
export class MultilistComponent implements OnInit {
  @Input()
  context: any;
  
  responseData:any;
  constructor(private itemCommanderService: ItemCommanderService) { }

  ngOnInit() {

    let request = new GetItemRequest();
    request.RawValue = this.context.Value;
    request.Database = 'master';
    
    this.itemCommanderService.getItems(request).subscribe({
      next: response=>{
        this.responseData = response;
      }
    })
  }

}
