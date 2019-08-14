import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { CommanderSettings } from '../../model/CommanderSettings';
import { Item } from '../../contract/Item';
import { ItemCommanderService } from '../../item-commander.service';
import { ItemCommanderResponse } from '../../contract/ItemCommanderResponse';
import { FastViewService } from '../../fast-view/fastview.service';

@Component({
  selector: 'sc-app-commander-view',
  templateUrl: './commander-view.component.html',
  styleUrls: ['./commander-view.component.scss']
})
export class CommanderViewComponent implements OnInit {
  @Input()
  side: any;

  @Input()
  commanderSettings: CommanderSettings;

  @Output() onError: EventEmitter<any> = new EventEmitter();

  isLoading = true;
  downSelector: boolean;
  leftIdBeforeSearch: string;
  loadedItems: any;

  constructor(private itemCommanderApiService: ItemCommanderService,
    private fastViewService: FastViewService) { }

  ngOnInit() {
    this.load();
  }

  load() {
    if (this.side == 'left') {
      this.loadLeftItems('11111111-1111-1111-1111-111111111111');
    }
    else {
      this.loadRightItems('11111111-1111-1111-1111-111111111111');
    }
  }

  loadLeftItems(id: string) {
    // Search has no id
    if (id == '') {
      return;
    }

    this.isLoading = true;
    this.itemCommanderApiService.fetchItems(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.commanderSettings.leftData = response as ItemCommanderResponse;
        this.commanderSettings.leftPath = this.commanderSettings.leftData.CurrentPath;
        this.isLoading = false;
      },
      error: response => {
        this.onError.emit(response);
      }
    });
  }

  loadRightItems(id: string) {
    this.isLoading = true;
    this.itemCommanderApiService.fetchItems(id, this.commanderSettings.selectedDatabase).subscribe({
      next: response => {
        this.commanderSettings.rightData = response as ItemCommanderResponse;
        this.commanderSettings.rightPath = this.commanderSettings.rightData.CurrentPath;
        this.isLoading = false;
      },
      error: response => {
        this.onError.emit(response);
      }
    });
  }

  getTableClass(table: string) {
    return this.commanderSettings.selectedTable == table ? "table-selected" : "table-not-selected";
  }

  getSelectedOptions() {
    return this.commanderSettings.options
      .filter((opt: any) => opt.checked);
  }

  getClass(item: Item) {
    if (item.IsSelected) {
      return "selectedItem";
    }
    return "";
  }

  showColumn(columnName: string) {
    return this.commanderSettings.options.filter((opt: any) => opt.value == columnName && opt.checked).length > 0;
  }

  tableSelect(table: string) {
    this.commanderSettings.selectedTable = table;
  }

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

  onRightClick(item: Item) {
    return false;
  }

  doubleClick(item: Item) {
    // if(!item.HasChildren){
    //   return;
    // }

    if (this.side == 'left') {
      this.loadLeftItems(item.Id);
    }
    else {
      this.loadRightItems(item.Id);
    }
  }


  loadParent(side: string) {
    if (side == "left") {

      if (this.commanderSettings.leftData.ParentId == '{00000000-0000-0000-0000-000000000000}') {
        return;
      }

      if (this.commanderSettings.leftData.ParentId == null) {
        this.loadLeftItems(this.commanderSettings.leftIdBeforeSearch);
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

  singleSelect(item: Item) {
    if (item.IsSelected) {
      item.IsSelected = false;
      this.commanderSettings.selectedItem = undefined;
      return;
    }

    if (this.commanderSettings.fastViewEnabled) {
      this.fastViewService.search.emit(item.Id);
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
}
