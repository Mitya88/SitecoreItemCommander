import { Component, OnInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest, CopySingle, DeleteRequest, FolderRequest, PackageRequest, DownloadResponse, LockRequest, RenameRequest } from '../contract/copyRequest';
import { ItemCommanderResponse } from '../contract/ItemCommanderResponse';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ScDialogService } from '@speak/ng-bcl/dialog';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service'
import { Router } from '@angular/router';
import { FastViewService } from '../fast-view/fastview.service';
import { Constants } from '../constants';
import { ItemService } from '../services/item.service';
import { CommanderSettings } from '../model/CommanderSettings';

@Component({
  selector: 'app-start-page',
  templateUrl: './start-page.component.html',
  styleUrls: ['./start-page.component.scss']
})

export class StartPageComponent implements OnInit {

  @ViewChild('confirmDialog')
  private confirmDialog: TemplateRef<any>

  @ViewChild('simpleInput')
  private simpleInputRef: TemplateRef<any>

  @ViewChild('warning')
  private warningRef: TemplateRef<any>

  @ViewChild('insertOptions')
  private insertOptionRef: TemplateRef<any>

  confirmText: string = '';
  confirmTitle: string = '';
  singleInputTitle: string = '';
  singleInputText: string = '';
  confirmAction: string;
  inputAction: string;
  warningText: string;
  warningTitle:string;

