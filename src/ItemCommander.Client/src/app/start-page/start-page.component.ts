import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest, CopySingle, DeleteRequest, FolderRequest, PackageRequest, DownloadResponse, LockRequest, RenameRequest } from '../contract/copyRequest';
import { ItemCommanderResponse } from '../contract/ItemCommanderResponse';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ScDialogService } from '@speak/ng-bcl/dialog';
import { Router } from '@angular/router';
import { FastViewService } from '../fast-view/fastview.service';
import { Constants } from '../constants';
import { ItemService } from '../services/item.service';
import { CommanderSettings } from '../model/CommanderSettings';
import { BookmarkService } from '../services/bookmark.service';
import { PopupSettings } from '../model/PopupSettings';
import { PopupService } from '../services/popup.service';

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

  constructor(
    private itemCommanderService: ItemCommanderService,
    public logoutService: SciLogoutService,
    public dialogService: ScDialogService,
    private router: Router,
    private fastviewService: FastViewService,
    private itemService: ItemService,
    private bookmarkService: BookmarkService,
    private popupService: PopupService
  ) { }

  leftIdBeforeSearch: string;
  isSearching: boolean;
  leftLoading: boolean;
  rightLoading: boolean;  

  parent: any;

  commanderSettings: CommanderSettings;
  popupSettings: PopupSettings;

  ngOnInit() {
    this.commanderSettings = this.itemService.getCommanderSettings();
    this.popupSettings = new PopupSettings();
    this.load();
    this.parent = this;
  }

  getTableClass(table: string) {
    return this.commanderSettings.selectedTable == table ? "table-selected" : "table-not-selected";
  }

  changeDatabase() {
    this.itemService.saveCommanderSettings(this.commanderSettings);
    this.load();
  }

  tableSelect(table: string) {
    this.commanderSettings.selectedTable = table;
  }

  load() {
    this.loadLeftItems('11111111-1111-1111-1111-111111111111');
    this.loadRightItems('11111111-1111-1111-1111-111111111111');
  }

  fastViewSearch() {
    let data = this.itemService.getSelectedItems(this.commanderSettings);
    if (data.length > 0) {
      if (this.fastViewEnabled) {
        var id = data[0].Id
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

    if (this.fastViewEnabled) {
      this.fastviewService.search.emit(item.Id);
      return;
    }

    if (this.commanderSettings.selectedTable == "left") {
      this.commanderSettings.leftData.Children.forEach(function (it) { it.IsSelected = false; });
    }
    else {
      this.commanderSettings.rightData.Children.forEach(function (it) { it.IsSelected = false; });
    }

    item.IsSelected = true;
    this.commanderSettings.selectedItem = item;
  }

  selectText = Constants.SelectText;
  selectAll() {    
    this.selectText = this.itemService.selectAll(this.selectText, this.commanderSettings);
  }

  openInputDialog(dialogAction: string) {
    this.popupService.openInputDialog(dialogAction, this.simpleInputRef, this.popupSettings);
  }

  openConfirmDialog(dialogAction: string) {
    if (this.popupService.checkAndOpenWarning(this.warningRef, this.popupSettings, this.commanderSettings)){
      return;
    }

    this.itemService.getSelectedItems(this.commanderSettings);
    if(!this.commanderSettings.selectedItem){
      return;
    }
    if (dialogAction == 'move' && (this.commanderSettings.selectedItem.Path == this.commanderSettings.targetPath || this.commanderSettings.targetPath.startsWith(this.commanderSettings.selectedItem.Path))) {
      this.popupSettings.warningText = Constants.ItemMovingError;
      this.popupSettings.warningTitle = Constants.ItemMovingErrorTitle;
      this.dialogService.open(this.warningRef);
      return;
    }


    this.dialogService.open(this.confirmDialog);
    this.popupSettings.confirmAction = dialogAction;

    if (this.popupSettings.confirmAction == 'copy') {
      this.copy();
    } else if (this.popupSettings.confirmAction == 'move') {
      this.parent.confirmTitle = Constants.ItemMovingConfirmationTitle;
      this.parent.confirmText = Constants.ItemMovingConfirmationText;
    } else if (this.popupSettings.confirmAction == 'delete') {
      this.parent.confirmTitle = Constants.ItemDeletingConfirmationTitle;
      this.parent.confirmText = Constants.ItemDeletingConfirmationText;

      var hasChildren = this.itemService.getSelectedItems(this.commanderSettings).filter(function (t) { return t.HasChildren }).length > 0;

      if (hasChildren) {
        this.parent.confirmText += Constants.ItemDeletingWithChildren;
      }
    } else if (this.popupSettings.confirmAction == 'lock') {
      this.parent.confirmTitle = Constants.ItemLockConfirmationTitle;
      this.parent.confirmText = Constants.ItemLockConfirmationText;
    } else if (this.popupSettings.confirmAction == 'unlock') {
      this.parent.confirmTitle = Constants.ItemUnlockConfirmationTitle;
      this.parent.confirmText = Constants.ItemUnlockConfirmationText;
    }

  }

  Action() {
    if (this.popupSettings.confirmAction == 'copy') {
      this.copy();
    } else if (this.popupSettings.confirmAction == 'move') {
      this.move();
    } else if (this.popupSettings.confirmAction == 'delete') {
      this.delete();
    } else if (this.popupSettings.confirmAction == 'multipleCopy') {
      this.multipleCopy();
    } else if (this.popupSettings.confirmAction == 'lock') {
      this.lock(true);
    }
    else if (this.popupSettings.confirmAction == 'unlock') {
      this.lock(false);
    }
  }

  singleInputAction() {
    if (this.popupSettings.inputAction == 'singleCopy') {
      this.singleCopy();
    } else if (this.popupSettings.inputAction == 'search') {
      this.search();
    }
    else if (this.popupSettings.inputAction == 'rename') {
      this.rename();
    }
  }

  fastView() {

    if (this.fastViewEnabled) {
      this.fastViewEnabled = false;
    }
    else {
      this.fastViewEnabled = true;
    }
  }  

  search() {
    this.leftLoading = true;
    this.leftIdBeforeSearch = this.commanderSettings.leftData.CurrentId;
    this.itemCommanderService.search(this.popupSettings.inputDialogValue, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.commanderSettings.leftData = response as ItemCommanderResponse;
        this.commanderSettings.leftPath = this.popupSettings.inputDialogValue;
        this.leftLoading = false;
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    })
  }

  rename() {

    let request = new RenameRequest();
    request.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    request.NameOrPattern = this.popupSettings.inputDialogValue

    this.itemCommanderService.rename(request, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    })
  }

  move() {
    let moveRequest = new CopyRequest();
    moveRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });
    moveRequest.TargetPath = this.commanderSettings.targetPath;

    this.itemCommanderService.moveItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
          this.loadRightItems(this.commanderSettings.rightData.CurrentId);
          this.dialogService.close();
        },
        error: response => {
          this.handleError(response);
        }
      }
    );
  }

 

  downloadAsPackage() {
    if (this.itemService.hasSelectedItem(this.commanderSettings)) {
      this.popupSettings.warningText = Constants.NoItemWarningText;
      this.popupSettings.warningTitle = Constants.NoItemWarningTitle;
      this.dialogService.open(this.warningRef);
      return;
    }
    let moveRequest = new PackageRequest();

    moveRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderService.packageItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: fileName => {
        let theFile = '/sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/download?fileName=' + (fileName as DownloadResponse).FileName;
        window.open(theFile);
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  copyRequest: CopyRequest;
  copy() {

    if (!this.commanderSettings.selectedItem) {
      return;
    }
    this.copyRequest = new CopyRequest();
    this.copyRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });
    this.copyRequest.TargetPath = this.commanderSettings.targetPath;
    this.dialogService.close();
    if (this.copyRequest.Items.length == 1) {
      this.popupSettings.inputDialogValue = this.commanderSettings.selectedItem.Name;
      this.openInputDialog('singleCopy');
    }
    else {
      this.popupSettings.warningTitle = Constants.ItemCopyConfirmationTitle
      this.popupSettings.warningText = Constants.ItemCopyConfirmationText;
      this.openConfirmDialog('multipleCopy');
    }
  }

  multipleCopy() {
    this.itemCommanderService.copyItems(this.copyRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
          this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        },
        error: response => {
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
        this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  getTargetPathForFolder() {
    if (this.commanderSettings.selectedTable == 'left') {
      //taget a right
      return this.commanderSettings.leftData.CurrentPath;
    }
    else {
      return this.commanderSettings.rightData.CurrentPath;
    }
  }

  delete() {

    let deleteRequest = new DeleteRequest();
    deleteRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderService.deleteItems(deleteRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  fastViewEnabled = false;

  lock(lock: boolean) {

    let lockRequest = new LockRequest();
    lockRequest.Lock = lock;
    lockRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderService.lockItems(lockRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
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
        this.commanderSettings.leftData = response as ItemCommanderResponse;
        this.commanderSettings.leftPath = this.commanderSettings.leftData.CurrentPath;
        this.leftLoading = false;
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  loadRightItems(id: string) {
    this.rightLoading = true;
    this.itemCommanderService.fetchItems(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.commanderSettings.rightData = response as ItemCommanderResponse;
        this.commanderSettings.rightPath = this.commanderSettings.rightData.CurrentPath;
        this.rightLoading = false;
      },
      error: response => {
        this.handleError(response);
      }
    });
  }


  downSelector: boolean;
  mouseDown(ev: any, item: Item) {
    if (ev.buttons == 2) {
      if (item.IsSelected && !this.downSelector) {
        item.IsSelected = false;
      }
      else if (!item.IsSelected && this.downSelector) {
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

  mouseDownSetup(ev: any, item: Item) {
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
      if (this.commanderSettings.leftData.ParentId == '{00000000-0000-0000-0000-000000000000}') {
        return;
      }

      if (this.commanderSettings.leftData.ParentId == null) {
        this.loadLeftItems(this.leftIdBeforeSearch);
        return;
      }
      this.loadLeftItems(this.commanderSettings.leftData.ParentId);
    }
    else {
      if (this.commanderSettings.rightData.ParentId == '{00000000-0000-0000-0000-000000000000}') {
        return;
      }
      this.loadRightItems(this.commanderSettings.rightData.ParentId);
    }
  }

  onRightClick(item: Item) {
    return false;
  }

  leftDoubleClick(item: Item) {
    this.loadLeftItems(item.Id);
  }

  rightDoubleClick(item: Item) {
    this.loadRightItems(item.Id);
  }

  openFastView(item: Item) {
    this.router.navigateByUrl('/fastview?itemid=' + item.Id);
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

  showHiddenItems(){
    this.itemService.saveCommanderSettings(this.commanderSettings);
  }

  showColumn(columnName: string) {
    return this.commanderSettings.options.filter((opt: any) => opt.value == columnName && opt.checked).length > 0;
  }
  getSelectedOptions() {
    return this.commanderSettings.options
      .filter((opt: any) => opt.checked);
  }

  selectedInsertOptions: any;
  openInsertOptions() {
    var id = '';
    if (this.commanderSettings.selectedTable == 'left') {
      id = this.commanderSettings.leftData.CurrentId;
    }
    else {
      id = this.commanderSettings.rightData.CurrentId;
    }
    this.itemCommanderService.insertOptions(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.commanderSettings.insertOptions = response as Array<Item>;
        this.dialogService.open(this.insertOptionRef);
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  createItem() {
    let contract = new FolderRequest();
    contract.TargetPath = this.getTargetPathForFolder();
    contract.Name = this.parent.inputDialogValue;
    contract.TemplateId = this.selectedInsertOptions;
    this.itemCommanderService.addFolder(contract, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  openContentEditor() {
    if (!this.commanderSettings.selectedItem) {
      return;
    }
    let url = '/sitecore/shell/Applications/Content%20Editor.aspx?fo=' + this.commanderSettings.selectedItem.Id;

    var win = window.open(url, '_blank');
    win.focus();
  }

  handleError(response: any) {

    if (response.error && response.error.InnerException) {
      this.dialogService.close();
      this.popupSettings.warningText = response.error.InnerException.ExceptionMessage;
      this.popupSettings.warningTitle = response.statusText;
      this.dialogService.open(this.warningRef);
      return;
    }

    if (response.error && response.error.ExceptionMessage) {
      this.dialogService.close();
      this.popupSettings.warningText = response.error.ExceptionMessage;
      this.popupSettings.warningTitle = response.statusText;
      this.dialogService.open(this.warningRef);
    }
  }

  checkBookmark(pathData: any): boolean {
    return this.bookmarkService.checkBookmark(pathData, this.commanderSettings);
  }

  bookmark(pathData: any): void {
    this.bookmarkService.bookmark(pathData, this.commanderSettings);
  }

  unbookmark(pathData: any): void {
    this.bookmarkService.unbookmark(pathData, this.commanderSettings);
  }

  loadBookmark(side: string, item: any) {
    if (side == 'left') {
      this.loadLeftItems(item.Id);
    }
    else {
      this.loadRightItems(item.Id);
    }
  }

  editorOptions: any;
  loadEditorOptions() {
    if (this.itemService.hasSelectedItem(this.commanderSettings) || !this.commanderSettings.selectedItem) {
      this.popupSettings.warningText = 'There is no selected item';
      this.popupSettings.warningTitle = 'Invalid selected item';
      this.dialogService.open(this.warningRef);
      return;
    }

    this.itemCommanderService.editoroptions(this.commanderSettings.selectedItem.Id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.editorOptions = response;
      },
      error: response => {
        this.handleError(response);
      }
    });
  }
}
