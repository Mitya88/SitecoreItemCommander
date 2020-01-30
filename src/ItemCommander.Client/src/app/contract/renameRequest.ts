import { BaseRequest } from "./baseRequest";

export class RenameRequest extends BaseRequest{
    Items:Array<string>;
    NameOrPattern: string;
}