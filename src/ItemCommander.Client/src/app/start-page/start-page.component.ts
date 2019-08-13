import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ItemCommanderService } from '../item-commander.service';
import { Item } from '../contract/Item';
import { CopyRequest } from '../contract/copyRequest';
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
import { CommanderViewComponent } from '../components/commander-view/commander-view.component';
import { RenameRequest } from '../contract/renameRequest';
import { PackageRequest } from '../contract/packageRequest';
import { DownloadResponse } from '../contract/downloadResponse';
import { CopySingle } from '../contract/copysingle';
import { DeleteRequest } from '../contract/deleteRequest';
import { LockRequest } from '../contract/lockRequest';
import { FolderRequest } from '../contract/folderRequest';

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

  @ViewChild('leftview')
  private leftView: CommanderViewComponent;

  @ViewChild('rightview')
  private rightView: CommanderViewComponent;

  constructor(
    private itemCommanderApiService: ItemCommanderService,
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
  left = 'left';
  right = 'right';

  parent: any;

  commanderSettings: CommanderSettings;
  popupSettings: PopupSettings;

  selectText = Constants.SelectText;
  copyRequest: CopyRequest;
  downSelector: boolean;
  selectedInsertOptions: any;
  editorOptions: any;

  ngOnInit() {
    this.commanderSettings = this.itemService.getCommanderSettings();
    this.popupSettings = new PopupSettings();
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
    this.leftView.load();
    this.rightView.load();
  }

  fastViewSearch() {
    let data = this.itemService.getSelectedItems(this.commanderSettings);
    if (data.length > 0 && this.commanderSettings.fastViewEnabled) {
      this.fastviewService.search.emit(data[0].Id);
      return;
    }
  }

  singleSelect(item: Item) {
    if (item.IsSelected) {
      item.IsSelected = false;
      this.commanderSettings.selectedItem = undefined;
      return;
    }

    if (this.commanderSettings.fastViewEnabled) {
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

  selectAll() {
    this.selectText = this.itemService.selectAll(this.selectText, this.commanderSettings);
  }

  openInputDialog(dialogAction: string) {
    this.popupService.openInputDialog(dialogAction, this.simpleInputRef, this.popupSettings);
  }

  openConfirmDialog(dialogAction: string) {
    if (this.popupService.checkAndOpenWarning(this.warningRef, this.popupSettings, this.commanderSettings)) {
      return;
    }

    this.itemService.getSelectedItems(this.commanderSettings);
    if (!this.commanderSettings.selectedItem) {
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
      this.parent.popupSettings.confirmTitle = Constants.ItemMovingConfirmationTitle;
      this.parent.popupSettings.confirmText = Constants.ItemMovingConfirmationText;
    } else if (this.popupSettings.confirmAction == 'delete') {
      this.parent.popupSettings.confirmTitle = Constants.ItemDeletingConfirmationTitle;
      this.parent.popupSettings.confirmText = Constants.ItemDeletingConfirmationText;

      var hasChildren = this.itemService.getSelectedItems(this.commanderSettings).filter(function (t) { return t.HasChildren }).length > 0;

      if (hasChildren) {
        this.parent.popupSettings.confirmText += Constants.ItemDeletingWithChildren;
      }
    } else if (this.popupSettings.confirmAction == 'lock') {
      this.parent.popupSettings.confirmTitle = Constants.ItemLockConfirmationTitle;
      this.parent.popupSettings.confirmText = Constants.ItemLockConfirmationText;
    } else if (this.popupSettings.confirmAction == 'unlock') {
      this.parent.popupSettings.confirmTitle = Constants.ItemUnlockConfirmationTitle;
      this.parent.popupSettings.confirmText = Constants.ItemUnlockConfirmationText;
    } else if (this.popupSettings.confirmAction == 'multipleCopy') {
      this.parent.popupSettings.confirmTitle = Constants.ItemCopyConfirmationTitle;
      this.parent.popupSettings.confirmText = Constants.ItemCopyConfirmationText;
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
    } else if (this.popupSettings.confirmAction == 'unlock') {
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

  search() {
    this.leftLoading = true;
    this.leftIdBeforeSearch = this.commanderSettings.leftData.CurrentId;
    this.itemCommanderApiService.search(this.popupSettings.inputDialogValue, this.commanderSettings.selectedDatabase).subscribe({
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

    this.itemCommanderApiService.rename(request, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
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

    this.itemCommanderApiService.moveItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
          this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
          this.dialogService.close();
        },
        error: response => {
          this.handleError(response);
        }
      }
    );
  }

  downloadAsPackage() {
    if (this.popupService.checkAndOpenWarning(this.warningRef, this.popupSettings, this.commanderSettings)) {
      return;
    }

    let moveRequest = new PackageRequest();

    moveRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderApiService.packageItems(moveRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: fileName => {
        let theFile = '/sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/download?fileName=' + (fileName as DownloadResponse).FileName;
        window.open(theFile);
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  copy() {
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
    this.itemCommanderApiService.copyItems(this.copyRequest, this.commanderSettings.selectedDatabase).subscribe(
      {
        next: response => {
          this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
          this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
          this.dialogService.close();
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
    this.itemCommanderApiService.copySingleItem(contract, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  delete() {
    let deleteRequest = new DeleteRequest();
    deleteRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderApiService.deleteItems(deleteRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  lock(lock: boolean) {
    let lockRequest = new LockRequest();
    lockRequest.Lock = lock;
    lockRequest.Items = this.itemService.getSelectedItems(this.commanderSettings).map(function (it) { return it.Id });

    this.itemCommanderApiService.lockItems(lockRequest, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
        this.dialogService.close();
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  openFastView(item: Item) {
    this.router.navigateByUrl('/fastview?itemid=' + item.Id);
  }

  openInsertOptions() {
    var id = '';
    if (this.commanderSettings.selectedTable == 'left') {
      id = this.commanderSettings.leftData.CurrentId;
    }
    else {
      id = this.commanderSettings.rightData.CurrentId;
    }
    this.itemCommanderApiService.insertOptions(id, this.commanderSettings.selectedDatabase).subscribe({
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
    contract.TargetPath = this.itemService.getTargetPathForFolder(this.commanderSettings);
    contract.Name = this.parent.popupSettings.inputDialogValue;
    contract.TemplateId = this.selectedInsertOptions;
    this.itemCommanderApiService.addFolder(contract, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
        this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
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
      this.leftView.loadLeftItems(this.commanderSettings.leftData.CurrentId);
    }
    else {
      this.rightView.loadRightItems(this.commanderSettings.rightData.CurrentId);
    }
  }

  loadEditorOptions() {
    if (this.popupService.checkAndOpenWarning(this.warningRef, this.popupSettings, this.commanderSettings)) {
      return;
    }

    this.itemCommanderApiService.editoroptions(this.commanderSettings.selectedItem.Id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.editorOptions = response;
      },
      error: response => {
        this.handleError(response);
      }
    });
  }

  showHiddenItems() {
    this.itemService.saveCommanderSettings(this.commanderSettings);
  }
}
