import { BaseRequest } from "./baseRequest";

export class GetItemRequest extends BaseRequest{
    Items:Array<string>;
    RawValue:string;
}