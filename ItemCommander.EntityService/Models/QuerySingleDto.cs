using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class QuerySingleDto
    {
        public string Query { get; set; }
        public string Language { get; set; }
        public string Database { get; set; }
        public string ItemId { get; set; }
    }
}