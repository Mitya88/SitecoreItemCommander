namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Copy request contract
    /// </summary>
    public class RenameRequest : BaseItemListRequest
    {
        /// <summary>
        /// Gets or sets the target path.
        /// </summary>
        /// <value>
        /// The target path.
        /// </value>
        public string NameOrPattern { get; set; }
    }
}