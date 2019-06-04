namespace ItemCommander.EntityService.Interfaces
{
    using ItemCommander.EntityService.Models;
    using Sitecore.Data.Items;
    using Sitecore.Services.Core;
    using System.Collections.Generic;

    /// <summary>
    /// Generic item response
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <seealso cref="Sitecore.Services.Core.IRepository{T}" />
    public interface IGenericItemRepository<T> : Sitecore.Services.Core.IRepository<T> where T : IEntityIdentity
    {
        /// <summary>
        /// Creates the item.
        /// </summary>
        /// <param name="createItemRequest">The folder.</param>
        /// <param name="db">The database.</param>
        void CreateItem(CreateItemRequest createItemRequest, string db);

        /// <summary>
        /// Copies the specified copy request.
        /// </summary>
        /// <param name="copyRequest">The copy request.</param>
        /// <param name="db">The database.</param>
        void Copy(CopyRequest copyRequest, string db);

        void CopySingle(CopySingle copySingleRequest, string db);

        /// <summary>
        /// Moves the specified item.
        /// </summary>
        /// <param name="moveRequest">The query.</param>
        /// <param name="db">The database.</param>
        void Move(MoveRequest moveRequest, string db);

        /// <summary>
        /// Deletes the specified items.
        /// </summary>
        /// <param name="deleteRequest">The delete.</param>
        /// <param name="db">The database.</param>
        void Delete(DeleteRequest deleteRequest, string db);

        /// <summary>
        /// Locks/unlocks the specified item.
        /// </summary>
        /// <param name="lockRequest">The lock request.</param>
        /// <param name="db">The database.</param>
        void Lock(LockRequest lockRequest, string db);

        /// <summary>
        /// Gets the items.
        /// </summary>
        /// <param name="ids">The ids.</param>
        /// <param name="db">The database.</param>
        /// <returns>List of items by ids</returns>
        List<Item> GetItems(List<string> ids, string db);

        /// <summary>
        /// Gets the children.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>Children list</returns>
        ItemCommanderResponse GetChildren(string id, string db);

        /// <summary>
        /// Searches the specified keyword.
        /// </summary>
        /// <param name="keyword">The keyword.</param>
        /// <param name="db">The database.</param>
        /// <returns>Search result by keyword</returns>
        ItemCommanderResponse Search(string keyword, string db);

        /// <summary>
        /// Gets the fast view.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>Fast view contract</returns>
        FastViewResponse GetFastView(string id, string db);

        /// <summary>
        /// Gets the insert options.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>List of insert options are available for the item</returns>
        List<ItemResponse> GetInsertOptions(string id, string db);

        /// <summary>
        /// Gets the media URL.
        /// </summary>
        /// <param name="id">The identifier.</param>
        /// <param name="db">The database.</param>
        /// <returns>The media url by id and database</returns>
        string GetMediaUrl(string id, string db);
    }
}