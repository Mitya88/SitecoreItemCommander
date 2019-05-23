import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest, CopySingle, DeleteRequest, FolderRequest} from '../contract/copyRequest';
import { ItemCommanderResponse } from '../contract/ItemCommanderResponse';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ScDialogService } from '@speak/ng-bcl/dialog';
@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})



export class StartPageComponent implements OnInit {
  
  @ViewChild('singleCopy')
  private singleCopyRef : TemplateRef<any>

  @ViewChild('delete')
  private deleteRef : TemplateRef<any>

  @ViewChild('addFolder')
  private addFolderRef : TemplateRef<any>

  isNavigationShown : boolean;
  constructor(private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService, public dialogService: ScDialogService) { }

  isSearching = false;
  leftData : ItemCommanderResponse;
  rightData : ItemCommanderResponse;


  leftLoading:boolean; 
  rightLoading:boolean;
  leftPath: string;
  rightPath: string;

  selectedTable:string;
  singleCopyName:string;
  parent:any;
  ngOnInit() {
    this.selectedTable = "left";
    this.load();

     this.parent=this;
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


  singleSelect(item:Item){
    
    if(item.IsSelected){
      item.IsSelected = false;
      return;
    }
    if(this.selectedTable == "left"){

      this.leftData.Children.forEach(function(it){it.IsSelected = false;});
     }
     else{

      this.rightData.Children.forEach(function(it){it.IsSelected = false;});
     }


     item.IsSelected = true;
  }
   selectAll()
   {
     if(this.selectedTable == "left"){

      this.leftData.Children.forEach(function(it){it.IsSelected = true;});
     }
     else{

      this.rightData.Children.forEach(function(it){it.IsSelected = true;});
     }
   }


   openFolderPopup(){
     this.dialogService.open(this.addFolderRef);
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



    if(this.copyRequest.Items.length==1){
      this.dialogService.open(this.singleCopyRef);
    
    }
    else{
      console.log(this.copyRequest);
      this.itemCommanderService.copyItems(this.copyRequest).subscribe(
       {
         next: response =>{
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
         }
       }
      );
    }
    
   
  }
  goUpLeft(){}

  onSearchChange(searchValue : string ) {  
    console.log(searchValue);
  this.singleCopyName = searchValue
}

  singleCopy(){
    let contract = new CopySingle();
    contract.Item = this.copyRequest.Items[0];
    contract.TargetPath = this.copyRequest.TargetPath;
    contract.Name = this.parent.singleCopyName;
    console.log( this.singleCopyName);
    console.log(contract);
       this.itemCommanderService.copySingleItem(contract).subscribe({
        next: response =>{
            this.loadLeftItems(this.leftData.CurrentId);
            this.loadRightItems(this.rightData.CurrentId);
            this.dialogService.close();
        }
      });
  }

  addFolder(){
    let contract = new FolderRequest();
    contract.TargetPath = this.getTargetPathForFolder();
    contract.Name = this.parent.singleCopyName;
    console.log( this.singleCopyName);
    console.log(contract);
       this.itemCommanderService.addFolder(contract).subscribe({
        next: response =>{
            this.loadLeftItems(this.leftData.CurrentId);
            this.loadRightItems(this.rightData.CurrentId);
            this.dialogService.close();
        }
      });
  }

  getTargetPathForFolder(){
    if(this.selectedTable == 'left'){
      //taget a right
      return this.leftData.CurrentPath;
    }
    else{
      return this.rightData.CurrentPath;
    }
  }
  deleteClick(){
    this.dialogService.open(this.deleteRef);
  }

  delete(){
    
    let deleteRequest = new DeleteRequest();
    
    if(this.selectedTable == 'left'){
      //taget a right

      deleteRequest.Items = this.leftData.Children.filter( it => it.IsSelected).map(function(it){return it.Id});
    }
    else{
      deleteRequest.Items = this.rightData.Children.filter( it => it.IsSelected).map(function(it){return it.Id});
    }

    this.itemCommanderService.deleteItems(deleteRequest).subscribe({
      next: response =>{
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
          this.dialogService.close();
      }
    });
  }
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
