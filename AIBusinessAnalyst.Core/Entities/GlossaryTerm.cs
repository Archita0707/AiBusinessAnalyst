namespace AIBusinessAnalyst.Core.Entities
{
    public class GlossaryTerm
    {
        public int Id { get; set; }
        public string TermName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string SQLExpression { get; set; } = string.Empty;

        public int DataSourceId { get; set; }
        public DataSource DataSource { get; set; } 
    }
}