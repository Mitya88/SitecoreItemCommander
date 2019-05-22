module.exports = {
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/0DE95AE4-41AB-4D01-9EB0-67441B7C2450/children': function (req, res) {
    res.json(
     {"CurrentPath":"/sitecore",
        "Children": [
        {
          "Id":"0",
          "Name": "Content",
          "Icon": "https://via.placeholder.com/32x32",
          "TemplateName":"Sample",
          "LastModified":"20180510",
          "HasChildren":true
        },
        {
          "Id":"1",
          "Name": "Media Library",
          "Icon": "https://via.placeholder.com/32x32",
          "TemplateName":"Sample",
          "LastModified":"20180510",
          "HasChildren":true
        }
      
    ]});
  },

  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/0/children': function (req, res) {
    res.json(
     {"CurrentPath":"/sitecore/content",
     "ParentId":"0DE95AE4-41AB-4D01-9EB0-67441B7C2450",
        "Children": [
        {
          "Id":"02",
          "Name": "Home",
          "Icon": "https://via.placeholder.com/32x32",
          "TemplateName":"Sample",
          "LastModified":"20180510",
          "HasChildren":true
        }
      
    ]});
  }
};
