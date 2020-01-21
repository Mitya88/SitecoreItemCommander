﻿using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ItemCommander.EntityService.Models
{
    public class ProgressResponse
    {
        public int RemainingCount { get; set; }

        public List<string> ErrorResult { get; set; }
    }
}