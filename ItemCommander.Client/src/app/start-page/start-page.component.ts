import { Component, OnInit } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest} from '../contract/copyRequest';
import { ItemCommanderResponse } from '../contract/ItemCommanderResponse';
import { SciLogoutService } from '@speak/ng-sc/logout';
@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})
export class StartPageComponent implements OnInit {
  isNavigationShown : boolean;
  constructor(private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService) { }

  isSearching = false;
  leftData : ItemCommanderResponse;
  rightData : ItemCommanderResponse;


  leftLoading:boolean; 
  rightLoading:boolean;
  leftPath: string;
  rightPath: string;

  selectedTable:string;

  ngOnInit() {
    
    this.load();

   
  }
   
  GetTableClass(table:string){
    return this.selectedTable == table ? "table-selected": "table-not-selected";
  }

  tableSelect(table:string){
    this.selectedTable = table;
  }
  load(){
   
    
    this.leftPath = '/sitecore';
    
    this.rightPath = '/sitecore/content';

    this.loadLeftItems('0DE95AE4-41AB-4D01-9EB0-67441B7C2450');

    this.loadRightItems('0DE95AE4-41AB-4D01-9EB0-67441B7C2450');
  }

   selectAll()
   {
     this.rightData.Children.forEach(function(it){it.IsSelected = true;});
   }
  copyRequest:CopyRequest;
  copy(){
    this.copyRequest = new CopyRequest();
    
    if(this.selectedTable == 'left'){
      //taget a right
      this.copyRequest.TargetPath = this.rightData.CurrentPath;

      this.copyRequest.Items = this.leftData.Children.filter( it => it.IsSelected).map(function(it){return it.Id});
    }
    else{
      this.copyRequest.TargetPath = this.leftData.CurrentPath;
      this.copyRequest.Items = this.rightData.Children.filter( it => it.IsSelected).map(function(it){return it.Id});
    }
    console.log(this.copyRequest);
    this.itemCommanderService.copyItems(this.copyRequest).subscribe(
     {
       next: response =>{
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
       }
     }
    )
  }
  goUpLeft(){}

  loadLeftItems(id:string){
    this.leftLoading = true;
    this.itemCommanderService.fetchItems(id).subscribe({
      next: response => {
        this.leftData = response as ItemCommanderResponse;
        this.leftPath = this.leftData.CurrentPath;
        this.leftLoading = false;
      },
      error: error => {}
    });
  }

  loadRightItems(id:string){
    this.rightLoading = true;

    this.itemCommanderService.fetchItems(id).subscribe({
      next: response => {
        this.rightData = response as ItemCommanderResponse;
        this.rightPath = this.rightData.CurrentPath;
        this.rightLoading = false;
      },
      error: error => {}
    });
  }

  mouseDown(ev, item: Item){

    if(ev.buttons == 2){
    if(item.IsSelected){
      item.IsSelected = false;
    }
    else{
      item.IsSelected = true;
    }
    return false;
    
  }
  }

   loadParent(side:string){
     if(side=="left"){
        this.loadLeftItems(this.leftData.ParentId);
     }
     else{
        this.loadRightItems(this.rightData.ParentId);
     }
   }

  onRightClick(item: Item){
    console.log('clicked');
     console.log(item);
    if(item.IsSelected){
      item.IsSelected = false;
    }
    else{
      item.IsSelected = true;
    }
    return false;
  }

  leftDoubleClick(item: Item){
    this.loadLeftItems(item.Id);
  }

  rightDoubleClick(item: Item){
    this.loadRightItems(item.Id);
  }
  doubleClick(){
    console.log('double');
  }

  getClass(item: Item){
    if(item.IsSelected){
      return "selectedItem";
    }
    return "";
  }
}
