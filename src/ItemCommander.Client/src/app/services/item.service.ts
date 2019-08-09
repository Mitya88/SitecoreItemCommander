import { Injectable, Inject } from '@angular/core';
import { CommanderSettings } from '../model/CommanderSettings';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';
import { Item } from '../contract/Item';
import { Constants } from '../constants';

@Injectable()
export class ItemService {

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService) { }
 

  getCommanderSettings():CommanderSettings{
    let commanderSettings = new CommanderSettings();
    commanderSettings.hiddenItems = this.storage.get('hiddenitems');
    commanderSettings.selectedDatabase = this.storage.get('database');
    commanderSettings.bookmarks = this.storage.get('bookmarks');

    if(!commanderSettings.bookmarks){
      commanderSettings.bookmarks = [];
    }

    let storedOptions = this.storage.get('options');
    if(storedOptions){
      commanderSettings.options = storedOptions;
    }

    if (!commanderSettings.selectedDatabase) {
      commanderSettings.selectedDatabase = 'master';
    }

    commanderSettings.selectedTable = "left";

    return commanderSettings;
  }

  saveCommanderSettings(commanderSettings: CommanderSettings){
    this.storage.set('options', commanderSettings.options);
    this.storage.set('hiddenitems', commanderSettings.hiddenItems);
    this.storage.set('database', commanderSettings.selectedDatabase);
    this.storage.set('bookmarks', commanderSettings.bookmarks)
  }

  hasSelectedItem(commanderSettings:CommanderSettings) : boolean{
    if(!commanderSettings.selectedItem){
      return false;
    }

    if (commanderSettings.selectedTable == 'left') {
      return commanderSettings.leftData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
    else {
      return commanderSettings.rightData.Children.filter(it => it.IsSelected).map(function (it) { return it.Id }).length == 0;
    }
  }

  getSelectedItems(commanderSettings: CommanderSettings) : Item[] {
    if (commanderSettings.selectedTable == 'left') {
      //target a right
      commanderSettings.targetPath = commanderSettings.rightData.CurrentPath;

      return commanderSettings.leftData.Children.filter(it => it.IsSelected);
    }
    else {
      commanderSettings.targetPath = commanderSettings.leftData.CurrentPath;
      return commanderSettings.rightData.Children.filter(it => it.IsSelected);
    }
  }

  selectAll(selectText:string, commanderSettings:CommanderSettings):string {
    let selectValue = false;
    if (selectText == Constants.SelectText) {
      selectValue = true;
      selectText = Constants.DeselectText;
    }
    else {
      selectText = Constants.SelectText;
      selectValue = false;
      commanderSettings.selectedItem = undefined;
    }

    if (commanderSettings.selectedTable == "left") {
      commanderSettings.leftData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if (selectValue) {
        commanderSettings.selectedItem = commanderSettings.leftData.Children[0];
      }
    }
    else {
      commanderSettings.rightData.Children.forEach(function (it) { it.IsSelected = selectValue; });
      if (selectValue) {
        commanderSettings.selectedItem = commanderSettings.rightData.Children[0];
      }
    }

    return selectText;
  }

  getTargetPathForFolder(commanderSettings: CommanderSettings):string {
    if (commanderSettings.selectedTable == 'left') {
      //taget a right
      return commanderSettings.leftData.CurrentPath;
    }
    else {
      return commanderSettings.rightData.CurrentPath;
    }
  }
}
