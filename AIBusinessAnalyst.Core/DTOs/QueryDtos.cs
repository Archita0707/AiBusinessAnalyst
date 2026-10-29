namespace AIBusinessAnalyst.Core.DTOs
{
    public class QueryValidateRequest
    {
        public string SQL { get; set; } = string.Empty;
    }

    public class QueryExecuteRequest
    {
        public string SQL { get; set; } = string.Empty;
        public int DataSourceId { get; set; }
        public string NaturalLanguageQuestion { get; set; } = string.Empty;
        public string SchemaContext { get; set; } = string.Empty;
        public bool GlossaryUsed { get; set; }
        public int GlossaryTermCount { get; set; }
    }


    public class QueryValidateResponse
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    public class QueryExecuteResponse
    {
        public List<string> Columns { get; set; } = [];
        public List<List<object?>> Rows { get; set; } = [];
        public int RowCount { get; set; }
    }
}
