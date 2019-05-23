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
    using Sitecore.Data;
    using Sitecore.Data.Fields;
    using Sitecore.Data.Items;
    using Sitecore.Data.Managers;
    using Sitecore.Globalization;
    using Sitecore.SecurityModel;

    public class ItemRepository : IGenericItemRepository<GenericItemEntity>
    {
        private readonly Database database;

        private static ConcurrentQueue<string> queue;
        public ItemRepository()
        {
            this.database = Sitecore.Data.Database.GetDatabase("master");
            if (queue ==null)
            {
                queue = new ConcurrentQueue<string>();
            }
        }
        public IQueryable<GenericItemEntity> GetAll()
        {
            throw new NotImplementedException();
        }

        public ItemCommanderResponse GetChildren(string id)
        {
            var itemCommanderResponse = new ItemCommanderResponse();
            var sitecoreItem = this.database.GetItem(new Sitecore.Data.ID(id));
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
                Icon =GetIcon(t)
            }).ToList();

            return itemCommanderResponse;
        }


        /// <summary>
        /// Gets the icon of the item
        /// </summary>
        /// <param name="sitecoreItem">The item</param>
        /// <returns>The icon path</returns>
        private string GetIcon(Sitecore.Data.Items.Item sitecoreItem)
        {
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
            var sitecoreItem = this.database.GetItem(new Sitecore.Data.ID(id));



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

                    var targetItem = this.database.GetItem(new ID(entity.ParentId));

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

            return this.database.GetItem(new ID(entity.Id)) != null;
        }


        //PUT
        public void Update(GenericItemEntity entity)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(entity.Language)))
                {

                    var targetItem = this.database.GetItem(new ID(entity.Id));
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

                    var targetItem = this.database.GetItem(new ID(entity.Id));

                    targetItem.Delete();
                }
            }
        }

        public string FolderTemplate = "{A87A00B1-E6DB-45AB-8B54-636FEC3B5523}";

        public void PublishItem(string id, string target, string language)
        {
            
        }

        public void CreateFolder(FolderRequest folder)
        {
            var targetItem = this.database.GetItem(folder.TargetPath);
            using (new SecurityDisabler())
            {
                targetItem.Add(folder.Name, new TemplateID(new ID(FolderTemplate)));
            }
        }

        public void Copy(CopyRequest query)
        {

            var targetItem = this.database.GetItem(query.TargetPath);
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
                            var sourceITem = this.database.GetItem(new ID(itemId));

                            sourceITem.CopyTo(targetItem, sourceITem.Name, new ID(Guid.NewGuid()), false);
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }
        public void CopySingle(CopySingle query)
        {

            var targetItem = this.database.GetItem(query.TargetPath);
            using (new SecurityDisabler())
            {
                var sourceITem = this.database.GetItem(new ID(query.Item));

                sourceITem.CopyTo(targetItem, query.Name, new ID(Guid.NewGuid()), false);
            }
        }
        public void Move(MoveRequest query)
        {

            var targetItem = this.database.GetItem(query.TargetPath);
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
                            var sourceITem = this.database.GetItem(new ID(itemId));

                            sourceITem.MoveTo(targetItem);
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }

        public void Delete(DeleteRequest query)
        {
           
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
                            var sourceITem = this.database.GetItem(new ID(itemId));

                            sourceITem.Delete();
                        }
                    }
                };

                actions.Add(action);
            }

            Parallel.Invoke(actions.ToArray());
        }

        public int GetProcessedCount()
        {
            return queue.Count;
        }

        public GenericItemEntity QuerySingle(QuerySingleDto query)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(query.Language)))
                {
                    var db = Sitecore.Data.Database.GetDatabase(query.Database);

                    Item sitecoreItem;
                    if (!string.IsNullOrEmpty(query.ItemId))
                    {
                        sitecoreItem = db.GetItem(new ID(query.ItemId));
                    }
                    else
                    {
                        sitecoreItem = db.GetItem(query.Query);
                    }

                    GenericItemEntity item = new GenericItemEntity
                    {
                        Name = sitecoreItem.Name,
                        Id = sitecoreItem.ID.ToString(),
                        Language = sitecoreItem.Language.ToString(),
                        Path = sitecoreItem.Paths.FullPath,
                        TemplateId = sitecoreItem.TemplateID.ToString(),
                        TemplateName = sitecoreItem.TemplateName,
                        Fields = new List<FieldDto>()
                    };

                    foreach (Field field in sitecoreItem.Fields)
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
            }
        }

        public List<GenericItemEntity> QueryMulti(QueryMultiDto query)
        {
            using (new SecurityDisabler())
            {
                using (new LanguageSwitcher(Language.Parse(query.Language)))
                {
                    var db = Sitecore.Data.Database.GetDatabase(query.Database);

                    Item sitecoreItem;
                    List<Item> items;
                    if (!string.IsNullOrEmpty(query.RootItemId))
                    {
                        sitecoreItem = db.GetItem(new ID(query.RootItemId));
                        if (query.IncludeDescendants)
                        {
                            items = sitecoreItem.Axes.GetDescendants().ToList();
                        }
                        else
                        {
                            items = sitecoreItem.Children.ToList();
                        }
                    }
                    else
                    {
                        items = db.SelectItems(query.Query).ToList();
                    }
                    List<GenericItemEntity> result = new List<GenericItemEntity>();
                    foreach(var item in items)
                    {
                        var genericItem = new GenericItemEntity
                        {
                            Name = item.Name,
                            Id = item.ID.ToString(),
                            Language = item.Language.ToString(),
                            Path = item.Paths.FullPath,
                            TemplateName = item.TemplateName,
                            TemplateId = item.TemplateID.ToString(),
                            Fields = new List<FieldDto>()
                        };

                        foreach (Field field in item.Fields)
                        {
                            genericItem.Fields.Add(new FieldDto
                            {
                                Name = field.Name,
                                Value = field.Value,
                                Id = field.ID.ToString()
                            });
                        }
                        result.Add(genericItem);
                    }

                    return result;
                }
            }
        }
    }
}