namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Lock request contract
    /// </summary>
    /// <seealso cref="ItemCommander.EntityService.Models.BaseItemListRequest" />
    public class LockRequest : BaseItemListRequest
    {
        /// <summary>
        /// Gets or sets a value indicating whether this <see cref="LockRequest"/> is lock.
        /// </summary>
        /// <value>
        ///   <c>true</c> if lock; otherwise, <c>false</c>.
        /// </value>
        public bool Lock { get; set; }
    }
}