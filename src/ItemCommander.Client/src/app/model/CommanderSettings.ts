import { Item } from "../contract/Item";
import { ItemCommanderResponse } from "../contract/ItemCommanderResponse";

export class CommanderSettings {
    databases: Array<string>;
    selectedDatabase: string;
    bookmarks: Array<any>;
    selectedTable: string;
    selectedItem?: Item;
    hiddenItems: any;
    insertOptions: Array<Item>;
    options: any;
    leftPath: string;
    rightPath: string;
    leftData: ItemCommanderResponse;
    rightData: ItemCommanderResponse;

    constructor() {
        this.options = [
            { name: 'Name', value: 'name', checked: true },
            { name: 'SitecorePath', value: 'sitecorepath', checked: false },
            { name: 'TemplateName', value: 'templatename', checked: true },
            { name: 'Created', value: 'created', checked: false },
            { name: 'LastModified', value: 'lastmodified', checked: true },
            { name: 'HasChildren', value: 'haschildren', checked: true }
        ];
        this.databases = ['master', 'core', 'web'];
    }
}