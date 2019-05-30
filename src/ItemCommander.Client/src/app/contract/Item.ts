export interface Item {
    Id: string;
    Name: string;
    Language:string;
    Path:string; 
    Icon: string;
    TemplateId:string;
    TemplateName: string;
    HasChildren: boolean;
    LastModified: string;
    
    Created: string;
    ParentId:string;
    IsSelected: boolean;
    IsHidden: boolean;
    IsLocked:boolean;
}