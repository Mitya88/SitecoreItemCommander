import { Injectable, Inject } from '@angular/core';
import { CommanderSettings } from '../model/CommanderSettings';
import { WebStorageService, LOCAL_STORAGE } from 'angular-webstorage-service';

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
}
