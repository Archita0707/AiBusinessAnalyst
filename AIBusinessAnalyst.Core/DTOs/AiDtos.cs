namespace AIBusinessAnalyst.Core.DTOs
{
    public class AiGenerateRequest
    {
        public string Question { get; set; } = string.Empty;
        public int DataSourceId { get; set; }
    }

    public class AiServiceRequest
    {
        public string question { get; set; } = string.Empty;
        public string schema { get; set; } = string.Empty;
        public string? glossary { get; set; }
    }

    public class AiServiceResponse
    {
        public string generated_sql { get; set; } = string.Empty;
        public string chart_type { get; set; } = string.Empty;
        public string explanation { get; set; } = string.Empty;
        public List<string> suggestions { get; set; } = [];
    }

    public class AiGenerateResponse
    {
        public string GeneratedSQL { get; set; } = string.Empty;
        public string Explanation { get; set; } = string.Empty;
        public string ChartType { get; set; } = string.Empty;
        public List<string> Suggestions { get; set; } = [];
        public string SchemaContext { get; set; } = string.Empty;
        public bool GlossaryUsed { get; set; }
        public int GlossaryTermCount { get; set; }
        public double GenerationTimeMs { get; set; }

    }
}
