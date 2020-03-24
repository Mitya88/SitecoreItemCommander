import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { MediaService } from '../media.service';

@Component({
  selector: 'sc-media-view-page',
  templateUrl: './media-view-page.component.html',
  styleUrls: ['./media-view-page.component.scss']
})
export class MediaViewPageComponent implements OnInit {
  @Input()
  selectedDatabase: any;
  itemId: string;
  mediaViewLoading:boolean;
  constructor(private cdRef: ChangeDetectorRef,private itemCommanderService: ItemCommanderService,
    private mediaViewService: MediaService) {  
      this.mediaViewService.search.subscribe((value: string) => {
      this.itemId = value;
      this.load(value);
    });}

  ngOnInit() {
  }

  responseData: any;
  load(itemId: string) {
    this.mediaViewLoading = true;
    this.itemCommanderService.media(itemId, this.selectedDatabase).subscribe({
      next: response => {
        this.responseData = response;
        this.mediaViewLoading = false;
        this.cdRef.detectChanges();
      }, error: response => {
         this.mediaViewLoading = false;
        this.responseData = null;
      }
    });
  }

}
