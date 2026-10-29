using AIBusinessAnalyst.Core.DTOs;
using AIBusinessAnalyst.Core.Entities;
using AIBusinessAnalyst.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace AIBusinessAnalyst.API.Controllers
{
    [ApiController]
    [Route("api/datasources")]
    [Authorize]
    public class DataSourcesController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public DataSourcesController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET /api/datasources
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var sources = await _db.DataSources
                .Select(d => new DataSourceResponse
                {
                    Id = d.Id,
                    Alias = d.Alias,
                    CreatedAt = d.CreatedAt,
                    TableCount = d.SchemaMetadata.Select(s => s.TableName).Distinct().Count(),
                    ColumnCount = d.SchemaMetadata.Count()
                })
                .ToListAsync();

            return Ok(sources);
        }

        // POST /api/datasources/connect  (Admin only)
        [HttpPost("connect")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Connect(DataSourceConnectRequest request)
        {
            // 1. Test connection and extract schema via ADO.NET
            List<SchemaMetadata> columns;
            try
            {
                columns = ExtractSchema(request.ConnectionString);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Could not connect to the database.", detail = ex.Message });
            }

            if (columns.Count == 0)
                return BadRequest(new { message = "Connected but no tables found in the target database." });

            // 2. Save DataSource
            var dataSource = new DataSource
            {
                Alias = request.Alias,
                ConnectionString = request.ConnectionString,
                CreatedAt = DateTime.UtcNow
            };
            _db.DataSources.Add(dataSource);
            await _db.SaveChangesAsync(); // get the Id

            // 3. Link schema rows to the new DataSource and bulk insert
            columns.ForEach(c => c.DataSourceId = dataSource.Id);
            _db.SchemaMetadata.AddRange(columns);
            await _db.SaveChangesAsync();

            return Ok(new DataSourceResponse
            {
                Id = dataSource.Id,
                Alias = dataSource.Alias,
                CreatedAt = dataSource.CreatedAt,
                TableCount = columns.Select(c => c.TableName).Distinct().Count(),
                ColumnCount = columns.Count
            });
        }

        // GET /api/datasources/{id}/schema
        [HttpGet("{id}/schema")]
        public async Task<IActionResult> GetSchema(int id)
        {
            var exists = await _db.DataSources.AnyAsync(d => d.Id == id);
            if (!exists)
                return NotFound(new { message = $"DataSource {id} not found." });

            var schema = await _db.SchemaMetadata
                .Where(s => s.DataSourceId == id)
                .Select(s => new SchemaMetadataResponse
                {
                    TableName = s.TableName,
                    ColumnName = s.ColumnName,
                    DataType = s.DataType,
                    IsPrimaryKey = s.IsPrimaryKey,
                    ForeignKeyTable = s.ForeignKeyTable,
                    ForeignKeyColumn = s.ForeignKeyColumn
                })
                .ToListAsync();

            return Ok(schema);
        }

        // ------------------------------------------------------------------
        // ADO.NET schema reflection — runs against the TARGET business DB
        // ------------------------------------------------------------------
        private static List<SchemaMetadata> ExtractSchema(string connectionString)
        {
            var columns = new List<SchemaMetadata>();

            using var conn = new SqlConnection(connectionString);
            conn.Open();

            // Returns schema-qualified names e.g. SalesLT.Product
            const string tablesSql = @"
        SELECT TABLE_SCHEMA, TABLE_NAME
        FROM INFORMATION_SCHEMA.TABLES
        WHERE TABLE_TYPE = 'BASE TABLE'
          AND TABLE_NAME NOT LIKE 'AspNet%'
          AND TABLE_NAME NOT LIKE '__EF%'
        ORDER BY TABLE_SCHEMA, TABLE_NAME";

            var tables = new List<(string Schema, string Name)>();
            using (var cmd = new SqlCommand(tablesSql, conn))
            using (var reader = cmd.ExecuteReader())
                while (reader.Read())
                    tables.Add((reader.GetString(0), reader.GetString(1)));

            const string columnsSql = @"
        SELECT
            c.COLUMN_NAME,
            c.DATA_TYPE,
            CASE WHEN pk.COLUMN_NAME IS NOT NULL THEN 1 ELSE 0 END AS IsPrimaryKey,
            fk.REF_TABLE  AS ForeignKeyTable,
            fk.REF_COLUMN AS ForeignKeyColumn
        FROM INFORMATION_SCHEMA.COLUMNS c
        LEFT JOIN (
            SELECT ku.TABLE_SCHEMA, ku.TABLE_NAME, ku.COLUMN_NAME
            FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS tc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
                ON tc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
               AND tc.TABLE_NAME = ku.TABLE_NAME
            WHERE tc.CONSTRAINT_TYPE = 'PRIMARY KEY'
        ) pk ON c.TABLE_SCHEMA = pk.TABLE_SCHEMA
             AND c.TABLE_NAME = pk.TABLE_NAME
             AND c.COLUMN_NAME = pk.COLUMN_NAME
        LEFT JOIN (
            SELECT
                ku.TABLE_SCHEMA,
                ku.TABLE_NAME,
                ku.COLUMN_NAME,
                ccu.TABLE_NAME  AS REF_TABLE,
                ccu.COLUMN_NAME AS REF_COLUMN
            FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS rc
            JOIN INFORMATION_SCHEMA.KEY_COLUMN_USAGE ku
                ON rc.CONSTRAINT_NAME = ku.CONSTRAINT_NAME
            JOIN INFORMATION_SCHEMA.CONSTRAINT_COLUMN_USAGE ccu
                ON rc.UNIQUE_CONSTRAINT_NAME = ccu.CONSTRAINT_NAME
        ) fk ON c.TABLE_SCHEMA = fk.TABLE_SCHEMA
             AND c.TABLE_NAME = fk.TABLE_NAME
             AND c.COLUMN_NAME = fk.COLUMN_NAME
        WHERE c.TABLE_SCHEMA = @schema AND c.TABLE_NAME = @table
        ORDER BY c.ORDINAL_POSITION";

            foreach (var (schema, name) in tables)
            {
                using var cmd = new SqlCommand(columnsSql, conn);
                cmd.Parameters.AddWithValue("@schema", schema);
                cmd.Parameters.AddWithValue("@table", name);
                using var reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    columns.Add(new SchemaMetadata
                    {
                        TableName = $"{schema}.{name}",   // stored as SalesLT.Product
                        ColumnName = reader.GetString(0),
                        DataType = reader.GetString(1),
                        IsPrimaryKey = reader.GetInt32(2) == 1,
                        ForeignKeyTable = reader.IsDBNull(3) ? null : reader.GetString(3),
                        ForeignKeyColumn = reader.IsDBNull(4) ? null : reader.GetString(4)
                    });
                }
            }

            return columns;
        }

    }
}
