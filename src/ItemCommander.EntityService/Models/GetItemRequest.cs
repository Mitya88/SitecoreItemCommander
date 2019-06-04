namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Get Item request
    /// </summary>
    /// <seealso cref="ItemCommander.EntityService.Models.BaseItemListRequest" />
    public class GetItemRequest : BaseItemListRequest
    {
        /// <summary>
        /// Gets or sets the raw value.
        /// </summary>
        /// <value>
        /// The raw value.
        /// </value>
        public string RawValue { get; set; }
    }
}