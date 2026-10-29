namespace AIBusinessAnalyst.Core.Entities
{
    public class SchemaMetadata
    {
        public int Id { get; set; }
        public int DataSourceId { get; set; }
        public DataSource DataSource { get; set; } = null!;

        public string TableName { get; set; } = string.Empty;
        public string ColumnName { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public bool IsPrimaryKey { get; set; }
        public string? ForeignKeyTable { get; set; }   // null if not a FK
        public string? ForeignKeyColumn { get; set; }  // null if not a FK
    }
}
