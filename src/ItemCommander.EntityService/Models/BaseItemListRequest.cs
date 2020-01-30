namespace ItemCommander.EntityService.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// Base item list request
    /// </summary>
    public class BaseItemListRequest: BaseRequest
    {
        /// <summary>
        /// Gets or sets the items.
        /// </summary>
        /// <value>
        /// The items.
        /// </value>
        public List<string> Items { get; set; }
    }
}