namespace ItemCommander.EntityService.Search
{
    using Sitecore.ContentSearch;
    using Sitecore.ContentSearch.SearchTypes;

    /// <summary>
    /// Search result item class
    /// </summary>
    /// <seealso cref="Sitecore.ContentSearch.SearchTypes.SearchResultItem" />
    public class ItemCommanderSearchResult : SearchResultItem
    {
        /// <summary>
        /// Gets or sets a value indicating whether this instance is latest version.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is latest version; otherwise, <c>false</c>.
        /// </value>
        [IndexField("_latestversion")]
        public bool IsLatestVersion { get; set; }
    }
}