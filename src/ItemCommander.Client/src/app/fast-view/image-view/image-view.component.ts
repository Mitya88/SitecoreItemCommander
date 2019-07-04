import { Component, OnInit, Input } from '@angular/core';
import { FieldDto } from '../../contract/ItemCommanderResponse';
import { ItemCommanderService } from '../../item-commander.service';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {

  @Input()
  context: FieldDto;

  mediaUrl:any;
  constructor(private itemCommanderService:ItemCommanderService) { 
    this.mediaUrl = '#';
  }

  ngOnInit() {
    let parser = new DOMParser();
let xmlDoc = parser.parseFromString(this.context.Value,"text/xml");
let value = xmlDoc.getElementsByTagName('image')[0].getAttribute('mediaid');

    this.itemCommanderService.mediaUrl(value, 'master').subscribe({
      next: response =>{
        this.mediaUrl = response ;
      }
    });
  }
}
