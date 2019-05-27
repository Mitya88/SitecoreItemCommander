namespace ItemCommander.EntityService.Controllers
{
    using System;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading.Tasks;
    using System.Web;
    using System.Web.Http;
    using System.Web.Http.Cors;
    using ItemCommander.EntityService.Interfaces;
    using ItemCommander.EntityService.Models;
    using ItemCommander.EntityService.Repositories;
    using Sitecore;
    using Sitecore.Configuration;
    using Sitecore.Data;
    using Sitecore.Data.Items;
    using Sitecore.Install;
    using Sitecore.Install.Framework;
    using Sitecore.Install.Items;
    using Sitecore.Install.Zip;
    using Sitecore.Security.Accounts;
    using Sitecore.Services.Core;
    using Sitecore.Services.Infrastructure.Sitecore.Services;
    using Sitecore.Web.UI.Sheer;

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
        [ActionName("copysingle")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity CopySingle(string id, CopySingle query)
        {
            _customRepositoryActions.CopySingle(query);
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

        [HttpPost]
        [ActionName("lock")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity Lock(string id, LockRequest query)
        {
            _customRepositoryActions.Lock(query);
            return null;
        }

        [HttpPost]
        [ActionName("folder")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public GenericItemEntity folder(string id, FolderRequest query)
        {
            _customRepositoryActions.CreateFolder(query);
            return null;
        }

        [HttpGet]
        [ActionName("processed")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public int processed(string id)
        {
            return _customRepositoryActions.GetProcessedCount();
        }

        [HttpGet]
        [ActionName("database")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public int Database(string id)
        {
            _customRepositoryActions.SetDatabase(id);

            return 0;
        }

        [HttpGet]
        [ActionName("search")]
        //Sample: /sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/-/copy
        public ItemCommanderResponse search(string id, string keyword)
        {
            

            return _customRepositoryActions.Search(keyword);
        }

        [HttpPost]
        [ActionName("package")]
        public DownloadResponse Package(string id, DeleteRequest request)
        {
            var file = GeneratePackage(this._customRepositoryActions.GetItems(request.Items));

            return new DownloadResponse { FileName = Path.GetFileName(file) };
            }

        [HttpGet]
        [ActionName("download")]
        public HttpResponseMessage Package(string id, string fileName)
        {
           

            var file = HttpContext.Current.Server.MapPath(Path.Combine(Settings.PackagePath, fileName));
            var fileExtenstion = Path.GetExtension(file);
            var mediaTypeHeaderValue = "application/octet-stream";

            var dataBytes = File.ReadAllBytes(file);
            var dataStream = new MemoryStream(dataBytes);

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new StreamContent(dataStream);
            result.Content.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
            result.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
            {
                FileName = fileName
            };

            return result;
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

        public string GeneratePackage(List<Item> list)
        {
            string fullName = Context.User.Profile.FullName;
            using (new UserSwitcher(Sitecore.Security.Accounts.User.FromName("sitecore\\admin", false)))
            {
                Database contentDatabase = Context.ContentDatabase;
                PackageProject solution = new PackageProject();
                solution.Metadata.PackageName = list[0].Name;
                solution.Metadata.Author = fullName;
                ExplicitItemSource explicitItemSource = new ExplicitItemSource();
                explicitItemSource.Name = list[0].Name;

                Item[] objArray = list.ToArray();
                if (objArray != null && objArray.Length > 0)
                    list.AddRange((IEnumerable<Item>)objArray);
                foreach (Item obj in list)
                {
                    explicitItemSource.Entries.Add(new ItemReference(obj.Uri, false).ToString());
                }
                solution.Sources.Add((ISource<PackageEntry>)explicitItemSource);
                solution.SaveProject = true;

                string fileName = list[0].Name + "_" + DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss_fffffff") + ".zip";
                string str = Settings.PackagePath+"\\";

                using (PackageWriter packageWriter = new PackageWriter(str + fileName))
                {
                    Context.SetActiveSite("shell");
                    ((BaseSink<PackageEntry>)packageWriter).Initialize(Installer.CreateInstallationContext());
                    PackageGenerator.GeneratePackage(solution, (ISink<PackageEntry>)packageWriter);
                    Context.SetActiveSite("website");
                }

                return str+fileName;

            }
        }
    }
}
