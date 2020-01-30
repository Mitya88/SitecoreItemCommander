import { BaseRequest } from "./baseRequest";

export class CopyRequest extends BaseRequest {
    TargetPath:string;
    Items:Array<string>;
}