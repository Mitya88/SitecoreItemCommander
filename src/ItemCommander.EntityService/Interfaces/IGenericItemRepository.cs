namespace ItemCommander.EntityService.Interfaces
{
    using ItemCommander.EntityService.Models;
    using Sitecore.Data.Items;
    using Sitecore.Services.Core;
    using System.Collections.Generic;

    public interface IGenericItemRepository<T> : Sitecore.Services.Core.IRepository<T> where T : IEntityIdentity
    {
        GenericItemEntity FindById(string id, string language);

        void CreateFolder(FolderRequest folder, string db);

        void Copy(CopyRequest query, string db);

        void CopySingle(CopySingle query, string db);

        void Move(MoveRequest query, string db);

        void Delete(DeleteRequest delete, string db);

        void Lock(LockRequest lockRequest, string db);

        List<Item> GetItems(List<string> ids, string db);

        ItemCommanderResponse GetChildren(string id, string db);


        ItemCommanderResponse Search(string keyword, string db);

        FastViewResponse GetFastView(string id, string db);
    }
}
