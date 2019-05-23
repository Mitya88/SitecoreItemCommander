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

export class FolderRequest{
    TargetPath:string;
    Name:string;
}