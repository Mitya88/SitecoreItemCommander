import { Item } from "../contract/Item";

export class CommanderSettings{
    databases:Array<string>;
    selectedDatabase:string;
    bookmarks:Array<any>;
    selectedTable:string;
    selectedItem?:Item;
    hiddenItems:any;
    insertOptions:Array<Item>;
    options:any;

    constructor(){
        this.options = [
            { name: 'Name', value: 'name', checked: true },
            { name: 'SitecorePath', value: 'sitecorepath', checked: false },
            { name: 'TemplateName', value: 'templatename', checked: true },
            { name: 'Created', value: 'created', checked: false },
            { name: 'LastModified', value: 'lastmodified', checked: true },
            { name: 'HasChildren', value: 'haschildren', checked: true }
          ];
          this.databases  = ['master', 'core', 'web'];
    }
}