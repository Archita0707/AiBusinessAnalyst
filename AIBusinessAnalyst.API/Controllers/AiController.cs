using AIBusinessAnalyst.Core.DTOs;
using AIBusinessAnalyst.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace AIBusinessAnalyst.API.Controllers
{
    [ApiController]
    [Route("api/ai")]
    [Authorize]
    public class AiController : ControllerBase
    {
        private readonly ApplicationDbContext _db;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IConfiguration _config;

        public AiController(ApplicationDbContext db,
                            IHttpClientFactory httpClientFactory,
                            IConfiguration config)
        {
            _db = db;
            _httpClientFactory = httpClientFactory;
            _config = config;
        }

        // POST /api/ai/generate-sql
        [HttpPost("generate-sql")]
        public async Task<IActionResult> GenerateSql(AiGenerateRequest request)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            var schema = await _db.SchemaMetadata
                .Where(s => s.DataSourceId == request.DataSourceId)
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

            if (schema.Count == 0)
                return NotFound(new { message = $"No schema found for DataSource {request.DataSourceId}." });

            var glossary = await _db.GlossaryTerms
                .Where(g => g.DataSourceId == request.DataSourceId)
                .Select(g => new GlossaryTermResponse
                {
                    Id = g.Id,
                    TermName = g.TermName,
                    Description = g.Description,
                    SQLExpression = g.SQLExpression,
                    DataSourceId = g.DataSourceId
                })
                .ToListAsync();

            var schemaJson = JsonSerializer.Serialize(schema);
            var glossaryJson = glossary.Count > 0 ? JsonSerializer.Serialize(glossary) : null;

            // Summarize schema context for logging — table names only, not full JSON
            var tablesSummary = string.Join(", ", schema.Select(s => s.TableName).Distinct());

            var aiRequest = new AiServiceRequest
            {
                question = request.Question,
                schema = schemaJson,
                glossary = glossaryJson
            };

            var baseUrl = _config["AiService:BaseUrl"]!;
            var apiKey = _config["AiService:ApiKey"]!;

            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(500);
            client.DefaultRequestHeaders.Add("x-api-key", apiKey);

            var json = JsonSerializer.Serialize(aiRequest);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            HttpResponseMessage response;
            try
            {
                response = await client.PostAsync($"{baseUrl}/api/generate-sql", content);
            }
            catch (Exception ex)
            {
                return StatusCode(503, new { message = "AI service is unreachable.", detail = ex.Message });
            }

            stopwatch.Stop();

            if (!response.IsSuccessStatusCode)
            {
                var error = await response.Content.ReadAsStringAsync();
                return StatusCode((int)response.StatusCode, new { message = "AI service returned an error.", detail = error });
            }

            var responseBody = await response.Content.ReadAsStringAsync();
            var aiResponse = JsonSerializer.Deserialize<AiServiceResponse>(responseBody,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

            if (aiResponse == null || string.IsNullOrEmpty(aiResponse.generated_sql))
                return StatusCode(500, new { message = "AI service returned an empty response." });

            // Return generation time so QueryController can log it
            return Ok(new AiGenerateResponse
            {
                GeneratedSQL = aiResponse.generated_sql,
                Explanation = aiResponse.explanation,
                ChartType = aiResponse.chart_type,
                Suggestions = aiResponse.suggestions,
                SchemaContext = tablesSummary,
                GlossaryUsed = glossary.Count > 0,
                GlossaryTermCount = glossary.Count,
                GenerationTimeMs = stopwatch.Elapsed.TotalMilliseconds
            });
        }

    }
}
