namespace AIBusinessAnalyst.Core.Entities
{
    public class DataSource
    {
        public int Id { get; set; }
        public string Alias { get; set; } = string.Empty;           // display name, e.g. "Sales DB"
        public string ConnectionString { get; set; } = string.Empty; // encrypted at rest ideally
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation
        public ICollection<SchemaMetadata> SchemaMetadata { get; set; } = [];
        public ICollection<GlossaryTerm> GlossaryTerms { get; set; } = [];
    }
}
