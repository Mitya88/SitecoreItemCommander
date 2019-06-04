export class CopyRequest{
    TargetPath:string;
    Items:Array<string>;
}

export class CopySingle{
    TargetPath:string;
    Item: string;
    Name:string;
}

export class MoveRequest{
    TargetPath:string;
    Items:Array<string>;
}

export class DeleteRequest{
    Items:Array<string>;
}
export class LockRequest{
    Lock:boolean;
    Items:Array<string>;
}
export class FolderRequest{
    TargetPath:string;
    Name:string;
    TemplateId:string;
}

export class PackageRequest{
    Items:Array<string>;
}


export class GetItemRequest{
    Items:Array<string>;
    RawValue:string;
}

export class DownloadResponse{
    FileName:string;
}