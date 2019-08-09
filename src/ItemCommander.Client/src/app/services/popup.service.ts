import { Injectable, TemplateRef } from '@angular/core';
import { ScDialogService } from '@speak/ng-bcl/dialog';
import { PopupSettings } from '../model/PopupSettings';
import { Constants } from '../constants';
import { ItemService } from './item.service';
import { CommanderSettings } from '../model/CommanderSettings';

@Injectable()
export class PopupService {

  constructor(private dialogService: ScDialogService, private itemService: ItemService) { }
 

  openInputDialog(dialogAction: string, simpleInputRef:  TemplateRef<any>, popupSettings: PopupSettings) {
    this.dialogService.open(simpleInputRef);
    popupSettings.inputAction = dialogAction;

    if (dialogAction == 'singleCopy') {
      popupSettings.singleInputTitle = Constants.CopyDialogTitle;
      popupSettings.singleInputText = Constants.NewItemText;
    }
    else if (dialogAction == 'search') {
      popupSettings.singleInputTitle = Constants.SearchDialogTitle;
      popupSettings.singleInputText = Constants.SearchInputText;
    }
    else if (dialogAction == 'rename') {
      popupSettings.singleInputTitle = Constants.RenameDialogTitle;
      popupSettings.singleInputText = Constants.RenameText;
    }
  }

  checkAndOpenWarning(warningRef:  TemplateRef<any>, popupSettings:PopupSettings, commanderSettings:CommanderSettings) :boolean{
    if (this.itemService.hasSelectedItem(commanderSettings) || !commanderSettings.selectedItem) {
      popupSettings.warningText = Constants.NoItemWarningText;
      popupSettings.warningTitle = Constants.NoItemWarningTitle;
      this.dialogService.open(warningRef);
      return true;
    }

    return false;
  }
  
}
