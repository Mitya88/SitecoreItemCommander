import { Item } from "./Item";

export interface ItemCommanderResponse {
    CurrentPath: string;
    ParentId:string;
    Children: Array<Item>; 
    CurrentId: string;
}



export interface FieldDto
{
    Id:String;
    Name:string;
    Value:string;
    Type:string;
    SectionName:string;
}
