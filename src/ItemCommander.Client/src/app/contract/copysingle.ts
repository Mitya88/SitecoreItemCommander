import { BaseRequest } from "./baseRequest";

export class CopySingle extends BaseRequest{
    TargetPath:string;
    Item: string;
    Name:string;
    CopySubItems:boolean;
}