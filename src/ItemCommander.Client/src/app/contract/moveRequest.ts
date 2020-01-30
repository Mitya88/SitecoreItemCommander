import { BaseRequest } from "./baseRequest";

export class MoveRequest extends BaseRequest{
    TargetPath:string;
    Items:Array<string>;
}