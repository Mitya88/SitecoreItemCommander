namespace ItemCommander.EntityService.Repositories
{
    using ItemCommander.EntityService.Interfaces;
    using ItemCommander.EntityService.Models;
    using ItemCommander.EntityService.Search;
    using Sitecore.Configuration;
    using Sitecore.ContentSearch;
    using Sitecore.ContentSearch.Linq;
    using Sitecore.ContentSearch.Linq.Utilities;
    using Sitecore.Data;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Data.Managers;
    using Sitecore.Resources.Media;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    /// <summary>
    /// Item repository implemetnation
    /// </summary>
    /// <seealso cref="ItemCommander.EntityService.Interfaces.IGenericItemRepository{ItemCommander.EntityService.Models.ItemResponse}" />
    public class ItemRepository : IGenericItemRepository<ItemResponse>
    {
        /// <summary>
        /// The database
        /// </summary>
        private Database database;

        /// <summary>
        /// The standard fields
        /// </summary>
        private List<string> standardFields = new List<string>() { "Statistics", "Lifetime", "Security", "Help", "Appearance", "Insert Options", "Workflow", "Publishing", "Tasks", "Validation Rules" };

        /// <summary>
        /// The progress status
        /// </summary>
        private static ConcurrentDictionary<Guid, ConcurrentQueue<string>> progressStatus;

        /// <summary>
        /// The progress status
        /// </summary>
        private static ConcurrentDictionary<Guid, List<string>> errors;

        /// <summary>
        /// The result
        /// </summary>
        private static ConcurrentDictionary<Guid, ProcessResponse> result;

        /// <summary>
        /// The maximum number of threads settings key
        /// </summary>
        private string maxNumberOfThreadsSettingsKey = "ItemCommander.MaxNumberOfThreads";

        /// <summary>
        /// The folder template identifier
        /// </summary>
        private string FolderTemplateId = "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}";

        /// <summary>
        /// The maximum number of threads
        /// </summary>
        private readonly int MaximumNumberOfThreads;

        /// <summary>
        /// Initializes a new instance of the <see cref="ItemRepository"/> class.
        /// </summary>
        public ItemRepository()
        {
            if (this.database == null)
            {
                this.database = Sitecore.Data.Database.GetDatabase("master");
            }

            if (progressStatus == null)
            {
                progressStatus = new ConcurrentDictionary<Guid, ConcurrentQueue<string>>();
            }

            this.MaximumNumberOfThreads = Settings.GetIntSetting(maxNumberOfThreadsSettingsKey, 5);
        }

        #region Sitecore Entity Service implementations

        //GET
        public ItemResponse FindById(string id)
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Gets all.
        /// </summary>
        /// <returns>Item response</returns>
        /// <exception cref="NotImplementedException"></exception>
        public IQueryable<ItemResponse> GetAll()
        {
            throw new NotImplementedException();
        }

        //POST
        public void Add(ItemResponse entity)
        {
            throw new NotImplementedException();
        }

        public bool Exists(ItemResponse entity)
        {
            if (string.IsNullOrEmpty(entity.Id))
            {
                return false;
            }

            return database.GetItem(new ID(entity.Id)) != null;
        }

        //PUT
        public void Update(ItemResponse entity)
        {
            throw new NotImplementedException();
        }

        //DELETE
        public void Delete(ItemResponse entity)
        {
            throw new NotImplementedException();
        }

        #endregion Sitecore Entity Service implementations

        #region Custom Repository implementations

        /// <summary>
        /// Creates the item.
        /// </summary>
        /// <param name="createItemRequest">The folder.</param>
        /// <param name="db">The database.</param>
        public void CreateItem(CreateItemRequest createItemRequest, string db)
        {
            this.SetDatabase(db);

            var targetItem = database.GetItem(createItemRequest.TargetPath);
            targetItem.Add(createItemRequest.Name, new TemplateID(new ID(createItemRequest.TemplateId)));
        }

        /// <summary>
        /// Gets the remaining count.
        /// </summary>
        /// <param name="processId">The process identifier.</param>
        /// <returns>The progress response</returns>
        public ProgressResponse GetRemainingCount(Guid processId)
        {
            ConcurrentQueue<string> queue;
            if (progressStatus.Count == 1)
            {
                processId = progressStatus.Keys.FirstOrDefault();
            }

            if (progressStatus.TryGetValue(processId, out queue) && queue.Count > 0)
            {
                return new ProgressResponse { RemainingCount = queue.Count };
            }
            else
            {
                progressStatus.TryRemove(processId, out queue);

                List<string> errorList = new List<string>();
                if (errors != null && errors.TryRemove(processId, out errorList))
                {
                    return new ProgressResponse { RemainingCount = 0, ErrorResult = errorList };
                }

                return new ProgressResponse { RemainingCount = 0, ErrorResult = null };
            }
        }

        /// <summary>
        /// Copies the specified query.
        /// </summary>
        /// <param name="copyRequest">The query.</param>
        /// <param name="db">The database.</param>
        public ProcessResponse Copy(CopyRequest copyRequest, string db)
        {
            this.SetDatabase(db);

            var processId = Guid.NewGuid();
            progressStatus.TryAdd(processId, new ConcurrentQueue<string>());
            var targetItem = this.database.GetItem(copyRequest.TargetPath);
            copyRequest.Items.ForEach(t => progressStatus[processId].Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < this.MaximumNumberOfThreads; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (progressStatus[processId].TryDequeue(out itemId))
                    {
                        try
                        {
                            var sourceItem = database.GetItem(new ID(itemId));
                            sourceItem.CopyTo(targetItem, sourceItem.Name, new ID(Guid.NewGuid()), copyRequest.CopySubItems);
                        }
                        catch (Exception ex)
                        {
                            List<string> errorMessages = new List<string>();
                            if (errors == null)
                            {
                                errors = new ConcurrentDictionary<Guid, List<string>>();
                            }

                            if (errors.TryGetValue(processId, out errorMessages))
                            {
                                var newErrors = new List<string>();
                                newErrors.AddRange(errorMessages);
                                newErrors.Add(ex.Message + " Item Id: " + itemId);
                                errors.TryUpdate(processId, newErrors, errorMessages);
                            }
                            else
                            {
                                errors.TryAdd(processId, new List<string> { ex.Message + " Item Id: " + itemId });
                            }
                        }
                    }
                };

                actions.Add(action);
            }

            Task.Run(() => Parallel.Invoke(actions.ToArray()));

            return new ProcessResponse { StatusId = processId };
        }

        /// <summary>
        /// Copies the single.
        /// </summary>
        /// <param name="copySingleRequest">The query.</param>
        /// <param name="db">The database.</param>
        public void CopySingle(CopySingle copySingleRequest, string db)
        {
            this.SetDatabase(db);

            var targetItem = this.database.GetItem(copySingleRequest.TargetPath);
            var sourceItem = this.database.GetItem(new ID(copySingleRequest.Item));

            sourceItem.CopyTo(targetItem, copySingleRequest.Name, new ID(Guid.NewGuid()), copySingleRequest.CopySubItems);
        }

        /// <summary>
        /// Moves the specified query.
        /// </summary>
        /// <param name="moveRequest">The query.</param>
        /// <param name="db">The database.</param>
        public ProcessResponse Move(MoveRequest moveRequest, string db)
        {
            this.SetDatabase(db);

            var processId = Guid.NewGuid();
            progressStatus.TryAdd(processId, new ConcurrentQueue<string>());

            var targetItem = this.database.GetItem(moveRequest.TargetPath);
            moveRequest.Items.ForEach(t => progressStatus[processId].Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < this.MaximumNumberOfThreads; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (progressStatus[processId].TryDequeue(out itemId))
                    {
                        try
                        {
                            var sourceItem = database.GetItem(new ID(itemId));
                            sourceItem.MoveTo(targetItem);
                        }
                        catch (Exception ex)
                        {
                            List<string> errorMessages = new List<string>();
                            if (errors == null)
                            {
                                errors = new ConcurrentDictionary<Guid, List<string>>();
                            }

                            if (errors.TryGetValue(processId, out errorMessages))
                            {
                                var newErrors = new List<string>();
                                newErrors.AddRange(errorMessages);
                                newErrors.Add(ex.Message + " Item Id: " + itemId);
                                errors.TryUpdate(processId, newErrors, errorMessages);
                            }
                            else
                            {
                                errors.TryAdd(processId, new List<string> { ex.Message + " Item Id: " + itemId });
                            }
                        }
                    }
                };

                actions.Add(action);
            }

            Task.Run(() => Parallel.Invoke(actions.ToArray()));

            return new ProcessResponse { StatusId = processId };
        }

        /// <summary>
        /// Deletes the specified query.
        /// </summary>
        /// <param name="deleteRequest">The query.</param>
        /// <param name="db">The database.</param>
        public ProcessResponse Delete(DeleteRequest deleteRequest, string db)
        {
            this.SetDatabase(db);
            var processId = Guid.NewGuid();
            progressStatus.TryAdd(processId, new ConcurrentQueue<string>());
            deleteRequest.Items.ForEach(t => progressStatus[processId].Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < this.MaximumNumberOfThreads; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (progressStatus[processId].TryDequeue(out itemId))
                    {
                        try
                        {
                            var sourceItem = this.database.GetItem(new ID(itemId));
                            sourceItem.Delete();
                        }
                        catch (Exception ex)
                        {
                            List<string> errorMessages = new List<string>();
                            if (errors == null)
                            {
                                errors = new ConcurrentDictionary<Guid, List<string>>();
                            }

                            if (errors.TryGetValue(processId, out errorMessages))
                            {
                                var newErrors = new List<string>();
                                newErrors.AddRange(errorMessages);
                                newErrors.Add(ex.Message + " Item Id: " + itemId);
                                errors.TryUpdate(processId, newErrors, errorMessages);
                            }
                            else
                            {
                                errors.TryAdd(processId, new List<string> { ex.Message + " Item Id: " + itemId });
                            }
                        }
                    }
                };

                actions.Add(action);
            }

            Task.Run(() => Parallel.Invoke(actions.ToArray()));

            return new ProcessResponse { StatusId = processId };
        }

        /// <summary>
        /// Locks/unlocks the specified item.
        /// </summary>
        /// <param name="lockRequest">The lock request.</param>
        /// <param name="db">The database.</param>
        public ProcessResponse Lock(LockRequest lockRequest, string db)
        {
            this.SetDatabase(db);
            var processId = Guid.NewGuid();
            progressStatus.TryAdd(processId, new ConcurrentQueue<string>());
            lockRequest.Items.ForEach(t => progressStatus[processId].Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < this.MaximumNumberOfThreads; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (progressStatus[processId].TryDequeue(out itemId))
                    {
                        var scItem = this.database.GetItem(new ID(itemId));
                        try
                        {
                            if (scItem.Locking.IsLocked() && !lockRequest.Lock)
                            {
                                if (!scItem.Locking.CanUnlock())
                                {
                                    throw new Exception("Item cannot be unlocked with the current user");
                                }

                                scItem.Locking.Unlock();
                            }
                            else if (!scItem.Locking.IsLocked() && lockRequest.Lock)
                            {
                                scItem.Locking.Lock();
                            }
                        }
                        catch (Exception ex)
                        {
                            List<string> errorMessages = new List<string>();
                            if (errors == null)
                            {
                                errors = new ConcurrentDictionary<Guid, List<string>>();
                            }

                            if (errors.TryGetValue(processId, out errorMessages))
                            {
                                var newErrors = new List<string>();
                                newErrors.AddRange(errorMessages);
                                newErrors.Add(ex.Message + " Item Id: " + itemId);
                                errors.TryUpdate(processId, newErrors, errorMessages);
                            }
                            else
                            {
                                errors.TryAdd(processId, new List<string> { ex.Message + " Item Id: " + itemId });
                            }
                        }
                    }
                };

                actions.Add(action);
            }

            Task.Run(() => Parallel.Invoke(actions.ToArray()));

            return new ProcessResponse { StatusId = processId };
        }

        /// <summary>
        /// Gets the items.
        /// </summary>
        /// <param name="ids">The ids.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// List of items by ids
        /// </returns>
        public List<Item> GetItems(List<string> ids, string db)
        {
            this.SetDatabase(db);

            return ids.Select(t => this.database.GetItem(new ID(t))).ToList();
        }

        /// <summary>
        /// Gets the insert options.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// List of insert options are available for the item
        /// </returns>
        public List<ItemResponse> GetInsertOptions(string id, string db)
        {
            this.SetDatabase(db);

            var item = this.database.GetItem(new ID(id));

            var insertOptions = item["__Masters"];

            List<ItemResponse> result = new List<ItemResponse>();

            var templateIds = insertOptions.Split('|');
            if (!string.IsNullOrEmpty(insertOptions) && templateIds.Any())
            {
                foreach (var templateId in templateIds)
                {
                    var templateItem = this.database.GetItem(new ID(templateId));
                    result.Add(new ItemResponse
                    {
                        Name = templateItem.Name,
                        Id = templateItem.ID.ToString(),
                        Language = templateItem.Language.ToString(),
                        Path = templateItem.Paths.FullPath,
                        TemplateName = templateItem.TemplateName,
                        Fields = new List<FieldResponse>(),
                        HasChildren = templateItem.HasChildren,
                        LastModified = templateItem.Statistics.Updated,
                        Created = templateItem.Statistics.Created,
                        Icon = GetIcon(templateItem)
                    });
                }
            }

            var folderItem = this.database.GetItem(new ID(this.FolderTemplateId));

            if (result.FirstOrDefault(t => t.Name == "Folder") == null)
            {
                result.Insert(0, new ItemResponse
                {
                    Name = folderItem.Name,
                    Id = folderItem.ID.ToString(),
                    Language = folderItem.Language.ToString(),
                    Path = folderItem.Paths.FullPath,
                    TemplateName = folderItem.TemplateName,
                    Fields = new List<FieldResponse>(),
                    HasChildren = folderItem.HasChildren,
                    LastModified = folderItem.Statistics.Updated,
                    Created = folderItem.Statistics.Created,
                    Icon = GetIcon(folderItem)
                });
            }

            return result;
        }

        /// <summary>
        /// Gets the media URL.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// The media url by id and database
        /// </returns>
        public string GetMediaUrl(string id, string db)
        {
            this.SetDatabase(db);

            var item = this.database.GetItem(new ID(id));

            if (item == null)
            {
                return string.Empty;
            }

            return MediaManager.GetMediaUrl(new MediaItem(item));
        }

        /// <summary>
        /// Gets the fast view.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// Fast view contract
        /// </returns>
        public FastViewResponse GetFastView(string id, string db)
        {
            this.SetDatabase(db);

            var item = database.GetItem(new ID(id));
            FastViewResponse vr = new FastViewResponse();
            vr.Item = new ItemResponse
            {
                Name = item.Name,
                Id = item.ID.ToString(),
                Language = item.Language.ToString(),
                Path = item.Paths.FullPath,
                TemplateName = item.TemplateName,
                TemplateId = item.TemplateID.ToString(),
                ParentId = item.ParentID.ToString(),
                Fields = new List<FieldResponse>(),
                HasChildren = item.HasChildren,
                LastModified = item.Statistics.Updated,
                Created = item.Statistics.Created,
                Icon = GetIcon(item),
                IsLocked = item.Locking.IsLocked(),
                IsHidden = item["__Hidden"] == "1"
            };

            vr.Languages = item.Languages.Select(t => t.Name).ToList();
            vr.Data = new Dictionary<string, Dictionary<string, List<FieldResponse>>>();

            foreach (var language in item.Languages)
            {
                var sitecoreItem = database.GetItem(new ID(id), language);

                ItemResponse entity = new ItemResponse
                {
                    Name = sitecoreItem.Name,
                    Id = sitecoreItem.ID.ToString(),
                    Language = sitecoreItem.Language.ToString(),
                    Path = sitecoreItem.Paths.FullPath,
                    TemplateName = sitecoreItem.TemplateName,
                    Fields = new List<FieldResponse>()
                };

                foreach (Field field in sitecoreItem.Fields)
                {
                    entity.Fields.Add(new FieldResponse
                    {
                        Name = field.Name,
                        Value = field.Value,
                        Id = field.ID.ToString(),
                        Type = field.Type,
                        SectionName = field.Section
                    });
                }

                vr.Data.Add(language.Name, entity.Fields.GroupBy(t => t.SectionName).OrderBy(t => standardFields.Contains(t.Key)).ThenBy(t => t.Key).ToDictionary(t => t.Key, t => t.ToList()));
            }

            return vr;
        }

        /// <summary>
        /// Gets the media view.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// Media view contract
        /// </returns>
        public MediaViewResponse GetMediaView(string id, string db)
        {
            this.SetDatabase(db);

            var item = database.GetItem(new ID(id));
            MediaViewResponse vr = null;

            if (item.Paths.IsMediaItem && item.TemplateName != Constants.MediaFolderTemplateName)
            {
                vr = new MediaViewResponse
                {
                    IsMedia = true,
                    Name = item.Name,
                    Id = item.ID.ToString(),
                    Path = item.Paths.FullPath,
                    Icon = GetIcon(item),
                    MimeType = item["Mime Type"],
                    Extenions = item["Extension"],
                    Size = item["Size"]
                };

                var mediaItem = new MediaItem(item);
                vr.Src = MediaManager.GetMediaUrl(mediaItem);

                if (Constants.VideoAudioTemplates.Contains(item.TemplateName))
                {
                    vr.MediaType = "video";
                }
                else if (Constants.ImageTemplates.Contains(item.TemplateName))
                {
                    vr.MediaType = "image";
                    vr.Src = HashingUtils.ProtectAssetUrl(MediaManager.GetMediaUrl(mediaItem, new MediaUrlOptions { MaxWidth = 640 }));
                }
                else
                {
                    vr.MediaType = "other";
                }
            }
            else
            {
                vr = new MediaViewResponse
                {
                    IsMedia = false
                };
            }

            return vr;
        }

        /// <summary>
        /// Renames the specified request.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <param name="db">The database.</param>
        public ProcessResponse Rename(RenameRequest request, string db)
        {
            this.SetDatabase(db);
            var processId = Guid.NewGuid();
            progressStatus.TryAdd(processId, new ConcurrentQueue<string>());
            request.Items.ForEach(t => progressStatus[processId].Enqueue(t));

            Action action = () =>
            {
                string itemId;
                while (progressStatus[processId].TryDequeue(out itemId))
                {
                    try
                    {
                        var item = this.database.GetItem(new ID(itemId));

                        using (new EditContext(item))
                        {
                            item.Name = this.GetName(item.Name, request.NameOrPattern, request.Items.IndexOf(itemId));
                        }
                    }
                    catch (Exception ex)
                    {
                        List<string> errorMessages = new List<string>();
                        if (errors == null)
                        {
                            errors = new ConcurrentDictionary<Guid, List<string>>();
                        }

                        if (errors.TryGetValue(processId, out errorMessages))
                        {
                            var newErrors = new List<string>();
                            newErrors.AddRange(errorMessages);
                            newErrors.Add(ex.Message + " Item Id: " + itemId);
                            errors.TryUpdate(processId, newErrors, errorMessages);
                        }
                        else
                        {
                            errors.TryAdd(processId, new List<string> { ex.Message + " Item Id: " + itemId });
                        }
                    }
                }
            };

            Task.Run(() => Parallel.Invoke(new Action[] { action }));

            return new ProcessResponse { StatusId = processId };
        }

        /// <summary>
        /// Gets the children.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// Children list
        /// </returns>
        public ItemCommanderResponse GetChildren(string id, string db)
        {
            this.SetDatabase(db);

            var itemCommanderResponse = new ItemCommanderResponse();
            var sitecoreItem = this.database.GetItem(new Sitecore.Data.ID(id));
            itemCommanderResponse.CurrentPath = sitecoreItem.Paths.FullPath;
            itemCommanderResponse.CurrentId = id;
            itemCommanderResponse.ParentId = sitecoreItem.ParentID.ToString();

            itemCommanderResponse.Children = sitecoreItem.Children.Select(t => new ItemResponse
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
                Icon = GetIcon(t),
                IsLocked = t.Locking.IsLocked(),
                IsHidden = t["__Hidden"] == "1"
            }).ToList();

            return itemCommanderResponse;
        }

        /// <summary>
        /// Searches the specified keyword.
        /// </summary>
        /// <param name="keyword">The keyword.</param>
        /// <param name="db">The database.</param>
        /// <returns>
        /// Search result by keyword
        /// </returns>
        public ItemCommanderResponse Search(string keyword, string db)
        {
            this.SetDatabase(db);
            var itemCommanderResponse = new ItemCommanderResponse();

            if (keyword.StartsWith("/"))
            {
                itemCommanderResponse.Children = this.database.SelectItems(keyword).Select(t => new ItemResponse
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
                    Icon = GetIcon(t)
                }).ToList();
                itemCommanderResponse.CurrentId = "";
            }
            else
            {
                using (var searchContext = this.GetSearchIndex().CreateSearchContext())
                {
                    var queryable = searchContext.GetQueryable<ItemCommanderSearchResult>();
                    var predicate = PredicateBuilder.True<ItemCommanderSearchResult>();
                    var subPredicate = PredicateBuilder.True<ItemCommanderSearchResult>();

                    predicate = predicate.And(t => t.Path.StartsWith("/sitecore/content"));
                    predicate = predicate.And(t => t.IsLatestVersion == true);
                    predicate = predicate.And(t => t.Language == "en");
                    subPredicate = subPredicate.Or(t => t.Name.Contains(keyword));
                    subPredicate = subPredicate.Or(t => t.Content.Contains(keyword));
                    predicate = predicate.And(subPredicate);

                    queryable = queryable.Filter(predicate);
                    var results = queryable.GetResults().Where(t => t.Document.GetItem() != null);
                    itemCommanderResponse.Children = results.Select(t => new ItemResponse
                    {
                        Name = t.Document.Name,
                        Id = t.Document.ItemId.ToString(),
                        Language = t.Document.Language.ToString(),
                        Path = t.Document.Path,
                        TemplateName = t.Document.TemplateName,
                        Fields = new List<FieldResponse>(),
                        HasChildren = t.Document.GetItem().HasChildren,
                        LastModified = t.Document.Updated,
                        Created = t.Document.CreatedDate,
                        Icon = GetIcon(t.Document.GetItem())
                    }).ToList();
                    itemCommanderResponse.CurrentId = ""; // it should be empty string for the frontend
                }
            }
            
            return itemCommanderResponse;
        }

        public EditorResponse GetEditorOptions(string id, string db)
        {
            this.SetDatabase(db);

            var item = this.database.GetItem(new ID(id));

            var response = new EditorResponse();

            if (item != null)
            {
                var versions = GetLanguageVersions(item);
                var finalVersion = versions.OrderBy(t => t.Statistics.Updated).Last();

                response.Languages = versions.Select(t => t.Language.Name).ToList();
                response.HasPresentation = finalVersion.Visualization.Layout != null;
            }

            return response;
        }

        #endregion Custom Repository implementations

        /// <summary>
        /// Collect the latest language versions of the item
        /// </summary>
        /// <param name="sitecoreItem">The item</param>
        /// <returns>The language versions</returns>
        private Sitecore.Data.Items.Item[] GetLanguageVersions(Sitecore.Data.Items.Item sitecoreItem)
        {
            var languages = sitecoreItem.Languages;
            List<Sitecore.Data.Items.Item> versions = new List<Sitecore.Data.Items.Item>();
            foreach (var language in languages)
            {
                var finalVersion = sitecoreItem.Versions.GetLatestVersion(language);
                if (finalVersion.Statistics.Created > DateTime.MinValue)
                {
                    versions.Add(finalVersion);
                }
            }

            if (versions.Count == 0)
            {
                versions.Add(sitecoreItem);
            }

            return versions.ToArray();
        }

        /// <summary>
        /// Gets the name.
        /// </summary>
        /// <param name="name">The name.</param>
        /// <param name="pattern">The pattern.</param>
        /// <param name="count">The count.</param>
        /// <returns>The calculated item name</returns>
        private string GetName(string name, string pattern, int count)
        {
            return pattern.Replace("{C}", count.ToString())
                .Replace("{OldName}", name)
                .Replace("{yyyy}", DateTime.Now.ToString("yyyy"))
                .Replace("{MM}", DateTime.Now.ToString("MM"))
                .Replace("{dd}", DateTime.Now.ToString("dd"))
                .Replace("{hh}", DateTime.Now.ToString("hh"))
                .Replace("{mm}", DateTime.Now.ToString("mm"))
                .Replace("{ss}", DateTime.Now.ToString("ss"));
        }

        /// <summary>
        /// Gets the index of the search.
        /// </summary>
        /// <returns>Returns with the search index.</returns>
        private ISearchIndex GetSearchIndex()
        {
            try
            {
                return ContentSearchManager.GetIndex(string.Format("sitecore_{0}_index", database.Name));
            }
            catch (Exception exce)
            {
                Sitecore.Diagnostics.Log.Error("Error at the search service. May the index was not found?", exce, this);
            }

            return null;
        }

        /// <summary>
        /// Gets the icon of the item
        /// </summary>
        /// <param name="sitecoreItem">The item</param>
        /// <returns>The icon path</returns>
        public static string GetIcon(Sitecore.Data.Items.Item sitecoreItem)
        {
            if (sitecoreItem == null)
            {
                return "";
            }
            string iconImageRaw = ThemeManager.GetIconImage(sitecoreItem, 32, 32, "", "");
            if (!string.IsNullOrWhiteSpace(iconImageRaw) && iconImageRaw.Contains("src="))
            {
                int i0 = iconImageRaw.IndexOf("src=");
                int i1 = iconImageRaw.IndexOf('"', i0 + 1);
                if (i1 < 0)
                {
                    return null;
                }

                int i2 = iconImageRaw.IndexOf('"', i1 + 1);
                if (i2 < 0)
                {
                    return null;
                }

                return iconImageRaw.Substring(i1, i2 - i1).Trim(' ', '"', '\\');
            }

            return null;
        }

        /// <summary>
        /// Sets the database.
        /// </summary>
        /// <param name="db">The database.</param>
        private void SetDatabase(string db)
        {
            this.database = Factory.GetDatabase(db);
        }
    }
}