namespace ItemCommander.EntityService.Models
{
    using System;
    using System.Collections.Generic;

    public class GenericItemEntity : Sitecore.Services.Core.Model.EntityIdentity
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public string Language { get; set; }

        public string Icon { get; set; }
        public string TemplateName { get; set; }
        public string TemplateId { get; set; }
        public string ParentId { get; set; }
        public bool HasChildren { get; set; }

        public DateTime LastModified { get; set; }


        public List<FieldDto> Fields { get; set; }
    }
}