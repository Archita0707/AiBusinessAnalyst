using AIBusinessAnalyst.Core.DTOs;
using AIBusinessAnalyst.Core.Entities;
using AIBusinessAnalyst.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AIBusinessAnalyst.API.Controllers
{
    [ApiController]
    [Route("api/glossary")]
    [Authorize] // all endpoints require a valid JWT
    public class GlossaryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public GlossaryController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET /api/glossary
        // GET /api/glossary?dataSourceId=1  (optional filter)
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int? dataSourceId)
        {
            var query = _db.GlossaryTerms.AsQueryable();

            if (dataSourceId.HasValue)
                query = query.Where(g => g.DataSourceId == dataSourceId.Value);

            var terms = await query
                .Select(g => new GlossaryTermResponse
                {
                    Id = g.Id,
                    TermName = g.TermName,
                    Description = g.Description,
                    SQLExpression = g.SQLExpression,
                    DataSourceId = g.DataSourceId
                })
                .ToListAsync();

            return Ok(terms);
        }

        // POST /api/glossary
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(GlossaryTermRequest request)
        {
            // Verify the DataSource exists before linking
            var dataSourceExists = await _db.DataSources.AnyAsync(d => d.Id == request.DataSourceId);
            if (!dataSourceExists)
                return BadRequest(new { message = $"DataSource with Id {request.DataSourceId} not found." });

            var term = new GlossaryTerm
            {
                TermName = request.TermName,
                Description = request.Description,
                SQLExpression = request.SQLExpression,
                DataSourceId = request.DataSourceId
            };

            _db.GlossaryTerms.Add(term);
            await _db.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAll), new { id = term.Id }, new GlossaryTermResponse
            {
                Id = term.Id,
                TermName = term.TermName,
                Description = term.Description,
                SQLExpression = term.SQLExpression,
                DataSourceId = term.DataSourceId
            });
        }

        // PUT /api/glossary/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, GlossaryTermRequest request)
        {
            var term = await _db.GlossaryTerms.FindAsync(id);
            if (term == null)
                return NotFound(new { message = $"Glossary term {id} not found." });

            term.TermName = request.TermName;
            term.Description = request.Description;
            term.SQLExpression = request.SQLExpression;
            term.DataSourceId = request.DataSourceId;

            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE /api/glossary/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var term = await _db.GlossaryTerms.FindAsync(id);
            if (term == null)
                return NotFound(new { message = $"Glossary term {id} not found." });

            _db.GlossaryTerms.Remove(term);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
