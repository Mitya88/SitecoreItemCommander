using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class CreateItemRequest
    {
        public string TargetPath { get; set; }
        public string Name { get; set; }

        public string TemplateId { get; set; }
    }
    public class CopyRequest
    {
        public string TargetPath { get; set; }

        public List<string> Items { get; set; }
    }

    public class CopySingle
    {
        public string TargetPath { get; set; }

        public string Item { get; set; }

        public string Name { get; set; }
    }

    public class MoveRequest : CopyRequest
    {

    }

    public class DeleteRequest
    {
        public List<string> Items { get; set; }
    }

    public class LockRequest
    {
        public bool Lock { get; set; }
        public List<string> Items { get; set; }
    }
}