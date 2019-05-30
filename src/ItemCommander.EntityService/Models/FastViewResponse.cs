using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class FastViewResponse
    {
        public List<string> Languages { get; set; }

        public GenericItemEntity Item { get; set; }

        public Dictionary<string, Dictionary<string, List<FieldDto>>> Data { get; set; }

    }
}