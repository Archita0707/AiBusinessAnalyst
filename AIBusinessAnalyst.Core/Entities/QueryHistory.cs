namespace AIBusinessAnalyst.Core.Entities
{
    public class QueryHistory
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;   // FK to AspNetUsers.Id (string)
        public ApplicationUser User { get; set; } = null!;

        public int DataSourceId { get; set; }
        public DataSource DataSource { get; set; } = null!;

        public string NaturalLanguageQuestion { get; set; } = string.Empty;
        public string GeneratedSQL { get; set; } = string.Empty;
        public string ExecutionStatus { get; set; } = string.Empty;  // "Success", "Failed", "Pending"
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public string SchemaContext { get; set; } = string.Empty;   // tables/columns sent to LLM
        public bool GlossaryUsed { get; set; }                      // was glossary included in prompt
        public int GlossaryTermCount { get; set; }                  // how many terms were sent
        public double ExecutionTimeMs { get; set; }                 // query execution time in ms

    }
}
