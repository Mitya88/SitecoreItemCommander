import { Component, OnInit, TemplateRef, ViewChild, Inject } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest, CopySingle, DeleteRequest, FolderRequest, PackageRequest, DownloadResponse } from '../contract/copyRequest';
import { ItemCommanderResponse } from '../contract/ItemCommanderResponse';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ScDialogService } from '@speak/ng-bcl/dialog';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service'

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

  confirmText: string = '';
  confirmTitle: string = '';
  singleInputTitle: string = '';
  singleInputText: string = '';
  confirmAction: string;
  inputAction: string;
  warningText: string;

  isNavigationShown: boolean;
  databases: string[] = ['master', 'core', 'web'];
  selectedDatabase: string = 'master';



  constructor(
    @Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService,
    public dialogService: ScDialogService,
  ) { }

  isSearching = false;
  leftData: ItemCommanderResponse;
  rightData: ItemCommanderResponse;


  leftLoading: boolean;
  rightLoading: boolean;
  leftPath: string;
  rightPath: string;

  selectedTable: string;
  inputDialogValue: string;
  parent: any;

  ngOnInit() {

    this.selectedDatabase = this.storage.get('database');

    if (!this.selectedDatabase) {
      this.selectedDatabase = 'master';
    }

    this.selectedTable = "left";
    this.load();
    this.parent = this;

  }

  GetTableClass(table: string) {
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

  singleSelect(item: Item) {
    if (item.IsSelected) {
      item.IsSelected = false;
      return;
    }

    if (this.selectedTable == "left") {

      this.leftData.Children.forEach(function (it) { it.IsSelected = false; });
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = false; });
    }

    item.IsSelected = true;
  }

  selectAll() {
    if (this.selectedTable == "left") {

      this.leftData.Children.forEach(function (it) { it.IsSelected = true; });
    }
    else {
      this.rightData.Children.forEach(function (it) { it.IsSelected = true; });
    }
  }

  openInputDialog(dialogAction: string) {

    this.dialogService.open(this.simpleInputRef);
    this.inputAction = dialogAction;

    if (dialogAction == 'singleCopy') {
      this.singleInputTitle = 'Copy';
      this.singleInputText = 'New item\'s name';
    } else if (dialogAction == 'addFolder') {
      this.singleInputTitle = 'Add Folder';
      this.singleInputText = 'New folder\'s name';
    } else if (dialogAction == 'search') {
      this.singleInputTitle = 'Search';
      this.singleInputText = 'Enter a keyword...';
    }
  }

  openConfirmDialog(dialogAction: string) {
    if (this.showWarning()) {
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
    }
  }

  singleInputAction() {
    if (this.inputAction == 'addFolder') {
      this.addFolder();
    } else if (this.inputAction == 'singleCopy') {
      this.singleCopy();
    } else if (this.inputAction == 'search') {
      this.search();
    }
  }

  search() {
    this.leftLoading = true;
    this.itemCommanderService.search(this.inputDialogValue, this.selectedDatabase).subscribe({
      next: response => {
        this.leftData = response as ItemCommanderResponse;
        this.leftPath = this.inputDialogValue;
        this.leftLoading = false;
      },
    })
  }
  move() {
    let moveRequest = new CopyRequest();
    if (this.selectedTable == 'left') {
      //taget a right
      moveRequest.TargetPath = this.rightData.CurrentPath;

      moveRequest.Items = this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }
    else {
      moveRequest.TargetPath = this.leftData.CurrentPath;
      moveRequest.Items = this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }

    this.itemCommanderService.moveItems(moveRequest, this.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
        }
      }
    );
  }

  showWarning() {
    if (this.selectedTable == 'left') {

      return this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
    else {
      return this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
  }

  downloadAsPackage() {
    let moveRequest = new PackageRequest();
    if (this.selectedTable == 'left') {
      moveRequest.Items = this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }
    else {
      moveRequest.Items = this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }

    this.itemCommanderService.packageItems(moveRequest, this.selectedDatabase).subscribe({
      next: fileName => {
        console.log(fileName);
        let theFile = '/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/download?fileName=' + (fileName as DownloadResponse).FileName;
        window.open(theFile);
      }
    });
  }

  copyRequest: CopyRequest;
  copy() {
    this.copyRequest = new CopyRequest();

    if (this.selectedTable == 'left') {
      //taget a right
      this.copyRequest.TargetPath = this.rightData.CurrentPath;

      this.copyRequest.Items = this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }
    else {
      this.copyRequest.TargetPath = this.leftData.CurrentPath;
      this.copyRequest.Items = this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }

    if (this.copyRequest.Items.length == 1) {
      this.openInputDialog('singleCopy');
    }
    else {
      this.openConfirmDialog('multipleCopy');
    }
  }

  onSearchChange(searchValue: string) {
    this.inputDialogValue = searchValue
  }

  multipleCopy() {
    console.log(this.copyRequest);
    this.itemCommanderService.copyItems(this.copyRequest, this.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.leftData.CurrentId);
          this.loadRightItems(this.rightData.CurrentId);
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
      }
    });
  }

  addFolder() {
    let contract = new FolderRequest();
    contract.TargetPath = this.getTargetPathForFolder();
    contract.Name = this.parent.inputDialogValue;
    this.itemCommanderService.addFolder(contract, this.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
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

    if (this.selectedTable == 'left') {
      //taget a right
      deleteRequest.Items = this.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }
    else {
      deleteRequest.Items = this.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id });
    }

    this.itemCommanderService.deleteItems(deleteRequest, this.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.leftData.CurrentId);
        this.loadRightItems(this.rightData.CurrentId);
        this.dialogService.close();
      }
    });
  }

  loadLeftItems(id: string) {
    this.leftLoading = true;
    this.itemCommanderService.fetchItems(id, this.selectedDatabase).subscribe({
      next: response => {
        this.leftData = response as ItemCommanderResponse;
        this.leftPath = this.leftData.CurrentPath;
        this.leftLoading = false;
      },
      error: error => { }
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
      error: error => { }
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
      this.loadLeftItems(this.leftData.ParentId);
    }
    else {
      this.loadRightItems(this.rightData.ParentId);
    }
  }

  onRightClick(item: Item) {
    if (item.IsSelected) {
      item.IsSelected = false;
    }
    else {
      item.IsSelected = true;
    }
    return false;
  }

  leftDoubleClick(item: Item) {
    this.loadLeftItems(item.Id);
  }

  rightDoubleClick(item: Item) {
    this.loadRightItems(item.Id);

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
}
