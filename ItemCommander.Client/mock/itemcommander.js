module.exports = {
  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/11111111-1111-1111-1111-111111111111/children': function (req, res) {
    res.json(
     {"CurrentPath":"/sitecore",
        "Children": [
        {
          "Id":"0",
          "Name": "Content",
          "Icon": "https://via.placeholder.com/32x32",
          "TemplateName":"Sample",
          "LastModified":"20180510",
          "HasChildren":true,
          "IsLocked":true
        },
        {
          "Id":"1",
          "Name": "Media Library",
          "Icon": "https://via.placeholder.com/32x32",
          "TemplateName":"Sample",
          "LastModified":"20180510",
          "HasChildren":true,
          "IsLocked":false
        }
      
    ]});
  },

  'GET /sitecore/api/ssc/ItemComander-EntityService-Controllers/Entity/0/children': function (req, res) {
    res.json(
     {"CurrentPath":"/sitecore/content",
     "ParentId":"11111111-1111-1111-1111-111111111111",
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
