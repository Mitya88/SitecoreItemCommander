namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Create item request contract
    /// </summary>
    public class SearchItemRequest : BaseRequest
    {
        /// <summary>
        /// Gets or sets the target path.
        /// </summary>
        /// <value>
        /// The target path.
        /// </value>
        public string Keyword { get; set; }
    }
}