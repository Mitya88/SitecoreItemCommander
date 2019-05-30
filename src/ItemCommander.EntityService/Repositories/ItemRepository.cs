namespace ItemCommander.EntityService.Repositories
{
    using System;
    using System.Collections;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using ItemCommander.EntityService.Interfaces;
    using ItemCommander.EntityService.Models;
    using Sitecore;
    using Sitecore.ContentSearch;
    using Sitecore.ContentSearch.Linq;
    using Sitecore.ContentSearch.Linq.Utilities;
    using Sitecore.ContentSearch.SearchTypes;
    using Sitecore.Data;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Data.Managers;
    using Sitecore.Globalization;
    using Sitecore.SecurityModel;

    public class ItemRepository : IGenericItemRepository<GenericItemEntity>
    {
        private Database database;

        private static ConcurrentQueue<string> queue;
        public ItemRepository()
        {
            if(database == null)
            {
                database = Sitecore.Data.Database.GetDatabase("master");
            }
            if (queue ==null)
            {
                queue = new ConcurrentQueue<string>();
            }
        }

        public IQueryable<GenericItemEntity> GetAll()
        {
            throw new NotImplementedException();
        }

        List<string> standardFields = new List<string>() { "Statistics", "Lifetime", "Security", "Help", "Appearance", "Insert Options", "Workflow", "Publishing", "Tasks", "Validation Rules" };
        public FastViewResponse GetFastView(string id, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var item = database.GetItem(new ID(id));
            FastViewResponse vr = new FastViewResponse();
            vr.Item = new GenericItemEntity
            {
                Name = item.Name,
                Id = item.ID.ToString(),
                Language = item.Language.ToString(),
                Path = item.Paths.FullPath,
                TemplateName = item.TemplateName,
                TemplateId = item.TemplateID.ToString(),
                ParentId = item.ParentID.ToString(),
                Fields = new List<FieldDto>(),
                HasChildren = item.HasChildren,
                LastModified = item.Statistics.Updated,
                Created = item.Statistics.Created,
                Icon = GetIcon(item),
                IsLocked = item.Locking.IsLocked(),
                IsHidden = item["__Hidden"] == "1"
            };
            vr.Languages = item.Languages.Select(t => t.Name).ToList();

            vr.Data = new Dictionary<string, Dictionary<string, List<FieldDto>>>();
            foreach (var language in item.Languages)
            {
                var sitecoreItem = database.GetItem(new ID(id), language);

                GenericItemEntity entity = new GenericItemEntity
                {
                    Name = sitecoreItem.Name,
                    Id = sitecoreItem.ID.ToString(),
                    Language = sitecoreItem.Language.ToString(),
                    Path = sitecoreItem.Paths.FullPath,
                    TemplateName = sitecoreItem.TemplateName,
                    Fields = new List<FieldDto>()
                };

                foreach (Field field in sitecoreItem.Fields)
                {
                    entity.Fields.Add(new FieldDto
                    {
                        Name = field.Name,
                        Value = field.Value,
                        Id = field.ID.ToString(),
                        Type = field.Type,
                        SectionName = field.Section
                    });
                }

                vr.Data.Add(language.Name, entity.Fields.GroupBy(t => t.SectionName).OrderBy(t=> standardFields.Contains(t.Key)).ThenBy(t=>t.Key).ToDictionary(t=>t.Key, t=>t.ToList() ));
            }

            return vr;
        }

        public ItemCommanderResponse GetChildren(string id, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var itemCommanderResponse = new ItemCommanderResponse();
            var sitecoreItem = database.GetItem(new Sitecore.Data.ID(id));
            itemCommanderResponse.CurrentPath = sitecoreItem.Paths.FullPath;
            itemCommanderResponse.CurrentId = id;
            itemCommanderResponse.ParentId = sitecoreItem.ParentID.ToString();

            itemCommanderResponse.Children = sitecoreItem.Children.Select(t => new GenericItemEntity
            {
                Name = t.Name,
                Id = t.ID.ToString(),
                Language = t.Language.ToString(),
                Path = t.Paths.FullPath,
                TemplateName = t.TemplateName,
                Fields = new List<FieldDto>(),
                HasChildren = t.HasChildren,
                LastModified = t.Statistics.Updated,
                Created = t.Statistics.Created,
                Icon = GetIcon(t),
                IsLocked = t.Locking.IsLocked(),
                IsHidden = t["__Hidden"] == "1"
            }).ToList();

            return itemCommanderResponse;
        }

        public ItemCommanderResponse Search(string keyword, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var itemCommanderResponse = new ItemCommanderResponse();



            using (var searchContext = GetSearchIndex().CreateSearchContext())
            {
                var queryable = searchContext.GetQueryable<SearchResultItem>();

                var predicate = PredicateBuilder.True<SearchResultItem>();
                var subPredicate = PredicateBuilder.True<SearchResultItem>();
                predicate = predicate.And(t => t.Path.StartsWith("/sitecore/content"));
                subPredicate = subPredicate.Or(t => t.Name.Contains(keyword));
                subPredicate = subPredicate.Or(t => t.Content.Contains(keyword));
                predicate = predicate.And(subPredicate);

                queryable = queryable.Filter(predicate);
                var results = queryable.GetResults().Where(t=>t.Document.GetItem() != null);
                itemCommanderResponse.Children = results.Select(t => new GenericItemEntity
                {
                    Name = t.Document.Name,
                    Id = t.Document.ItemId.ToString(),
                    Language = t.Document.Language.ToString(),
                    Path = t.Document.Path,
                    TemplateName = t.Document.TemplateName,
                    Fields = new List<FieldDto>(),
                    HasChildren = t.Document.GetItem().HasChildren,
                    LastModified = t.Document.Updated,
                    Created = t.Document.CreatedDate,
                    Icon = GetIcon(t.Document.GetItem())
                }).ToList();
                itemCommanderResponse.CurrentId = "";
            }
            return itemCommanderResponse;
        }

        /// <summary>
        /// Gets the index of the search.
        /// </summary>
        /// <returns>Returns with the search index.</returns>
        public ISearchIndex GetSearchIndex()
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
        private string GetIcon(Sitecore.Data.Items.Item sitecoreItem)
        {
            if(sitecoreItem == null)
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


        //GET
        ///sitecore/api/ssc/Possible-GenericEntityService-Controllers/Entity/{80FDC514-CD6A-4EEF-B9C2-6CFA82B0F37A}
        public GenericItemEntity FindById(string id)
        {
            var sitecoreItem = database.GetItem(new Sitecore.Data.ID(id));



            GenericItemEntity item = new GenericItemEntity
            {
                Name = sitecoreItem.Name,
                Id = sitecoreItem.ID.ToString(),
                Language = sitecoreItem.Language.ToString(),
                Path = sitecoreItem.Paths.FullPath,
                TemplateName = sitecoreItem.TemplateName,
                Fields = new List<FieldDto>()
            };

            foreach(Field field in sitecoreItem.Fields)
            {
                item.Fields.Add(new FieldDto
                {
                    Name = field.Name,
                    Value = field.Value,
                    Id = field.ID.ToString()
                });
            }

            return item;
        }

        public GenericItemEntity FindById(string id, string language)
        {
            GenericItemEntity item;
            using (new LanguageSwitcher(Language.Parse(language)))
            {
                item = FindById(id);
            }

            return item;
        }

        //POST
        public void Add(GenericItemEntity entity)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(entity.Language)))
                {

                    var targetItem = database.GetItem(new ID(entity.ParentId));

                    var item = targetItem.Add(entity.Name, new TemplateID(new ID(entity.TemplateId)), new ID(entity.Id));
                }
            }
        }

        // ????
        public bool Exists(GenericItemEntity entity)
        {

            if(string.IsNullOrEmpty(entity.Id))
            {
                return false;
            }

            return database.GetItem(new ID(entity.Id)) != null;
        }


        //PUT
        public void Update(GenericItemEntity entity)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(entity.Language)))
                {

                    var targetItem = database.GetItem(new ID(entity.Id));
                    using (new EditContext(targetItem))
                    {
                        foreach(var field in entity.Fields)
                        {
                            targetItem[field.Name] = field.Value;
                        }                        
                    }
                }
            }
        }

        //DELETE
        public void Delete(GenericItemEntity entity)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(entity.Language)))
                {

                    var targetItem = database.GetItem(new ID(entity.Id));

                    targetItem.Delete();
                }
            }
        }

        public string FolderTemplate = "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}";

        public void CreateItem(CreateItemRequest folder, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var targetItem = database.GetItem(folder.TargetPath);
            using (new SecurityDisabler())
            {
                targetItem.Add(folder.Name, new TemplateID(new ID(folder.TemplateId)));
            }
        }

        public void Copy(CopyRequest query, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var targetItem = database.GetItem(query.TargetPath);
            query.Items.ForEach(t => queue.Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < query.Items.Count; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (queue.TryDequeue(out itemId))
                    {
                        using (new SecurityDisabler())
                        {
                            var sourceITem = database.GetItem(new ID(itemId));

                            sourceITem.CopyTo(targetItem, sourceITem.Name, new ID(Guid.NewGuid()), false);
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }
        public void CopySingle(CopySingle query, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var targetItem = database.GetItem(query.TargetPath);
            using (new SecurityDisabler())
            {
                var sourceITem = database.GetItem(new ID(query.Item));

                sourceITem.CopyTo(targetItem, query.Name, new ID(Guid.NewGuid()), false);
            }
        }
        public void Move(MoveRequest query, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            var targetItem = database.GetItem(query.TargetPath);
            query.Items.ForEach(t => queue.Enqueue(t));


            List<Action> actions = new List<Action>();

            for (int i = 0; i < query.Items.Count; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (queue.TryDequeue(out itemId))
                    {
                        using (new SecurityDisabler())
                        {
                            var sourceITem = database.GetItem(new ID(itemId));

                            sourceITem.MoveTo(targetItem);
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }

        public void Delete(DeleteRequest query, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            query.Items.ForEach(t => queue.Enqueue(t));

            List<Action> actions = new List<Action>();

            for (int i = 0; i < query.Items.Count; i++)
            {
                Action action = () =>
                {
                    string itemId;
                    while (queue.TryDequeue(out itemId))
                    {
                        using (new SecurityDisabler())
                        {
                            var sourceITem = database.GetItem(new ID(itemId));

                            sourceITem.Delete();
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }

        public void Lock(LockRequest lockRequest, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            foreach(var item in lockRequest.Items)
            {
                var scItem = database.GetItem(new ID(item));

                if(scItem.Locking.IsLocked() && !lockRequest.Lock)
                {
                    scItem.Locking.Unlock();
                } else if(!scItem.Locking.IsLocked() && lockRequest.Lock)
                {
                    scItem.Locking.Lock();
                }

            }
        }

        public List<Item> GetItems(List<string> ids, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);
            return ids.Select(t => database.GetItem(new ID(t))).ToList();
        }

        public List<GenericItemEntity> GetInsertOptions(string id, string db)
        {
            database = Sitecore.Configuration.Factory.GetDatabase(db);

            var item = database.GetItem(new ID(id));

            var insertOptions = item["__Masters"];

            List<GenericItemEntity> result = new List<GenericItemEntity>();

            var templateIds = insertOptions.Split('|');
            if (!string.IsNullOrEmpty(insertOptions) && templateIds.Any())
            {
                foreach(var templateId in templateIds)
                {
                    var templateItem = this.database.GetItem(new ID(templateId));
                    result.Add(new GenericItemEntity
                    {
                        Name = templateItem.Name,
                        Id = templateItem.ID.ToString(),
                        Language = templateItem.Language.ToString(),
                        Path = templateItem.Paths.FullPath,
                        TemplateName = templateItem.TemplateName,
                        Fields = new List<FieldDto>(),
                        HasChildren = templateItem.HasChildren,
                        LastModified = templateItem.Statistics.Updated,
                        Created = templateItem.Statistics.Created,
                        Icon = GetIcon(templateItem)
                    });
                }
               
            }

            var folderItem = database.GetItem(new ID("{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}"));

            if(result.FirstOrDefault(t=>t.Name == "Folder") == null)
            {
                result.Insert(0, new GenericItemEntity
                {
                    Name = folderItem.Name,
                    Id = folderItem.ID.ToString(),
                    Language = folderItem.Language.ToString(),
                    Path = folderItem.Paths.FullPath,
                    TemplateName = folderItem.TemplateName,
                    Fields = new List<FieldDto>(),
                    HasChildren = folderItem.HasChildren,
                    LastModified = folderItem.Statistics.Updated,
                    Created = folderItem.Statistics.Created,
                    Icon = GetIcon(folderItem)
                });
            }
           

            return result;
            
        }
    }
}