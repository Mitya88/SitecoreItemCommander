# Documentation

The documentation for Item Commander Application

The purpose of the module is speeding up item manipulation in Sitecore.

### Features
The module has the following built in features

#### Commander View
Commander view gives file commander look to your Sitecore Content Tree. Left and right hand sided panels are added to the applications. 
You can navigate in your content tree by clicking on items in this view. 
- Current path is displayed above the panel
- You can go deeper in the tree by clicking on items.
- Single and Multiple selects are allowed (by right click)
- Database selection is allowed (which database's items are displayed in the commander view)
- Displayed columns are configurable (Show/Hide columns)
- Showing hidden items

All of the commander view settings are stored in browser's local storage, so you can continue your work where you left it. 

#### Item Manipulations
Several item manipulations are supported in the Item Commander.
- Copy (single and multiple)
- Move (single and multiple)
- Delete (single and multiple)
- Insert item (You can select inserted template based on the available insert options)
- Download items in Sitecore package (single and multiple)
- Lock and Unlock items (single and multiple)
- Search (you can search for item and apply any of the mentioned item manipulation)
- Open in Content Editor
- Open in Fast View


#### Fast View
Fast view allows you to check the selected item's fields. If multiple language is available for the selected item, then each language version's fields are displayed in a seperated tabls
- Hide standard fields from UI
- Copy values to clipboard

## Pre-requisites

- Sitecore 9.1

## Installation

Provide detailed instructions on how to install the module, and include screenshots where necessary.

1. Use the Sitecore Installation wizard to install the [package](sc.package/ContentEditorToolbox.zip)
2. Make sure if your search indexes are working correctly
3. Go the LaunchPad and open the Item Commander.

## Configuration

The module does not require any configuration, configuration files are using the proper Server Roles. (Standalone or Content Management)
The package contains a configuration patch, which   sets the "Sitecore.Services.SecurityPolicy" to "ServicesOnPolicy" - it is required for the Speak application.



