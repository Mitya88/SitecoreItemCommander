namespace ItemCommander.EntityService.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// Fast View resonse contract
    /// </summary>
    public class FastViewResponse
    {
        /// <summary>
        /// Gets or sets the languages.
        /// </summary>
        /// <value>
        /// The languages.
        /// </value>
        public List<string> Languages { get; set; }

        /// <summary>
        /// Gets or sets the item.
        /// </summary>
        /// <value>
        /// The item.
        /// </value>
        public ItemResponse Item { get; set; }

        /// <summary>
        /// Gets or sets the data.
        /// </summary>
        /// <value>
        /// The data.
        /// </value>
        public Dictionary<string, Dictionary<string, List<FieldResponse>>> Data { get; set; }
    }
}