  isNavigationShown: boolean; 

  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService,
    public dialogService: ScDialogService,
    private router: Router,
    private fastviewService: FastViewService,
    private itemService:ItemService
  ) { }

  leftIdBeforeSearch:string;
  leftData: ItemCommanderResponse;
  rightData: ItemCommanderResponse;

  isSearching:boolean;

  leftLoading: boolean;
  rightLoading: boolean;
  leftPath: string;
  rightPath: string;

  inputDialogValue: string;
  targetPath: any;
  parent: any;

  commanderSettings:CommanderSettings;

  ngOnInit() {
   this.commanderSettings = this.itemService.getCommanderSettings();
    this.load();
    this.parent = this;
  }

  storeOptions(){
    this.storage.set('options', this.commanderSettings.options);
  }

  showHiddenItems(){
    this.storage.set('hiddenitems',this.commanderSettings.hiddenItems);
  }
  
  getTableClass(table: string) {
    return this.commanderSettings.selectedTable == table ? "table-selected" : "table-not-selected";
  }

  changeDatabase() {
    this.storage.set('database', this.commanderSettings.selectedDatabase);
    this.load();
  }

  tableSelect(table: string) {
    this.commanderSettings.selectedTable = table;    
  }

  load() {
    this.leftPath = '/sitecore';
    this.rightPath = '/sitecore/content';

    this.loadLeftItems('11111111-1111-1111-1111-111111111111');
    this.loadRightItems('11111111-1111-1111-1111-111111111111');
  }

  fastViewSearch(){
    
    if (this.getSelectedItems().length > 0){
      if(this.fastViewEnabled){    
        var id = this.getSelectedItems()[0].Id        
        this.fastviewService.search.emit(id);
        return;
        }
     
    }
  }

  singleSelect(item: Item) {
    if (item.IsSelected) {
      item.IsSelected = false;
      this.commanderSettings.selectedItem = undefined;
      return;
    }

    if(this.fastViewEnabled){      
    this.fastviewService.search.emit(item.Id);
    return;
    }

    if (this.commanderSettings.selectedTable == "left") {
      this.leftData.Children.forEach(function (it) { it.IsSelected = false; });
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = false; });
    }

    item.IsSelected = true;
    this.commanderSettings.selectedItem = item;
  }

  selectText = Constants.SelectText;
  selectAll() {

    let selectValue = false;
    if(this.selectText == Constants.SelectText){
      selectValue = true;
      this.selectText = Constants.DeselectText;
    }
    else{
      this.selectText = Constants.SelectText;
      selectValue = false;
      this.commanderSettings.selectedItem = undefined;
    }

    if (this.commanderSettings.selectedTable == "left") {
      this.leftData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if(selectValue){
        this.commanderSettings.selectedItem = this.leftData.Children[0];
      }
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if(selectValue){
        this.commanderSettings.selectedItem = this.rightData.Children[0];
      }
    }
  }

  openInputDialog(dialogAction: string) {
    this.dialogService.open(this.simpleInputRef);
    this.inputAction = dialogAction;

    if (dialogAction == 'singleCopy') {
      this.singleInputTitle = Constants.CopyDialogTitle;
      this.singleInputText = Constants.NewItemText;
    } 
     else if (dialogAction == 'search') {
      this.singleInputTitle = Constants.SearchDialogTitle;
      this.singleInputText = Constants.SearchInputText;
    }
    else if(dialogAction=='rename'){
      this.singleInputTitle = Constants.RenameDialogTitle;
      this.singleInputText = Constants.RenameText;
    }
  }

  openConfirmDialog(dialogAction: string) {
    if (this.hasSelectedItem() || !this.commanderSettings.selectedItem) {
      this.warningText = Constants.NoItemWarningText;
      this.warningTitle = Constants.NoItemWarningTitle;
      this.dialogService.open(this.warningRef);
      return;
    }
     this.getSelectedItems();
    if (dialogAction == 'move' && (this.commanderSettings.selectedItem.Path == this.targetPath || this.targetPath.startsWith(this.commanderSettings.selectedItem.Path))) {
      this.warningText = Constants.ItemMovingError;
      this.warningTitle = Constants.ItemMovingErrorTitle;
      this.dialogService.open(this.warningRef);
      return;
    }


    this.dialogService.open(this.confirmDialog);
    this.confirmAction = dialogAction;

    if (this.confirmAction == 'copy') {
      this.copy();
    } else if (this.confirmAction == 'move') {
      this.parent.confirmTitle = Constants.ItemMovingConfirmationTitle;
      this.parent.confirmText = Constants.ItemMovingConfirmationText;
    } else if (this.confirmAction == 'delete') {
      this.parent.confirmTitle = Constants.ItemDeletingConfirmationTitle;
      this.parent.confirmText = Constants.ItemDeletingConfirmationText;

      var hasChildren = this.getSelectedItems().filter(function(t){return t.HasChildren}).length > 0;

      if(hasChildren){
        this.parent.confirmText+= Constants.ItemDeletingWithChildren;
      }
    } else if (this.confirmAction == 'lock') {
      this.parent.confirmTitle = Constants.ItemLockConfirmationTitle;
      this.parent.confirmText = Constants.ItemLockConfirmationText;
    } else if (this.confirmAction == 'unlock') {
      this.parent.confirmTitle = Constants.ItemUnlockConfirmationTitle;
      this.parent.confirmText = Constants.ItemUnlockConfirmationText;
    }

  }

  Action() {
    if (this.confirmAction == 'copy') {
      this.copy();
    } else if (this.confirmAction == 'move') {
      this.move();
    } else if (this.confirmAction == 'delete') {
      this.delete();
    } else if (this.confirmAction == 'multipleCopy') {
      this.multipleCopy();
    } else if (this.confirmAction == 'lock') {
      this.lock(true);
    }
    else if (this.confirmAction == 'unlock') {
      this.lock(false);
    }
  }

  singleInputAction() {
     if (this.inputAction == 'singleCopy') {
      this.singleCopy();
    } else if (this.inputAction == 'search') {
      this.search();
    }
    else if(this.inputAction == 'rename'){
      this.rename();
    }
  }
  fastView(){

    if(this.fastViewEnabled){
      this.fastViewEnabled = false;
    }
    else{
      this.fastViewEnabled = true;
    }
  }

  getSelectedItems() {
    if (this.commanderSettings.selectedTable == 'left') {
      //taget a right
      this.targetPath = this.rightData.CurrentPath;

      return this.leftData.Children.filter(it => it.IsSelected);
    }
    else {
      this.targetPath = this.leftData.CurrentPath;
      return this.rightData.Children.filter(it => it.IsSelected);
    }
  }  

  search() {
    this.leftLoading = true;    
    this.leftIdBeforeSearch = this.leftData.CurrentId;
    this.itemCommanderService.search(this.inputDialogValue, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.leftData = response as ItemCommanderResponse;
        this.leftPath = this.inputDialogValue;
        this.leftLoading = false;
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    })
  }

  rename() {

    let request = new RenameRequest();
    request.Items = this.getSelectedItems().map(function (it) { return it.Id });
    
    request.NameOrPattern=this.inputDialogValue
    
    this.itemCommanderService.rename(request, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    })
  }

  move() {
    let moveRequest = new CopyRequest();
    moveRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });
    moveRequest.TargetPath = this.targetPath;

    this.itemCommanderService.moveItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
          this.dialogService.close();
        },
        error: response =>{        
          this.handleError(response);
        }
      }
    );
  }

  hasSelectedItem() {
    if (this.commanderSettings.selectedTable == 'left') {
      return this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
    else {
      return this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
  }

  downloadAsPackage() {
    if (this.hasSelectedItem()) {
      this.warningText = Constants.NoItemWarningText;
      this.warningTitle = Constants.NoItemWarningTitle;
      this.dialogService.open(this.warningRef);
      return;
    }
    let moveRequest = new PackageRequest();

    moveRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });

    this.itemCommanderService.packageItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: fileName => {
        let theFile = '/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/download?fileName=' + (fileName as DownloadResponse).FileName;
        window.open(theFile);
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  copyRequest: CopyRequest;
  copy() {

    if(!this.commanderSettings.selectedItem){
      return;
    }
    this.copyRequest = new CopyRequest();
    this.copyRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });
    this.copyRequest.TargetPath = this.targetPath;
    this.dialogService.close();
    if (this.copyRequest.Items.length == 1) {
      this.inputDialogValue = this.commanderSettings.selectedItem.Name;
      this.openInputDialog('singleCopy');
    }
    else {
      this.warningTitle = Constants.ItemCopyConfirmationTitle
      this.warningText = Constants.ItemCopyConfirmationText;
      this.openConfirmDialog('multipleCopy');
    }
  }

  multipleCopy() {
    this.itemCommanderService.copyItems(this.copyRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
        },
        error: response =>{        
          this.handleError(response);
        }
      }
    );
  }

  singleCopy() {
    let contract = new CopySingle();
    contract.Item = this.copyRequest.Items[0];
    contract.TargetPath = this.copyRequest.TargetPath;
    contract.Name = this.parent.inputDialogValue;
    this.itemCommanderService.copySingleItem(contract, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  getTargetPathForFolder() {
    if (this.commanderSettings.selectedTable == 'left') {
      //taget a right
      return this.leftData.CurrentPath;
    }
    else {
      return this.rightData.CurrentPath;
    }
  }

  delete() {

    let deleteRequest = new DeleteRequest();
    deleteRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });

    this.itemCommanderService.deleteItems(deleteRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  fastViewEnabled = false;

  lock(lock: boolean) {

    let lockRequest = new LockRequest();
    lockRequest.Lock = lock;
    lockRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });

    this.itemCommanderService.lockItems(lockRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  loadLeftItems(id: string) {
    // Search has no id
    if (id == '') {
      return;
    }

    this.leftLoading = true;
    this.itemCommanderService.fetchItems(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.leftData = response as ItemCommanderResponse;
        this.leftPath = this.leftData.CurrentPath;
        this.leftLoading = false;
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  loadRightItems(id: string) {
    this.rightLoading = true;
    this.itemCommanderService.fetchItems(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.rightData = response as ItemCommanderResponse;
        this.rightPath = this.rightData.CurrentPath;
        this.rightLoading = false;
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }


  downSelector:boolean;
  mouseDown(ev: any, item: Item) {
    if (ev.buttons == 2) {
      if (item.IsSelected && !this.downSelector) {
        item.IsSelected = false;
      }
      else if(!item.IsSelected && this.downSelector) {
        item.IsSelected = true;
        //Set last selected item
        this.commanderSettings.selectedItem = item;
      }
    }
    
    return false;
  }

  mouseUp(ev: any, item: Item) {
  
    if (ev.button == 2) {
      if (item.IsSelected) {
        this.commanderSettings.selectedItem = item;
      }     
    }
    
    return false;
  }

  mouseDownSetup(ev: any, item:Item){
    if (ev.buttons == 2) {
   
      if (item.IsSelected) {
        item.IsSelected = false;
        this.downSelector = false;
      }
      else {
        item.IsSelected = true;
        this.downSelector = true;
      }
    }
    
    return false;
  }

  loadParent(side: string) {
    if (side == "left") {
      if (this.leftData.ParentId == '{00000000-0000-0000-0000-000000000000}') {
        return;
      }

      if (this.leftData.ParentId == null){
        this.loadLeftItems(this.leftIdBeforeSearch);
        return;
      }
      this.loadLeftItems(this.leftData.ParentId);
    }
    else {
      if (this.rightData.ParentId == '{00000000-0000-0000-0000-000000000000}') {
        return;
      }
      this.loadRightItems(this.rightData.ParentId);
    }
  }

  onRightClick(item: Item) {
    return false;
    // if (item.IsSelected) {
    //   item.IsSelected = false;
    // }
    // else {
    //   item.IsSelected = true;
    //   //Last selected item 
    //   this.selectedItem = item;
    // }
    // return false;
  }

  leftDoubleClick(item: Item) {
    this.loadLeftItems(item.Id);
  }

  rightDoubleClick(item: Item) {
    this.loadRightItems(item.Id);
  }

  openFastView(item:Item){
    this.router.navigateByUrl('/fastview?itemid='+item.Id);
  }

  getClass(item: Item) {
    if (item.IsSelected) {
      return "selectedItem";
    }
    return "";
  }

  selectedOptions() { // right now: ['1','3']
    return this.commanderSettings.options
      .filter((opt: any) => opt.checked)
      .map((opt: any) => opt.value)
  }

  showColumn(columnName: string) {
    return this.commanderSettings.options.filter((opt: any) => opt.value == columnName && opt.checked).length > 0;
  }
  getSelectedOptions() {
    return this.commanderSettings.options
      .filter((opt: any) => opt.checked);
  }

  selectedInsertOptions:any;
  openInsertOptions(){
    var id = '';
    if(this.commanderSettings.selectedTable == 'left'){
      id=this.leftData.CurrentId;
    }
    else{
      id=this.rightData.CurrentId;
    }
    this.itemCommanderService.insertOptions(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response =>{
        this.commanderSettings.insertOptions = response as Array<Item>;
    this.dialogService.open(this.insertOptionRef);
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  createItem(){
    let contract = new FolderRequest();
    contract.TargetPath = this.getTargetPathForFolder();
    contract.Name = this.parent.inputDialogValue;
    contract.TemplateId = this.selectedInsertOptions;
    this.itemCommanderService.addFolder(contract, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }

  openContentEditor(){
    if(!this.commanderSettings.selectedItem){
      return;
    }
    let url ='/sitecore/shell/Applications/Content%20Editor.aspx?fo='+this.commanderSettings.selectedItem.Id;

    var win = window.open(url, '_blank');
  win.focus();
  }

  handleError(response: any){

    if(response.error && response.error.InnerException){
      this.dialogService.close();
      this.warningText = response.error.InnerException.ExceptionMessage;
      this.warningTitle = response.statusText;
      this.dialogService.open(this.warningRef);
      return;
    }

    if(response.error && response.error.ExceptionMessage){
      this.dialogService.close();
      this.warningText = response.error.ExceptionMessage;
      this.warningTitle = response.statusText;
      this.dialogService.open(this.warningRef);
    }
  }

  checkBookmark(pathData:any){
    if (this.commanderSettings.bookmarks.length == 0 || !pathData){
      return false;
    }
    let data = this.commanderSettings.bookmarks.filter(item => item.Path == pathData.CurrentPath);
   

    return data.length>0;
  }

  bookmark(pathData:any){
    this.commanderSettings.bookmarks.push({Path : pathData.CurrentPath, Id : pathData.CurrentId});
    this.storage.set('bookmarks',this.commanderSettings.bookmarks)
  }

  unbookmark(pathData:any){
    let filteredItems = this.commanderSettings.bookmarks.filter(item => item.Path !== pathData.CurrentPath)
    this.commanderSettings.bookmarks = filteredItems;
    this.storage.set('bookmarks',this.commanderSettings.bookmarks)
  }

  loadBookmark(side: string, item:any){
    if(side=='left'){
      this.loadLeftItems(item.Id);
    }
    else{
      this.loadRightItems(item.Id);
    }
    
  }

  editorOptions:any;
  loadEditorOptions(){
    if (this.hasSelectedItem() || !this.commanderSettings.selectedItem) {
      this.warningText = 'There is no selected item';
      this.warningTitle = 'Invalid selected item';
      this.dialogService.open(this.warningRef);
      return;
    }

    this.itemCommanderService.editoroptions(this.commanderSettings.selectedItem.Id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
       this.editorOptions = response;
      },
      error: response =>{        
        this.handleError(response);
      }
    });
  }
}
