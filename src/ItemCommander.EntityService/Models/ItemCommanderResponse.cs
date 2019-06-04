using System.Collections.Generic;

namespace ItemCommander.EntityService.Models
{
    public class ItemCommanderResponse
    {
        public string CurrentPath { get; set; }

        public string CurrentId { get; set; }

        public string ParentId { get; set; }

        public List<ItemResponse> Children { get; set; }
    }

    public class DownloadResponse
    {
        public string FileName { get; set; }
    }
}