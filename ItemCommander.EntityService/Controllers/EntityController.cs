namespace ItemCommander.EntityService.Controllers
{
    using System.Collections.Generic;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using ItemCommander.EntityService.Interfaces;
    using ItemCommander.EntityService.Models;
    using ItemCommander.EntityService.Repositories;
    using Sitecore.Services.Core;
    using Sitecore.Services.Infrastructure.Sitecore.Services;

    [ServicesController]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EntityController : EntityService<GenericItemEntity>
    {
        private IGenericItemRepository<GenericItemEntity> _customRepositoryActions;

        public EntityController(IGenericItemRepository<GenericItemEntity> repository)
            : base(repository)
        {
            _customRepositoryActions = repository;
        }

        public EntityController()
            : this(new ItemRepository())
        {
        }

        [HttpGet]
        [ActionName("Children")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}/findbyid?language=en-gb
        public ItemCommanderResponse GetItemBchi(string id)
        {
            return _customRepositoryActions.GetChildren(id);
        }

        [HttpGet]
        [ActionName("FindById")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}/findbyid?language=en-gb
        public GenericItemEntity GetItemById(string id, string language)
        {
            return _customRepositoryActions.FindById(id, language);
        }

        [HttpPost]
        [ActionName("QuerySingle")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}/QuerySingle
        public GenericItemEntity Query(string id, QuerySingleDto query)
        {
            return _customRepositoryActions.QuerySingle(query);
        }

        [HttpPost]
        [ActionName("copy")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity Query(string id, CopyRequest query)
        {
            Task.Run(() =>  _customRepositoryActions.Copy(query));
            return null;
        }

        [HttpPost]
        [ActionName("move")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity Move(string id, MoveRequest query)
        {
            Task.Run(() => _customRepositoryActions.Move(query));
            return null;
        }

        [HttpPost]
        [ActionName("delete")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity Delete(string id, DeleteRequest query)
        {
            Task.Run(() => _customRepositoryActions.Delete(query));
            return null;
        }

        [HttpGet]
        [ActionName("processed")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public int processed(string id)
        {
            return _customRepositoryActions.GetProcessedCount();
        }

        [HttpPost]
        [ActionName("QueryMulti")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}/QueryMulti
        public List<GenericItemEntity> QueryMulti(string id, QueryMultiDto query)
        {
            return _customRepositoryActions.QueryMulti(query);
        }

        [HttpGet]
        [ActionName("PublishItem")]
        ///sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}/publishitem?target=web&language=en-gb
        public void Get(string id, string target, string language)
        {
            _customRepositoryActions.PublishItem(id, target, language);
        }

        [HttpGet]
        [ActionName("IsOk")]
        ///sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/Ok
        public string IsOk()
        {
            return "Ok";
        }
    }
}