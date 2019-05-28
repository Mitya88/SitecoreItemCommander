using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class QueryMultiDto
    {
        public string Query { get; set; }
        public string RootItemId { get; set; }
        public bool IncludeDescendants { get; set; }
        public string Language { get; set; }
        public string Database { get; set; }
    }
}