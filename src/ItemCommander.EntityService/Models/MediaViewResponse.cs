namespace ItemCommander.EntityService.Models
{
    /// <summary>
    /// Media View resonse contract
    /// </summary>
    public class MediaViewResponse
    {
        /// <summary>
        /// Gets or sets the source.
        /// </summary>
        /// <value>
        /// The source.
        /// </value>
        public string Src { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether this instance is media.
        /// </summary>
        /// <value>
        ///   <c>true</c> if this instance is media; otherwise, <c>false</c>.
        /// </value>
        public bool IsMedia { get; set; }

        /// <summary>
        /// Gets or sets the type of the MIME.
        /// </summary>
        /// <value>
        /// The type of the MIME.
        /// </value>
        public string MimeType { get; set; }

        /// <summary>
        /// Gets or sets the type of the media.
        /// </summary>
        /// <value>
        /// The type of the media.
        /// </value>
        public string MediaType { get; set; }

        /// <summary>
        /// Gets or sets the size.
        /// </summary>
        /// <value>
        /// The size.
        /// </value>
        public string Size { get; set; }

        /// <summary>
        /// Gets or sets the extenions.
        /// </summary>
        /// <value>
        /// The extenions.
        /// </value>
        public string Extenions { get; set; }

        /// <summary>
        /// Gets or sets the identifier.
        /// </summary>
        /// <value>
        /// The identifier.
        /// </value>
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets the path.
        /// </summary>
        /// <value>
        /// The path.
        /// </value>
        public string Path { get; set; }

        /// <summary>
        /// Gets or sets the name.
        /// </summary>
        /// <value>
        /// The name.
        /// </value>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the icon.
        /// </summary>
        /// <value>
        /// The icon.
        /// </value>
        public string Icon { get; set; }
    }
}