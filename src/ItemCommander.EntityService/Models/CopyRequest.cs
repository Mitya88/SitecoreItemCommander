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

        /// <summary>
        /// Gets or sets a value indicating whether [copy sub items].
        /// </summary>
        /// <value>
        ///   <c>true</c> if [copy sub items]; otherwise, <c>false</c>.
        /// </value>
        public bool CopySubItems { get; set; }
    }
}