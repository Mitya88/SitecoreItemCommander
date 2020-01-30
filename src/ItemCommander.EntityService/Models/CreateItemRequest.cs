namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Create item request contract
    /// </summary>
    public class CreateItemRequest : BaseRequest
    {
        /// <summary>
        /// Gets or sets the target path.
        /// </summary>
        /// <value>
        /// The target path.
        /// </value>
        public string TargetPath { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the template identifier.
        /// </summary>
        /// <value>
        /// The template identifier.
        /// </value>
        public string TemplateId { get; set; }
    }
}