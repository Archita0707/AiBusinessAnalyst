using AIBusinessAnalyst.Core.DTOs;
using AIBusinessAnalyst.Core.Entities;
using AIBusinessAnalyst.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;

namespace AIBusinessAnalyst.API.Controllers
{
    [ApiController]
    [Route("api/query")]
    [Authorize]
    public class QueryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        // Keywords that must never appear in an executable query
        // ponytail: simple regex guard — covers 99% of cases; a determined user
        // could obfuscate with comments/whitespace. Upgrade path: use a proper
        // SQL parser (e.g. Microsoft.SqlServer.TransactSql.ScriptDom) if needed.
        private static readonly Regex _dangerousKeywords = new(
            @"\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|CREATE|EXEC|EXECUTE|MERGE|GRANT|REVOKE)\b",
            RegexOptions.IgnoreCase | RegexOptions.Compiled);

        public QueryController(ApplicationDbContext db)
        {
            _db = db;
        }

        // POST /api/query/validate
        [HttpPost("validate")]
        public IActionResult Validate(QueryValidateRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.SQL))
                return BadRequest(new QueryValidateResponse { IsValid = false, Message = "SQL cannot be empty." });

            var match = _dangerousKeywords.Match(request.SQL);
            if (match.Success)
                return Ok(new QueryValidateResponse
                {
                    IsValid = false,
                    Message = $"Blocked keyword detected: '{match.Value}'. Only SELECT queries are allowed."
                });

            return Ok(new QueryValidateResponse { IsValid = true, Message = "Query is safe to execute." });
        }

        // POST /api/query/execute
        [HttpPost("execute")]
        public async Task<IActionResult> Execute(QueryExecuteRequest request)
        {
            // 1. Validate first — never skip this
            var match = _dangerousKeywords.Match(request.SQL);
            if (match.Success)
                return BadRequest(new { message = $"Blocked keyword: '{match.Value}'. Execution refused." });

            // 2. Get the connection string for the requested data source
            var dataSource = await _db.DataSources.FindAsync(request.DataSourceId);
            if (dataSource == null)
                return NotFound(new { message = $"DataSource {request.DataSourceId} not found." });

            // 3. Execute and log
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            QueryExecuteResponse result;
            try
            {
                result = ExecuteQuery(request.SQL, dataSource.ConnectionString);
                stopwatch.Stop();

                _db.QueryHistories.Add(new QueryHistory
                {
                    UserId = userId,
                    DataSourceId = request.DataSourceId,
                    NaturalLanguageQuestion = request.NaturalLanguageQuestion,
                    GeneratedSQL = request.SQL,
                    ExecutionStatus = "Success",
                    SchemaContext = request.SchemaContext,
                    GlossaryUsed = request.GlossaryUsed,
                    GlossaryTermCount = request.GlossaryTermCount,
                    ExecutionTimeMs = stopwatch.Elapsed.TotalMilliseconds,
                    CreatedAt = DateTime.UtcNow
                });
                await _db.SaveChangesAsync();
            }
            catch (SqlException ex)
            {
                stopwatch.Stop();

                _db.QueryHistories.Add(new QueryHistory
                {
                    UserId = userId,
                    DataSourceId = request.DataSourceId,
                    NaturalLanguageQuestion = request.NaturalLanguageQuestion,
                    GeneratedSQL = request.SQL,
                    ExecutionStatus = $"Failed: {ex.Message}",
                    SchemaContext = request.SchemaContext,
                    GlossaryUsed = request.GlossaryUsed,
                    GlossaryTermCount = request.GlossaryTermCount,
                    ExecutionTimeMs = stopwatch.Elapsed.TotalMilliseconds,
                    CreatedAt = DateTime.UtcNow
                });
                await _db.SaveChangesAsync();

                return BadRequest(new { message = "Query execution failed.", detail = ex.Message });
            }

            return Ok(result);
        }

        private static QueryExecuteResponse ExecuteQuery(string sql, string connectionString)
        {
            var response = new QueryExecuteResponse();

            using var conn = new SqlConnection(connectionString);
            conn.Open();

            using var cmd = new SqlCommand(sql, conn);
            cmd.CommandTimeout = 30; // seconds

            using var reader = cmd.ExecuteReader();

            // Extract column names
            for (int i = 0; i < reader.FieldCount; i++)
                response.Columns.Add(reader.GetName(i));

            // Stream rows
            while (reader.Read())
            {
                var row = new List<object?>();
                for (int i = 0; i < reader.FieldCount; i++)
                    row.Add(reader.IsDBNull(i) ? null : reader.GetValue(i));
                response.Rows.Add(row);
            }

            response.RowCount = response.Rows.Count;
            return response;
        }
    }
}
