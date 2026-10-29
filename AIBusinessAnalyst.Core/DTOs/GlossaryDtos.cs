namespace AIBusinessAnalyst.Core.DTOs
{
    public class GlossaryTermRequest
    {
        public string TermName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SQLExpression { get; set; } = string.Empty;
        public int DataSourceId { get; set; }
    }

    public class GlossaryTermResponse
    {
        public int Id { get; set; }
        public string TermName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SQLExpression { get; set; } = string.Empty;
        public int DataSourceId { get; set; }
    }
}
