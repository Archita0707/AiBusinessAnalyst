using AIBusinessAnalyst.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AIBusinessAnalyst.API.Controllers
{
    [ApiController]
    [Route("api/history")]
    [Authorize]
    public class HistoryController : ControllerBase
    {
        private readonly ApplicationDbContext _db;

        public HistoryController(ApplicationDbContext db)
        {
            _db = db;
        }

        // GET /api/history
        // Admins see all history. Business users see only their own.
        [HttpGet]
        public async Task<IActionResult> GetHistory()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
            var isAdmin = User.IsInRole("Admin");

            var query = _db.QueryHistories
                .Include(q => q.DataSource)
                .AsQueryable();

            if (!isAdmin)
                query = query.Where(q => q.UserId == userId);

            var history = await query
                .OrderByDescending(q => q.CreatedAt)
                .Select(q => new
                {
                    q.Id,
                    q.NaturalLanguageQuestion,
                    q.GeneratedSQL,
                    q.ExecutionStatus,
                    q.CreatedAt,
                    DataSource = q.DataSource.Alias
                })
                .ToListAsync();

            return Ok(history);
        }
    }
}
