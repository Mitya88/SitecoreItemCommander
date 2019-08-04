module.exports = {
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/%7B04DAD0FD-DB66-4070-881F-17264CA257E1%7D/mediaurl': function(req, res){
    res.json({"FileName":"https://via.placeholder.com/350x150"})
  },  
  'POST /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/-/GetItems/': function(req, res){
    res.json([{"Name":"Home","Path":"/sitecore/content/Home","Language":"en","Icon":"https://via.placeholder.com/32x32","TemplateName":"Sample Item","TemplateId":null,"ParentId":null,"HasChildren":false,"IsLocked":false,"LastModified":"2019-08-03T15:06:47Z","Created":"2008-04-07T10:59:00Z","IsHidden":false,"Fields":[],"Id":"{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}","Url":null},{"Name":"media library","Path":"/sitecore/media library","Language":"en","Icon":"https://via.placeholder.com/32x32","TemplateName":"Main section","TemplateId":null,"ParentId":null,"HasChildren":true,"IsLocked":false,"LastModified":"2018-06-04T03:30:47Z","Created":"2008-03-12T10:14:00Z","IsHidden":false,"Fields":[],"Id":"{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}","Url":null},{"Name":"Forms","Path":"/sitecore/Forms","Language":"en","Icon":"https://via.placeholder.com/32x32","TemplateName":"Folder","TemplateId":null,"ParentId":null,"HasChildren":false,"IsLocked":false,"LastModified":"2017-11-23T15:06:14Z","Created":"2016-07-18T13:39:48Z","IsHidden":false,"Fields":[],"Id":"{B701850A-CB8A-4943-B2BC-DDDB1238C103}","Url":null}])
  },
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/%7B4B6DDC95-8285-4A50-B71C-466D92E78018%7D/fastview': function(req, res){
    res.json({
      "Languages": [
        "en",
        "ja-JP",
        "de-DE",
        "da"
      ],
      "Item": {
        "Name": "Site1",
        "Path": "/sitecore/content/Site1",
        "Language": "en",
        "Icon": "/temp/iconcache/network/32x32/home.png",
        "TemplateName": "Sample Item",
        "TemplateId": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}",
        "ParentId": "{0DE95AE4-41AB-4D01-9EB0-67441B7C2450}",
        "HasChildren": true,
        "IsLocked": false,
        "LastModified": "2019-08-03T15:06:53Z",
        "Created": "2008-04-07T10:59:00Z",
        "IsHidden": false,
        "Fields": [
          
        ],
        "Id": "{4B6DDC95-8285-4A50-B71C-466D92E78018}",
        "Url": null
      },
      "Data": {
        "en": {
          "Data": [
            {
              "Id": "{2C4A2D05-DA21-4EAD-929D-137EAF88D631}",
              "Name": "Image",
              "Value": "<image mediaid=\"{04DAD0FD-DB66-4070-881F-17264CA257E1}\" />",
              "Type": "Image",
              "SectionName": "Data"
            },
            {
              "Id": "{75577384-3C97-45DA-A847-81B00500E250}",
              "Name": "Title",
              "Value": "Sitecore Experience Platform",
              "Type": "Single-Line Text",
              "SectionName": "Data"
            },
            {
              "Id": "{A5D3C830-EDBC-411C-8A64-9680AA0803FF}",
              "Name": "Multilist",
              "Value": "{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}|{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}|{B701850A-CB8A-4943-B2BC-DDDB1238C103}",
              "Type": "Multilist",
              "SectionName": "Data"
            },
            {
              "Id": "{A60ACD61-A6DB-4182-8329-C957982CEC74}",
              "Name": "Text",
              "Value": "<p style=\"line-height: 22px;\">From a single connected platform that also integrates with other customer-facing platforms, to a single view of the customer in a big data marketing repository, to completely eliminating much of the complexity that has previously held marketers back, the latest version of Sitecore makes customer experience highly achievable. Learn how the latest version of Sitecore gives marketers the complete data, integrated tools, and automation capabilities to engage customers throughout an iterative lifecycle &ndash; the technology foundation absolutely necessary to win customers for life.</p>\n<p>For further information, please go to the <a href=\"https://doc.sitecore.net/\" target=\"_blank\" title=\"Sitecore Documentation site\">Sitecore Documentation site</a></p>\r",
              "Type": "Rich Text",
              "SectionName": "Data"
            },
            {
              "Id": "{B04A469F-665A-465A-92DC-D3EE749CAC5A}",
              "Name": "Tree",
              "Value": "{110D559F-DEA5-42EA-9C1C-8A5DF7E70EF9}|{3D6658D8-A0BF-4E75-B3E2-D050FABCF4E1}|{B701850A-CB8A-4943-B2BC-DDDB1238C103}|{390C56EB-9795-4A23-8EB3-474B0D28AAC2}",
              "Type": "Treelist",
              "SectionName": "Data"
            }
          ],
          "Appearance": [
            {
              "Id": "{B5E02AD9-D56F-4C41-A065-A133DB87BDEB}",
              "Name": "__Display name",
              "Value": "",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A791F095-2521-4B4D-BEF9-21DDA221F608}",
              "Name": "__Style",
              "Value": "",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{06D5295C-ED2F-4A54-9BF2-26228D113318}",
              "Name": "__Icon",
              "Value": "Network/16x16/home.png",
              "Type": "Icon",
              "SectionName": "Appearance"
            },
            {
              "Id": "{BA3F86A2-4A1C-4D78-B63D-91C2779C1B5E}",
              "Name": "__Sortorder",
              "Value": "-1",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{6FD695E7-7F6D-4CA5-8B49-A829E5950AE9}",
              "Name": "__Subitems Sorting",
              "Value": "",
              "Type": "Droplink",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A0CB3965-8884-4C7A-8815-B6B2E5CED162}",
              "Name": "__Editors",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Appearance"
            },
            {
              "Id": "{0C894AAB-962B-4A84-B923-CB24B05E60D2}",
              "Name": "__Ribbon",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Appearance"
            },
            {
              "Id": "{9C6106EA-7A5A-48E2-8CAD-F0F693B1E2D4}",
              "Name": "__Read Only",
              "Value": "",
              "Type": "Checkbox",
              "SectionName": "Appearance"
            }
          ],
          "Help": [
            {
              "Id": "{9541E67D-CE8C-4225-803D-33F7F29F09EF}",
              "Name": "__Short description",
              "Value": "Welcome to Sitecore.",
              "Type": "Single-Line Text",
              "SectionName": "Help"
            },
            {
              "Id": "{577F1689-7DE4-4AD2-A15F-7FDC1759285F}",
              "Name": "__Long description",
              "Value": "The Home item is the default starting point for a website.",
              "Type": "Multi-Line Text",
              "SectionName": "Help"
            }
          ],
          "Insert Options": [
            {
              "Id": "{1172F251-DAD4-4EFB-A329-0C63500E4F1E}",
              "Name": "__Masters",
              "Value": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}|{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            },
            {
              "Id": "{83798D75-DF25-4C28-9327-E8BAC2B75292}",
              "Name": "__Insert Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            }
          ],
          "Lifetime": [
            {
              "Id": "{C8F93AFE-BFD4-4E8F-9C61-152559854661}",
              "Name": "__Valid from",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Lifetime"
            },
            {
              "Id": "{4C346442-E859-4EFD-89B2-44AEDF467D21}",
              "Name": "__Valid to",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Lifetime"
            }
          ],
          "Publishing": [
            {
              "Id": "{86FE4F77-4D9A-4EC3-9ED9-263D03BD1965}",
              "Name": "__Publish",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Publishing"
            },
            {
              "Id": "{74484BDF-7C86-463C-B49F-7B73B9AFC965}",
              "Name": "__Publishing groups",
              "Value": "",
              "Type": "checklist",
              "SectionName": "Publishing"
            },
            {
              "Id": "{9135200A-5626-4DD8-AB9D-D665B8C11748}",
              "Name": "__Never publish",
              "Value": "",
              "Type": "checkbox",
              "SectionName": "Publishing"
            }
          ],
          "Security": [
            {
              "Id": "{52807595-0F8F-4B20-8D2A-CB71D28C6103}",
              "Name": "__Owner",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Security"
            },
            {
              "Id": "{DEC8D2D5-E3CF-48B6-A653-8E69E2716641}",
              "Name": "__Security",
              "Value": "ar|sitecore\\siteeditor|pe|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|pd|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|",
              "Type": "security",
              "SectionName": "Security"
            }
          ],
          "Statistics": [
            {
              "Id": "{5DD74568-4D4B-44C1-B513-0AF5F4CDA34F}",
              "Name": "__Created by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{BADD9CF9-53E0-4D0C-BCC0-2D784C282F6A}",
              "Name": "__Updated by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{8CDC337E-A112-42FB-BBB4-4143751E123F}",
              "Name": "__Revision",
              "Value": "af270205-d47b-405b-ba2f-433a40e0efa4",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{25BED78C-4957-4165-998A-CA1B52F67497}",
              "Name": "__Created",
              "Value": "20080407T105900Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            },
            {
              "Id": "{D9CF14B1-FA16-4BA6-9288-E8A174D4D522}",
              "Name": "__Updated",
              "Value": "20190803T150653Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            }
          ],
          "Tasks": [
            {
              "Id": "{56C15C6D-FD5A-40CA-BB37-64CEEC6A9BD5}",
              "Name": "__Archive date",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Tasks"
            }
          ],
          "Validation Rules": [
            {
              "Id": "{C2F5B2B5-71C1-431E-BF7F-DBDC1E5A2F83}",
              "Name": "__Quick Action Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            },
            {
              "Id": "{B7E5B151-B145-4CED-85C5-FBDB566DFA4D}",
              "Name": "__Validator Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            }
          ],
          "Workflow": [
            {
              "Id": "{CA9B9F52-4FB0-4F87-A79F-24DEA62CDA65}",
              "Name": "__Default workflow",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Workflow"
            },
            {
              "Id": "{A4F985D9-98B3-4B52-AAAF-4344F6E747C6}",
              "Name": "__Workflow",
              "Value": "{A5BC37E7-ED96-4C1E-8590-A26E64DB55EA}",
              "Type": "Droptree",
              "SectionName": "Workflow"
            }
          ]
        },
        "ja-JP": {
          "Data": [
            {
              "Id": "{75577384-3C97-45DA-A847-81B00500E250}",
              "Name": "Title",
              "Value": "サイトコア エクスペリエンス プラットフォームへようこそ",
              "Type": "Single-Line Text",
              "SectionName": "Data"
            },
            {
              "Id": "{A60ACD61-A6DB-4182-8329-C957982CEC74}",
              "Name": "Text",
              "Value": "<p style=\"line-height: 22px;\">他の顧客対応プラットフォームとも統合した単独接続プラットフォームから、ビッグ データ マーケティング レポジトリーの顧客の単独ビューまで、従来マーケターを阻んでいた複雑性を完全に解消するため、Sitecore の最新バージョンがカスタマー エクスペリエンスを達成可能にします。インタラクティブなライフサイクル全体を通して顧客のエンゲージメントを高めるために、Sitecore の最新バージョンがマーケターに完全なデータ、統合されたツール、オートメーション機能をどのように提供するかを学びます &ndash; 一生の顧客を獲得するためには技術基盤は絶対に必要です。</p>\r\n<p>詳細は<a href=\"https://doc.sitecore.net/\" target=\"_blank\" title=\"Sitecore Documentation site\">Sitecore ドキュメント サイト</a>をご参照ください。</p>",
              "Type": "Rich Text",
              "SectionName": "Data"
            }
          ],
          "Appearance": [
            {
              "Id": "{B5E02AD9-D56F-4C41-A065-A133DB87BDEB}",
              "Name": "__Display name",
              "Value": "ホーム",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A791F095-2521-4B4D-BEF9-21DDA221F608}",
              "Name": "__Style",
              "Value": "",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{06D5295C-ED2F-4A54-9BF2-26228D113318}",
              "Name": "__Icon",
              "Value": "Network/16x16/home.png",
              "Type": "Icon",
              "SectionName": "Appearance"
            },
            {
              "Id": "{BA3F86A2-4A1C-4D78-B63D-91C2779C1B5E}",
              "Name": "__Sortorder",
              "Value": "-1",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{6FD695E7-7F6D-4CA5-8B49-A829E5950AE9}",
              "Name": "__Subitems Sorting",
              "Value": "",
              "Type": "Droplink",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A0CB3965-8884-4C7A-8815-B6B2E5CED162}",
              "Name": "__Editors",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Appearance"
            },
            {
              "Id": "{0C894AAB-962B-4A84-B923-CB24B05E60D2}",
              "Name": "__Ribbon",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Appearance"
            },
            {
              "Id": "{9C6106EA-7A5A-48E2-8CAD-F0F693B1E2D4}",
              "Name": "__Read Only",
              "Value": "",
              "Type": "Checkbox",
              "SectionName": "Appearance"
            }
          ],
          "Help": [
            {
              "Id": "{9541E67D-CE8C-4225-803D-33F7F29F09EF}",
              "Name": "__Short description",
              "Value": "Sitecore へようこそ",
              "Type": "Single-Line Text",
              "SectionName": "Help"
            },
            {
              "Id": "{577F1689-7DE4-4AD2-A15F-7FDC1759285F}",
              "Name": "__Long description",
              "Value": "ホーム アイテムは Web サイトのデフォルトの開始場所です",
              "Type": "Multi-Line Text",
              "SectionName": "Help"
            }
          ],
          "Insert Options": [
            {
              "Id": "{1172F251-DAD4-4EFB-A329-0C63500E4F1E}",
              "Name": "__Masters",
              "Value": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}|{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            },
            {
              "Id": "{83798D75-DF25-4C28-9327-E8BAC2B75292}",
              "Name": "__Insert Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            }
          ],
          "Publishing": [
            {
              "Id": "{86FE4F77-4D9A-4EC3-9ED9-263D03BD1965}",
              "Name": "__Publish",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Publishing"
            },
            {
              "Id": "{74484BDF-7C86-463C-B49F-7B73B9AFC965}",
              "Name": "__Publishing groups",
              "Value": "",
              "Type": "checklist",
              "SectionName": "Publishing"
            },
            {
              "Id": "{9135200A-5626-4DD8-AB9D-D665B8C11748}",
              "Name": "__Never publish",
              "Value": "",
              "Type": "checkbox",
              "SectionName": "Publishing"
            }
          ],
          "Security": [
            {
              "Id": "{52807595-0F8F-4B20-8D2A-CB71D28C6103}",
              "Name": "__Owner",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Security"
            },
            {
              "Id": "{DEC8D2D5-E3CF-48B6-A653-8E69E2716641}",
              "Name": "__Security",
              "Value": "ar|sitecore\\siteeditor|pe|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|pd|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|",
              "Type": "security",
              "SectionName": "Security"
            }
          ],
          "Statistics": [
            {
              "Id": "{5DD74568-4D4B-44C1-B513-0AF5F4CDA34F}",
              "Name": "__Created by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{BADD9CF9-53E0-4D0C-BCC0-2D784C282F6A}",
              "Name": "__Updated by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{8CDC337E-A112-42FB-BBB4-4143751E123F}",
              "Name": "__Revision",
              "Value": "cc5eea79-5987-4245-a491-fd089d71cca5",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{25BED78C-4957-4165-998A-CA1B52F67497}",
              "Name": "__Created",
              "Value": "20180604T034455Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            },
            {
              "Id": "{D9CF14B1-FA16-4BA6-9288-E8A174D4D522}",
              "Name": "__Updated",
              "Value": "20180604T034455Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            }
          ],
          "Tasks": [
            {
              "Id": "{56C15C6D-FD5A-40CA-BB37-64CEEC6A9BD5}",
              "Name": "__Archive date",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Tasks"
            }
          ],
          "Validation Rules": [
            {
              "Id": "{C2F5B2B5-71C1-431E-BF7F-DBDC1E5A2F83}",
              "Name": "__Quick Action Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            },
            {
              "Id": "{B7E5B151-B145-4CED-85C5-FBDB566DFA4D}",
              "Name": "__Validator Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            }
          ],
          "Workflow": [
            {
              "Id": "{CA9B9F52-4FB0-4F87-A79F-24DEA62CDA65}",
              "Name": "__Default workflow",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Workflow"
            },
            {
              "Id": "{A4F985D9-98B3-4B52-AAAF-4344F6E747C6}",
              "Name": "__Workflow",
              "Value": "{A5BC37E7-ED96-4C1E-8590-A26E64DB55EA}",
              "Type": "Droptree",
              "SectionName": "Workflow"
            }
          ]
        },
        "de-DE": {
          "Data": [
            {
              "Id": "{75577384-3C97-45DA-A847-81B00500E250}",
              "Name": "Title",
              "Value": "Sitecore Experience Plattform",
              "Type": "Single-Line Text",
              "SectionName": "Data"
            },
            {
              "Id": "{A60ACD61-A6DB-4182-8329-C957982CEC74}",
              "Name": "Text",
              "Value": "<p style=\"line-height: 22px;\">Von einer einzelnen verbundenen Plattform, die auch auf anderen kundenorientierten Plattformen abgestimmt ist, zu einer Einzelansicht des Kunden in einem Big Data Marketing Repository, um einen Gutteil der Komplexität, die zuvor Marketer zurückgehalten hat, vollständig zu eliminieren, macht die neuste Sitecore Version das Kundenerlebnis erreichbar. Erfahren Sie, wie die neuste Sitecore Version Marketern die vollständigen Daten, integrierte Tools und automatisierte Fähigkeiten gibt, um Kunden während der sich wiederholenden Nutzungszeit&ndash; anzusprechen Diese Technologiegrundlage ist absolut nötig, um Kunden fürs Leben zu gewinnen.</p>\r\n<p>Für weiterführende Informationen gehen Sie bitte zur <a href=\"https://doc.sitecore.net/\" target=\"_blank\" title=\"Sitecore Dokumentationsseite\">Sitecore Dokumentationsseite</a></p>",
              "Type": "Rich Text",
              "SectionName": "Data"
            }
          ],
          "Appearance": [
            {
              "Id": "{B5E02AD9-D56F-4C41-A065-A133DB87BDEB}",
              "Name": "__Display name",
              "Value": "Home",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A791F095-2521-4B4D-BEF9-21DDA221F608}",
              "Name": "__Style",
              "Value": "",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{06D5295C-ED2F-4A54-9BF2-26228D113318}",
              "Name": "__Icon",
              "Value": "Network/16x16/home.png",
              "Type": "Icon",
              "SectionName": "Appearance"
            },
            {
              "Id": "{BA3F86A2-4A1C-4D78-B63D-91C2779C1B5E}",
              "Name": "__Sortorder",
              "Value": "-1",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{6FD695E7-7F6D-4CA5-8B49-A829E5950AE9}",
              "Name": "__Subitems Sorting",
              "Value": "",
              "Type": "Droplink",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A0CB3965-8884-4C7A-8815-B6B2E5CED162}",
              "Name": "__Editors",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Appearance"
            },
            {
              "Id": "{0C894AAB-962B-4A84-B923-CB24B05E60D2}",
              "Name": "__Ribbon",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Appearance"
            },
            {
              "Id": "{9C6106EA-7A5A-48E2-8CAD-F0F693B1E2D4}",
              "Name": "__Read Only",
              "Value": "",
              "Type": "Checkbox",
              "SectionName": "Appearance"
            }
          ],
          "Help": [
            {
              "Id": "{9541E67D-CE8C-4225-803D-33F7F29F09EF}",
              "Name": "__Short description",
              "Value": "Willkommen bei Sitecore",
              "Type": "Single-Line Text",
              "SectionName": "Help"
            },
            {
              "Id": "{577F1689-7DE4-4AD2-A15F-7FDC1759285F}",
              "Name": "__Long description",
              "Value": "Das Home Item ist der vorgegebene Startpunkt einer Website.",
              "Type": "Multi-Line Text",
              "SectionName": "Help"
            }
          ],
          "Insert Options": [
            {
              "Id": "{1172F251-DAD4-4EFB-A329-0C63500E4F1E}",
              "Name": "__Masters",
              "Value": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}|{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            },
            {
              "Id": "{83798D75-DF25-4C28-9327-E8BAC2B75292}",
              "Name": "__Insert Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            }
          ],
          "Publishing": [
            {
              "Id": "{86FE4F77-4D9A-4EC3-9ED9-263D03BD1965}",
              "Name": "__Publish",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Publishing"
            },
            {
              "Id": "{74484BDF-7C86-463C-B49F-7B73B9AFC965}",
              "Name": "__Publishing groups",
              "Value": "",
              "Type": "checklist",
              "SectionName": "Publishing"
            },
            {
              "Id": "{9135200A-5626-4DD8-AB9D-D665B8C11748}",
              "Name": "__Never publish",
              "Value": "",
              "Type": "checkbox",
              "SectionName": "Publishing"
            }
          ],
          "Security": [
            {
              "Id": "{52807595-0F8F-4B20-8D2A-CB71D28C6103}",
              "Name": "__Owner",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Security"
            },
            {
              "Id": "{DEC8D2D5-E3CF-48B6-A653-8E69E2716641}",
              "Name": "__Security",
              "Value": "ar|sitecore\\siteeditor|pe|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|pd|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|",
              "Type": "security",
              "SectionName": "Security"
            }
          ],
          "Statistics": [
            {
              "Id": "{5DD74568-4D4B-44C1-B513-0AF5F4CDA34F}",
              "Name": "__Created by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{BADD9CF9-53E0-4D0C-BCC0-2D784C282F6A}",
              "Name": "__Updated by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{8CDC337E-A112-42FB-BBB4-4143751E123F}",
              "Name": "__Revision",
              "Value": "9f005136-fd4c-4ecd-9dd7-33dc1fafe470",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{25BED78C-4957-4165-998A-CA1B52F67497}",
              "Name": "__Created",
              "Value": "20180604T034146Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            },
            {
              "Id": "{D9CF14B1-FA16-4BA6-9288-E8A174D4D522}",
              "Name": "__Updated",
              "Value": "20180604T034146Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            }
          ],
          "Tasks": [
            {
              "Id": "{56C15C6D-FD5A-40CA-BB37-64CEEC6A9BD5}",
              "Name": "__Archive date",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Tasks"
            }
          ],
          "Validation Rules": [
            {
              "Id": "{C2F5B2B5-71C1-431E-BF7F-DBDC1E5A2F83}",
              "Name": "__Quick Action Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            },
            {
              "Id": "{B7E5B151-B145-4CED-85C5-FBDB566DFA4D}",
              "Name": "__Validator Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            }
          ],
          "Workflow": [
            {
              "Id": "{CA9B9F52-4FB0-4F87-A79F-24DEA62CDA65}",
              "Name": "__Default workflow",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Workflow"
            },
            {
              "Id": "{A4F985D9-98B3-4B52-AAAF-4344F6E747C6}",
              "Name": "__Workflow",
              "Value": "{A5BC37E7-ED96-4C1E-8590-A26E64DB55EA}",
              "Type": "Droptree",
              "SectionName": "Workflow"
            }
          ]
        },
        "da": {
          "Data": [
            {
              "Id": "{75577384-3C97-45DA-A847-81B00500E250}",
              "Name": "Title",
              "Value": "Sitecore",
              "Type": "Single-Line Text",
              "SectionName": "Data"
            },
            {
              "Id": "{A60ACD61-A6DB-4182-8329-C957982CEC74}",
              "Name": "Text",
              "Value": "<p style=\"line-height: 22px;\">Fra en enkelt tilsluttet platform, der også kan integreres med andre kundeorienterede platforme, til et enkelt overblik over kunden i et big data-marketinglager, til at slippe for meget af den kompleksitet, der har holdt marketingafdelingerne tilbage – med den nyeste version af Sitecore er det muligt at opnå en fantastisk kundeoplevelse. Se, hvordan den nyeste version af Sitecore giver marketingafdelingen fyldestgørende data, integrerede værktøjer og automatiske funktioner, der engagerer kunderne i løbet af en iterativ livscyklus &ndash; det teknologiske grundlag, der er helt afgørende for at skabe kunder for livet.</p>\r\n<p>Du kan få flere oplysninger ved at gå til <a href=\"https://doc.sitecore.net/\" target=\"_blank\" title=\"Sitecore Documentation site\">Sitecores dokumentationssite</a></p>",
              "Type": "Rich Text",
              "SectionName": "Data"
            }
          ],
          "Appearance": [
            {
              "Id": "{B5E02AD9-D56F-4C41-A065-A133DB87BDEB}",
              "Name": "__Display name",
              "Value": "Hjem",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A791F095-2521-4B4D-BEF9-21DDA221F608}",
              "Name": "__Style",
              "Value": "",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{06D5295C-ED2F-4A54-9BF2-26228D113318}",
              "Name": "__Icon",
              "Value": "Network/16x16/home.png",
              "Type": "Icon",
              "SectionName": "Appearance"
            },
            {
              "Id": "{BA3F86A2-4A1C-4D78-B63D-91C2779C1B5E}",
              "Name": "__Sortorder",
              "Value": "-1",
              "Type": "Single-Line Text",
              "SectionName": "Appearance"
            },
            {
              "Id": "{6FD695E7-7F6D-4CA5-8B49-A829E5950AE9}",
              "Name": "__Subitems Sorting",
              "Value": "",
              "Type": "Droplink",
              "SectionName": "Appearance"
            },
            {
              "Id": "{A0CB3965-8884-4C7A-8815-B6B2E5CED162}",
              "Name": "__Editors",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Appearance"
            },
            {
              "Id": "{0C894AAB-962B-4A84-B923-CB24B05E60D2}",
              "Name": "__Ribbon",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Appearance"
            },
            {
              "Id": "{9C6106EA-7A5A-48E2-8CAD-F0F693B1E2D4}",
              "Name": "__Read Only",
              "Value": "",
              "Type": "Checkbox",
              "SectionName": "Appearance"
            }
          ],
          "Help": [
            {
              "Id": "{9541E67D-CE8C-4225-803D-33F7F29F09EF}",
              "Name": "__Short description",
              "Value": "Velkommen til Sitecore.",
              "Type": "Single-Line Text",
              "SectionName": "Help"
            },
            {
              "Id": "{577F1689-7DE4-4AD2-A15F-7FDC1759285F}",
              "Name": "__Long description",
              "Value": "Elementet Hjem er som standard startpunktet for en hjemmeside.",
              "Type": "Multi-Line Text",
              "SectionName": "Help"
            }
          ],
          "Insert Options": [
            {
              "Id": "{1172F251-DAD4-4EFB-A329-0C63500E4F1E}",
              "Name": "__Masters",
              "Value": "{76036F5E-CBCE-46D1-AF0A-4143F9B557AA}|{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            },
            {
              "Id": "{83798D75-DF25-4C28-9327-E8BAC2B75292}",
              "Name": "__Insert Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Insert Options"
            }
          ],
          "Publishing": [
            {
              "Id": "{86FE4F77-4D9A-4EC3-9ED9-263D03BD1965}",
              "Name": "__Publish",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Publishing"
            },
            {
              "Id": "{74484BDF-7C86-463C-B49F-7B73B9AFC965}",
              "Name": "__Publishing groups",
              "Value": "",
              "Type": "checklist",
              "SectionName": "Publishing"
            },
            {
              "Id": "{9135200A-5626-4DD8-AB9D-D665B8C11748}",
              "Name": "__Never publish",
              "Value": "",
              "Type": "checkbox",
              "SectionName": "Publishing"
            }
          ],
          "Security": [
            {
              "Id": "{52807595-0F8F-4B20-8D2A-CB71D28C6103}",
              "Name": "__Owner",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Security"
            },
            {
              "Id": "{DEC8D2D5-E3CF-48B6-A653-8E69E2716641}",
              "Name": "__Security",
              "Value": "ar|sitecore\\siteeditor|pe|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|pd|+item:create|+item:read|+item:rename|+item:delete|+item:write|^*|+item:admin|",
              "Type": "security",
              "SectionName": "Security"
            }
          ],
          "Statistics": [
            {
              "Id": "{5DD74568-4D4B-44C1-B513-0AF5F4CDA34F}",
              "Name": "__Created by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{BADD9CF9-53E0-4D0C-BCC0-2D784C282F6A}",
              "Name": "__Updated by",
              "Value": "sitecore\\admin",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{8CDC337E-A112-42FB-BBB4-4143751E123F}",
              "Name": "__Revision",
              "Value": "a2f37977-6f5f-4cf0-a85b-1ac9ca0146d2",
              "Type": "Single-Line Text",
              "SectionName": "Statistics"
            },
            {
              "Id": "{25BED78C-4957-4165-998A-CA1B52F67497}",
              "Name": "__Created",
              "Value": "20180604T033819Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            },
            {
              "Id": "{D9CF14B1-FA16-4BA6-9288-E8A174D4D522}",
              "Name": "__Updated",
              "Value": "20180604T033819Z",
              "Type": "datetime",
              "SectionName": "Statistics"
            }
          ],
          "Tasks": [
            {
              "Id": "{56C15C6D-FD5A-40CA-BB37-64CEEC6A9BD5}",
              "Name": "__Archive date",
              "Value": "",
              "Type": "datetime",
              "SectionName": "Tasks"
            }
          ],
          "Validation Rules": [
            {
              "Id": "{C2F5B2B5-71C1-431E-BF7F-DBDC1E5A2F83}",
              "Name": "__Quick Action Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            },
            {
              "Id": "{B7E5B151-B145-4CED-85C5-FBDB566DFA4D}",
              "Name": "__Validator Bar Validation Rules",
              "Value": "",
              "Type": "TreelistEx",
              "SectionName": "Validation Rules"
            }
          ],
          "Workflow": [
            {
              "Id": "{CA9B9F52-4FB0-4F87-A79F-24DEA62CDA65}",
              "Name": "__Default workflow",
              "Value": "",
              "Type": "Droptree",
              "SectionName": "Workflow"
            },
            {
              "Id": "{A4F985D9-98B3-4B52-AAAF-4344F6E747C6}",
              "Name": "__Workflow",
              "Value": "{A5BC37E7-ED96-4C1E-8590-A26E64DB55EA}",
              "Type": "Droptree",
              "SectionName": "Workflow"
            }
          ]
        }
      }
    })
  }
};
