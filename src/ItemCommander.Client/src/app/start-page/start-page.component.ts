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
  databases: string[] = ['master', 'core', 'web'];
  selectedDatabase: string = 'master';
  bookmarks:any[];

  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService,
    public dialogService: ScDialogService,
    private router: Router,
    private fastviewService: FastViewService
  ) { }

  leftIdBeforeSearch:string;
  leftData: ItemCommanderResponse;
  rightData: ItemCommanderResponse;

  isSearching:boolean;

  leftLoading: boolean;
  rightLoading: boolean;
  leftPath: string;
  rightPath: string;

  selectedTable: string;
  inputDialogValue: string;
  selectedItem: any;
  targetPath: any;
  parent: any;
  hiddenItems:any;
  insertOptions:Array<Item>;

  ngOnInit() {
    this.hiddenItems = this.storage.get('hiddenitems');
    this.selectedDatabase = this.storage.get('database');
    this.bookmarks = this.storage.get('bookmarks');

    if(!this.bookmarks){
      this.bookmarks = [];
    }

    let storedOptions = this.storage.get('options');
    if(storedOptions){
      this.options = storedOptions;
    }

    if (!this.selectedDatabase) {
      this.selectedDatabase = 'master';
    }

    this.selectedTable = "left";
    this.load();
    this.parent = this;
  }

  storeOptions(){
    this.storage.set('options', this.options);
  }

  showHiddenItems(){
    this.storage.set('hiddenitems',this.hiddenItems);
  }
  
  getTableClass(table: string) {
    return this.selectedTable == table ? "table-selected" : "table-not-selected";
  }

  changeDatabase() {
    this.storage.set('database', this.selectedDatabase);
    this.load();
  }

  tableSelect(table: string) {
    this.selectedTable = table;    
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
      this.selectedItem = null;
      return;
    }

    if(this.fastViewEnabled){      
    this.fastviewService.search.emit(item.Id);
    return;
    }

    if (this.selectedTable == "left") {
      this.leftData.Children.forEach(function (it) { it.IsSelected = false; });
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = false; });
    }

    item.IsSelected = true;
    this.selectedItem = item;
  }

  selectText = 'Select';
  selectAll() {

    let selectValue = false;
    if(this.selectText == 'Select'){
      selectValue = true;
      this.selectText = "Deselect"
    }
    else{
      this.selectText = 'Select';
      selectValue = false;
      this.selectedItem = null;
    }

    if (this.selectedTable == "left") {
      this.leftData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if(selectValue){
        this.selectedItem = this.leftData.Children[0];
      }
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if(selectValue){
        this.selectedItem = this.rightData.Children[0];
      }
    }
  }

  openInputDialog(dialogAction: string) {
    this.dialogService.open(this.simpleInputRef);
    this.inputAction = dialogAction;

    if (dialogAction == 'singleCopy') {
      this.singleInputTitle = 'Copy';
      this.singleInputText = 'New item\'s name';
    } 
     else if (dialogAction == 'search') {
      this.singleInputTitle = 'Search';
      this.singleInputText = 'Enter a keyword...';
    }
    else if(dialogAction=='rename'){
      this.singleInputTitle = 'Rename';
      this.singleInputText = 'Available patterns {C}, {oldName}, {yyyy}, {MM}';
    }
  }

  openConfirmDialog(dialogAction: string) {
    if (this.hasSelectedItem()) {
      this.warningText = 'There is no selected item';
      this.warningTitle = 'Invalid selected item';
      this.dialogService.open(this.warningRef);
      return;
    }
     this.getSelectedItems();
    if (dialogAction == 'move' && (this.selectedItem.Path == this.targetPath || this.targetPath.startsWith(this.selectedItem.Path))) {
      this.warningText = 'You cannot move item into itself';
      this.warningTitle = 'Move error';
      this.dialogService.open(this.warningRef);
      return;
    }


    this.dialogService.open(this.confirmDialog);
    this.confirmAction = dialogAction;

    if (this.confirmAction == 'copy') {
      this.copy();
    } else if (this.confirmAction == 'move') {
      this.parent.confirmTitle = 'Move';
      this.parent.confirmText = 'Are you sure to move?'
    } else if (this.confirmAction == 'delete') {
      this.parent.confirmTitle = 'Delete';
      this.parent.confirmText = 'Are you sure to delete?';

      var hasChildren = this.getSelectedItems().filter(function(t){return t.HasChildren}).length > 0;

      if(hasChildren){
        this.parent.confirmText+= ' (Child items will aslo be deleted)';
      }
    } else if (this.confirmAction == 'lock') {
      this.parent.confirmTitle = 'Lock';
      this.parent.confirmText = 'Are you sure to lock?';
    } else if (this.confirmAction == 'unlock') {
      this.parent.confirmTitle = 'Unlock';
      this.parent.confirmText = 'Are you sure to unlock?';
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
    if (this.selectedTable == 'left') {
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
    this.itemCommanderService.search(this.inputDialogValue, this.selectedDatabase).subscribe({
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
    
    this.itemCommanderService.rename(request, this.selectedDatabase).subscribe({
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

    this.itemCommanderService.moveItems(moveRequest, this.selectedDatabase).subscribe(
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
    if (this.selectedTable == 'left') {
      return this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
    else {
      return this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
  }

  downloadAsPackage() {
    if (this.hasSelectedItem()) {
      this.warningText = 'There is no selected item';
      this.warningTitle = 'Invalid selected item';
      this.dialogService.open(this.warningRef);
      return;
    }
    let moveRequest = new PackageRequest();

    moveRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });

    this.itemCommanderService.packageItems(moveRequest, this.selectedDatabase).subscribe({
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
    this.copyRequest = new CopyRequest();
    this.copyRequest.Items = this.getSelectedItems().map(function (it) { return it.Id });
    this.copyRequest.TargetPath = this.targetPath;
    this.dialogService.close();
    if (this.copyRequest.Items.length == 1) {
      this.inputDialogValue = this.selectedItem.Name;
      this.openInputDialog('singleCopy');
    }
    else {
      this.warningTitle = 'Copy';
      this.warningText = 'Are you sure?';
      this.openConfirmDialog('multipleCopy');
    }
  }

  multipleCopy() {
    this.itemCommanderService.copyItems(this.copyRequest, this.selectedDatabase).subscribe(
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
    this.itemCommanderService.copySingleItem(contract, this.selectedDatabase).subscribe({
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
    if (this.selectedTable == 'left') {
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

    this.itemCommanderService.deleteItems(deleteRequest, this.selectedDatabase).subscribe({
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

    this.itemCommanderService.lockItems(lockRequest, this.selectedDatabase).subscribe({
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
    this.itemCommanderService.fetchItems(id, this.selectedDatabase).subscribe({
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
    this.itemCommanderService.fetchItems(id, this.selectedDatabase).subscribe({
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

  mouseDown(ev, item: Item) {

    if (ev.buttons == 2) {
      if (item.IsSelected) {
        item.IsSelected = false;
      }
      else {
        item.IsSelected = true;
      }
      return false;
    }
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
    if (item.IsSelected) {
      item.IsSelected = false;
    }
    else {
      item.IsSelected = true;
      //Last selected item 
      this.selectedItem = item;
    }
    return false;
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

  options = [
    { name: 'Name', value: 'name', checked: true },
    { name: 'SitecorePath', value: 'sitecorepath', checked: false },
    { name: 'TemplateName', value: 'templatename', checked: true },
    { name: 'Created', value: 'created', checked: false },
    { name: 'LastModified', value: 'lastmodified', checked: true },
    { name: 'HasChildren', value: 'haschildren', checked: true }
  ]

  selectedOptions() { // right now: ['1','3']
    return this.options
      .filter(opt => opt.checked)
      .map(opt => opt.value)
  }

  showColumn(columnName: string) {
    return this.options.filter(opt => opt.value == columnName && opt.checked).length > 0;
  }
  getSelectedOptions() {
    return this.options
      .filter(opt => opt.checked);
  }

  selectedInsertOptions:any;
  openInsertOptions(){
    var id = '';
    if(this.selectedTable == 'left'){
      id=this.leftData.CurrentId;
    }
    else{
      id=this.rightData.CurrentId;
    }
    this.itemCommanderService.insertOptions(id, this.selectedDatabase).subscribe({
      next: response =>{
        this.insertOptions = response as Array<Item>;
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
    this.itemCommanderService.addFolder(contract, this.selectedDatabase).subscribe({
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
    let url ='/sitecore/shell/Applications/Content%20Editor.aspx?fo='+this.selectedItem.Id;

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
    if (this.bookmarks.length == 0 || !pathData){
      return false;
    }
    let data = this.bookmarks.filter(item => item.Path == pathData.CurrentPath);
   

    return data.length>0;
  }

  bookmark(pathData:any){
    this.bookmarks.push({Path : pathData.CurrentPath, Id : pathData.CurrentId});
    this.storage.set('bookmarks',this.bookmarks)
  }

  unbookmark(pathData:any){
    let filteredItems = this.bookmarks.filter(item => item.Path !== pathData.CurrentPath)
    this.bookmarks = filteredItems;
    this.storage.set('bookmarks',this.bookmarks)
  }

  loadBookmark(item:any){
    this.loadLeftItems(item.Id);
  }
}
