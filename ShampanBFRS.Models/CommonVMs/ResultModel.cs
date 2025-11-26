using System;

namespace ShampanBFRS.Models.CommonVMs
{
    public class ResultModel<TModel>
    {
        public TModel Data { get; set; }

        public Status Status { get; set; }

        public Exception Exception { get; set; }

        public string Message { get; set; }
        public int EffectedRows { get; set; }
        public string SingleValue { get; set; }
        public bool Success { get; set; }
        public string Error { get; set; }

        public Audit Audit { set; get; }
    }

}
