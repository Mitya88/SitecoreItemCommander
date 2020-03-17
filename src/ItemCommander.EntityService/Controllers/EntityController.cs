namespace ItemCommander.EntityService.Controllers
{
    using ItemCommander.EntityService.Interfaces;
    using ItemCommander.EntityService.Models;
    using ItemCommander.EntityService.Repositories;
    using Sitecore;
    using Sitecore.Configuration;
    using Sitecore.Data;
    using Sitecore.Data.Items;
    using Sitecore.Diagnostics;
    using Sitecore.Install;
    using Sitecore.Install.Items;
    using Sitecore.Install.Zip;
    using Sitecore.Security.Accounts;
    using Sitecore.Services.Core;
    using Sitecore.Services.Infrastructure.Sitecore.Services;
    using Sitecore.Services.Infrastructure.Web.Http;
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Web;
    using System.Web.Http;
    using System.Web.Http.Cors;

    /// <summary>
    /// Entity controller for item commander
    /// </summary>
    /// <seealso cref="Sitecore.Services.Infrastructure.Sitecore.Services.EntityService{ItemCommander.EntityService.Models.ItemResponse}" />
    [Authorize]
    [RoutePrefix("sitecore/api/ssc/itemcommander")]
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class EntityController : ServicesApiController
    {
        /// <summary>
        /// The custom repository actions
        /// </summary>
        private IGenericItemRepository<ItemResponse> _customRepositoryActions;

        /// <summary>
        /// Initializes a new instance of the <see cref="EntityController"/> class.
        /// </summary>
        /// <param name="repository">The repository.</param>
        public EntityController(IGenericItemRepository<ItemResponse> repository)
        {
            this._customRepositoryActions = repository;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="EntityController"/> class.
        /// </summary>
        public EntityController()
            : this(new ItemRepository())
        {
        }

        /// <summary>
        /// Gets the children.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>Children</returns>
        [HttpGet]
        [Route("Children")]
        public ItemCommanderResponse GetChildren(string id, string db)
        {
            return this._customRepositoryActions.GetChildren(id, db);
        }

        /// <summary>
        /// Gets the editor options response
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>Available languages and presentations</returns>
        [HttpGet]
        [Route("editoroptions")]
        public EditorResponse EditorOptions(string id, string db)
        {
            return this._customRepositoryActions.GetEditorOptions(id, db);
        }

        /// <summary>
        /// Fasts the v iew.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>fast view contract</returns>
        [HttpGet]
        [Route("fastview")]
        public FastViewResponse FastVIew(string id, string db)
        {
            return this._customRepositoryActions.GetFastView(id, db);
        }

        /// <summary>
        /// Media View.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>media view contract</returns>
        [HttpGet]
        [Route("media")]
        public MediaViewResponse MediaView(string id, string db)
        {
            return this._customRepositoryActions.GetMediaView(id, db);
        }

        /// <summary>
        /// Queries the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="query">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("copy")]
        public ProcessResponse Query([FromBody]CopyRequest query)
        {
            return this._customRepositoryActions.Copy(query, query.Database);            
        }

        [HttpPost]
        [Route("status")]
        public ProgressResponse Status(string progressId)
        {
            return this._customRepositoryActions.GetRemainingCount(Guid.Parse(progressId));
        }

        /// <summary>
        /// Copies the single.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="copySingleRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("copysingle")]
        public IHttpActionResult CopySingle([FromBody]CopySingle copySingleRequest)
        {
            this._customRepositoryActions.CopySingle(copySingleRequest, copySingleRequest.Database);
            return this.Ok();
        }

        /// <summary>
        /// Moves the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="moveRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("move")]
        public ProcessResponse Move([FromBody]MoveRequest moveRequest)
        {
            return this._customRepositoryActions.Move(moveRequest, moveRequest.Database);
        }

        /// <summary>
        /// Renames the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="renameRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("rename")]
        public ProcessResponse Rename([FromBody]RenameRequest renameRequest)
        {            
            return this._customRepositoryActions.Rename(renameRequest, renameRequest.Database);            
        }

        /// <summary>
        /// Deletes the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="deleteRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("delete")]
        public ProcessResponse Delete([FromBody]DeleteRequest deleteRequest)
        {
            return this._customRepositoryActions.Delete(deleteRequest, deleteRequest.Database);
        }

        /// <summary>
        /// Locks the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="lockRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("lock")]
        public ProcessResponse Lock([FromBody]LockRequest lockRequest)
        {
            return this._customRepositoryActions.Lock(lockRequest, lockRequest.Database);
        }

        /// <summary>
        /// Folders the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="createRequest">The query.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("folder")]
        public IHttpActionResult folder([FromBody]CreateItemRequest createRequest)
        {
            this._customRepositoryActions.CreateItem(createRequest, createRequest.Database);
            return this.Ok();
        }

        /// <summary>
        /// Searches the specified identifier.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>the search result</returns>
        [HttpPost]
        [Route("search")]
        public ItemCommanderResponse Search([FromBody]SearchItemRequest request)
        {
            return this._customRepositoryActions.Search(request.Keyword, request.Database);
        }

        /// <summary>
        /// Inserts the options.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("insertoptions")]
        public List<ItemResponse> InsertOptions(string id, string db)
        {
            return this._customRepositoryActions.GetInsertOptions(id, db);
        }

        /// <summary>
        /// Medias the URL.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("mediaurl")]
        public DownloadResponse MediaUrl(string id, string db)
        {
            return new DownloadResponse { FileName = _customRepositoryActions.GetMediaUrl(id, db) };
        }

        /// <summary>
        /// Packages the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="request">The request.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("package")]
        public DownloadResponse Package([FromBody]DeleteRequest request)
        {
            var file = this.GeneratePackage(this._customRepositoryActions.GetItems(request.Items, request.Database));

            return new DownloadResponse { FileName = Path.GetFileName(file) };
        }

        /// <summary>
        /// Gets the item.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="request">The request.</param>
        /// <param name="db">The database.</param>
        /// <returns></returns>
        [HttpPost]
        [Route("GetItems")]
        public List<ItemResponse> GetItem([FromBody]GetItemRequest request)
        {
            var ids = request.RawValue.Split('|');

            List<Item> items = new List<Item>(); ;

            if (!string.IsNullOrEmpty(request.RawValue) && ids.Any())
            {
                items.AddRange(this._customRepositoryActions.GetItems(ids.ToList(), request.Database));
            }
            var result = new List<ItemResponse>();
            result.AddRange(items.Where(t => t != null).Select(t => new ItemResponse
            {
                Name = t.Name,
                Id = t.ID.ToString(),
                Language = t.Language.ToString(),
                Path = t.Paths.FullPath,
                TemplateName = t.TemplateName,
                Fields = new List<FieldResponse>(),
                HasChildren = t.HasChildren,
                LastModified = t.Statistics.Updated,
                Created = t.Statistics.Created,
                Icon = ItemRepository.GetIcon(t),
                IsLocked = t.Locking.IsLocked(),
                IsHidden = t["__Hidden"] == "1"
            }).ToList());

            foreach (var itemId in ids)
            {
                if (items == null || items.Where(t => t != null).FirstOrDefault(t => t.ID == new ID(itemId)) == null)
                {
                    result.Add(new ItemResponse
                    {
                        Name = string.Format("{0} cannot be found in {1} database", itemId, request.Database)
                    });
                }
            }
            return result;
        }

        /// <summary>
        /// Packages the specified identifier.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="fileName">Name of the file.</param>
        /// <returns></returns>
        [HttpGet]
        [Route("download")]
        public HttpResponseMessage Package(string fileName)
        {
            string file = string.Empty;
            Log.Info("Package Path" + Settings.PackagePath, this);
            if (Settings.PackagePath[1] == ':')
            {
                file = Path.Combine(Settings.PackagePath, fileName);
            }
            else
            {
                file = HttpContext.Current.Server.MapPath(Path.Combine(Settings.PackagePath, fileName));
            }

            var fileExtenstion = Path.GetExtension(file);

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

        /// <summary>
        /// Determines whether this instance is ok.
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Route("IsOk")]
        [Obsolete]
        public string IsOk()
        {
            return "Ok";
        }

        /// <summary>
        /// Generates the package.
        /// </summary>
        /// <param name="list">The list.</param>
        /// <returns></returns>
        private string GeneratePackage(List<Item> list)
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
                    list.AddRange(objArray);
                foreach (Item obj in list)
                {
                    explicitItemSource.Entries.Add(new ItemReference(obj.Uri, false).ToString());
                }
                solution.Sources.Add(explicitItemSource);
                solution.SaveProject = true;

                string fileName = list[0].Name + "_" + DateTime.Now.ToString("dd_MM_yyyy_hh_mm_ss_fffffff") + ".zip";
                string str = Settings.PackagePath + "\\";

                using (PackageWriter packageWriter = new PackageWriter(str + fileName))
                {
                    Context.SetActiveSite("shell");
                    packageWriter.Initialize(Installer.CreateInstallationContext());
                    PackageGenerator.GeneratePackage(solution, packageWriter);
                    Context.SetActiveSite("website");
                }

                return str + fileName;
            }
        }
    }
}