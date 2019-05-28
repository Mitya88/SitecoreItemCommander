namespace ItemCommander.EntityService.Interfaces
{
    using ItemCommander.EntityService.Models;
    using Sitecore.Data.Items;
    using Sitecore.Services.Core;
    using System.Collections.Generic;

    public interface IGenericItemRepository<T> : Sitecore.Services.Core.IRepository<T> where T : IEntityIdentity
    {
        GenericItemEntity FindById(string id, string language);

        GenericItemEntity QuerySingle(QuerySingleDto query);

        void CreateFolder(FolderRequest folder);

        void Copy(CopyRequest query);

        void CopySingle(CopySingle query);

        void Move(MoveRequest query);

        void Delete(DeleteRequest delete);

        void Lock(LockRequest lockRequest);

        List<Item> GetItems(List<string> ids);

        int GetProcessedCount();

        List<GenericItemEntity> QueryMulti(QueryMultiDto query);

        void PublishItem(string id, string target, string language);

        ItemCommanderResponse GetChildren(string id);


        ItemCommanderResponse Search(string keyword);

        void SetDatabase(string dbName);

        FastViewResponse GetFastView(string id);
    }
}
