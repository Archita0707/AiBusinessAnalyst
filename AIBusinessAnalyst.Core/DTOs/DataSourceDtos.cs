namespace AIBusinessAnalyst.Core.DTOs
{
    public class DataSourceConnectRequest
    {
        public string Alias { get; set; } = string.Empty;
        public string ConnectionString { get; set; } = string.Empty;
    }

    public class DataSourceResponse
    {
        public int Id { get; set; }
        public string Alias { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public int TableCount { get; set; }
        public int ColumnCount { get; set; }
    }

    public class SchemaMetadataResponse
    {
        public string TableName { get; set; } = string.Empty;
        public string ColumnName { get; set; } = string.Empty;
        public string DataType { get; set; } = string.Empty;
        public bool IsPrimaryKey { get; set; }
        public string? ForeignKeyTable { get; set; }
        public string? ForeignKeyColumn { get; set; }
    }
}
