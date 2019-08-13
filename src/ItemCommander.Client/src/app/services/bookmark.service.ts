import { Injectable } from '@angular/core';
import { ItemService } from './item.service';
import { CommanderSettings } from '../model/CommanderSettings';

@Injectable()
export class BookmarkService {

  constructor(private itemService: ItemService) { }


  checkBookmark(pathData: any, commanderSettings: CommanderSettings): boolean {
    if (commanderSettings.bookmarks.length == 0 || !pathData) {
      return false;
    }

    let data = commanderSettings.bookmarks.filter(item => item.Path == pathData.CurrentPath);

    return data.length > 0;
  }

  bookmark(pathData: any, commanderSettings: CommanderSettings): void {
    commanderSettings.bookmarks.push({ Path: pathData.CurrentPath, Id: pathData.CurrentId });
    this.itemService.saveCommanderSettings(commanderSettings);
  }

  unbookmark(pathData: any, commanderSettings: CommanderSettings): void {
    commanderSettings.bookmarks = commanderSettings.bookmarks.filter(item => item.Path !== pathData.CurrentPath)
    this.itemService.saveCommanderSettings(commanderSettings);
  }
}
