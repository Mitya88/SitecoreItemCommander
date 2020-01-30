import { BaseRequest } from "./baseRequest";

export class LockRequest extends BaseRequest{
    Lock:boolean;
    Items:Array<string>;
}