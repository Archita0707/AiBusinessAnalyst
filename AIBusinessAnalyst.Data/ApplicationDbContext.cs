using AIBusinessAnalyst.Core.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AIBusinessAnalyst.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<DataSource> DataSources { get; set; }
        public DbSet<SchemaMetadata> SchemaMetadata { get; set; }
        public DbSet<GlossaryTerm> GlossaryTerms { get; set; }
        public DbSet<QueryHistory> QueryHistories { get; set; }
    }
}
