namespace ItemCommander.EntityService.Interfaces
{
    using ItemCommander.EntityService.Models;
    using Sitecore.Services.Core;
    using System.Collections.Generic;

    public interface IGenericItemRepository<T> : Sitecore.Services.Core.IRepository<T> where T : IEntityIdentity
    {
        GenericItemEntity FindById(string id, string language);

        GenericItemEntity QuerySingle(QuerySingleDto query);

        void Copy(CopyRequest query);

        void Move(MoveRequest query);

        void Delete(DeleteRequest delete);

        int GetProcessedCount();

        List<GenericItemEntity> QueryMulti(QueryMultiDto query);

        void PublishItem(string id, string target, string language);

        ItemCommanderResponse GetChildren(string id);
    }
}
