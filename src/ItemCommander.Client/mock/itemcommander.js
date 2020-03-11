module.exports = {
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/11111111-1111-1111-1111-111111111111/insertoptions': function (req, res) {
    res.json([
      {
        "Name": "Folder",
        "Path": "/sitecore/templates/Common/Folder",
        "Language": "en",
        "Icon": "https://via.placeholder.com/32x32",
        "TemplateName": "Template",
        "TemplateId": null,
        "ParentId": null,
        "HasChildren": true,
        "IsLocked": false,
        "LastModified": "2007-01-26T12:09:04Z",
        "Created": "0001-01-01T00:00:00Z",
        "IsHidden": false,
        "Fields": [

        ],
        "Id": "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
        "Url": null
      },
      {
        "Name": "Sample Item",
        "Path": "/sitecore/templates/Sample/Sample Item",
        "Language": "en",
        "Icon": "/temp/iconcache/applications/32x32/document.png",
        "TemplateName": "Template",
        "TemplateId": null,
        "ParentId": null,
        "HasChildren": true,
        "IsLocked": false,
        "LastModified": "2009-05-27T07:23:54.0205625Z",
        "Created": "2008-03-28T07:59:00Z",
        "IsHidden": false,
        "Fields": [

        ],
        "Id": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}",
        "Url": null
      },
      {
        "Name": "Folder",
        "Path": "/sitecore/templates/Common/Folder",
        "Language": "en",
        "Icon": "/temp/iconcache/applications/32x32/folder.png",
        "TemplateName": "Template",
        "TemplateId": null,
        "ParentId": null,
        "HasChildren": true,
        "IsLocked": false,
        "LastModified": "2007-01-26T12:09:04Z",
        "Created": "0001-01-01T00:00:00Z",
        "IsHidden": false,
        "Fields": [

        ],
        "Id": "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
        "Url": null
      }
    ])
  },
  'GET /sitecore/api/ssc/itemcommander/editoroptions': function (req, res) {
    res.json({"Languages":["en","ja-JP","de-DE","da"],"HasPresentation":true});
  },
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/search': function (req, res) {
    res.json({ "CurrentPath": null, "CurrentId": "", "ParentId": null, "Children": [{ "Name": "Home", "Path": "/sitecore/content/home", "Language": "ja-JP", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2018-06-04T03:44:00Z", "Created": "2018-06-04T03:44:00Z", "Fields": [], "Id": "{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}", "Url": null }, { "Name": "Home", "Path": "/sitecore/content/home", "Language": "da", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2018-06-04T03:38:00Z", "Created": "2018-06-04T03:38:00Z", "Fields": [], "Id": "{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}", "Url": null }, { "Name": "Home", "Path": "/sitecore/content/home/home", "Language": "en", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2015-11-09T08:30:00Z", "Created": "2008-04-07T10:59:00Z", "Fields": [], "Id": "{ED9B40AD-C41B-4FF3-9948-BD4BA38BE6E9}", "Url": null }, { "Name": "Home", "Path": "/sitecore/content/home/home", "Language": "ja-JP", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2018-06-04T03:44:00Z", "Created": "2018-06-04T03:44:00Z", "Fields": [], "Id": "{ED9B40AD-C41B-4FF3-9948-BD4BA38BE6E9}", "Url": null }, { "Name": "Home", "Path": "/sitecore/content/home/home", "Language": "da", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2018-06-04T03:38:00Z", "Created": "2018-06-04T03:38:00Z", "Fields": [], "Id": "{ED9B40AD-C41B-4FF3-9948-BD4BA38BE6E9}", "Url": null }, { "Name": "Home", "Path": "/sitecore/content/home", "Language": "en", "Icon": "/temp/iconcache/network/32x32/home.png", "TemplateName": "Sample Item", "TemplateId": null, "ParentId": null, "HasChildren": true, "IsLocked": false, "LastModified": "2019-05-27T15:12:00Z", "Created": "2008-04-07T10:59:00Z", "Fields": [], "Id": "{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}", "Url": null }] });
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/copysingle': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/copy': function (req, res) {
    res.json({"StatusId":"asd"});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/move': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/lock': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/folder': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/rename': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/package': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/delete': function (req, res) {
    res.json({});
  },
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/status': function (req, res) {
    res.json({"RemainingCount":5});
  }
};
