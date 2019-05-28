using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class ItemCommanderResponse
    {
        public string CurrentPath { get; set; }

        public string CurrentId { get; set; }

        public string ParentId { get; set; }

        public List<GenericItemEntity> Children { get; set; }
    }

    public class DownloadResponse
    {
        public string FileName { get; set; }
    }
}