import { Item } from "./Item";

export interface ItemCommanderResponse {
    CurrentPath: string;
    ParentId:string;
    Children: Array<Item>; 
    CurrentId: string;
}

