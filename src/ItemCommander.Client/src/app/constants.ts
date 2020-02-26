export class  Constants{
    static Title = "Hello";
    static SelectText = "Select";
    static DeselectText = "Deselect";

    static NewItemText = "New item\'s name";
    static CopyDialogTitle = "Copy Item To";
    static CopySingleItem = "(Children items will not be copied)";

    static SearchDialogTitle = "Search";
    static SearchInputText = "Enter a keyword..";

    static RenameDialogTitle = "Rename";
    static RenameText = "New item name format";
    static RenameDescription = "Available tokens:<br>{C} - counter<br>{OldName} - old name of the item<br>{yyyy} - year<br>{MM} - month<br>{dd} - day<br>{hh} - hour<br>{mm} - minutes<br>{ss} - seconds";

    static NoItemWarningText = "There is no selected item";
    static NoItemWarningTitle = "Invalid selected item";

    static ItemMovingError = "You cannot move item into itself";
    static ItemMovingErrorTitle = "Item cannot be moved!";

    static ItemMovingConfirmationTitle="Move";
    static ItemMovingConfirmationText = "Are you sure you want to move the selected item(s)?";

    static ItemDeletingConfirmationTitle="Delete";
    static ItemDeletingConfirmationText = "Are you sure you want to delete the selected item(s)?";
    static ItemDeletingWithChildren=" (Children items will also be deleted)";

    
    static ItemLockConfirmationTitle="Lock";
    static ItemLockConfirmationText = "Are you sure you want to lock selected item(s)?";

    static ItemCopyConfirmationTitle="Copy Item To";
    static ItemCopyConfirmationText = "Are you sure you want to copy the selected items?";

    
    static ItemUnlockConfirmationTitle="Unlock";
    static ItemUnlockConfirmationText = "Are you sure you want to unlock the selected item(s)?";

    static SelectATemplateText = "Select a template you want to use. In the Item Name field, enter a name for the new item.";
}
