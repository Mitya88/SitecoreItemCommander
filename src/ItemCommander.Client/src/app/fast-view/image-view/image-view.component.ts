import { Component, OnInit, Input } from '@angular/core';
import { FieldDto } from '../../contract/ItemCommanderResponse';

@Component({
  selector: 'app-image-view',
  templateUrl: './image-view.component.html',
  styleUrls: ['./image-view.component.scss']
})
export class ImageViewComponent implements OnInit {

  @Input()
  context: FieldDto;

  constructor() { }

  ngOnInit() {
    console.log(this.context);
  }
}
