namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Copy request contract
    /// </summary>
    public class CopyRequest : BaseItemListRequest
    {
        /// <summary>
        /// Gets or sets the target path.
        /// </summary>
        /// <value>
        /// The target path.
        /// </value>
        public string TargetPath { get; set; }
    }
}