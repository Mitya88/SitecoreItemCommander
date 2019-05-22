using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class CopyRequest
    {
        public string TargetPath { get; set; }

        public List<string> Items { get; set; }
    }

    public class MoveRequest : CopyRequest
    {

    }

    public class DeleteRequest
    {
        public List<string> Items { get; set; }
    }
}