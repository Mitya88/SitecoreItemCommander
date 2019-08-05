namespace ItemCommander.EntityService.Models
{
    using System.Collections.Generic;

    public class EditorResponse
    {

        /// <summary>
        /// Gets or sets the languages.
        /// </summary>
        /// <value>
        /// The languages.
        /// </value>
        public List<string> Languages { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance has presentation.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance has presentation; otherwise, <c>false</c>.
        /// </value>
        public bool HasPresentation { get; set; }
    }
}