using Microsoft.AspNetCore.Identity;

namespace AIBusinessAnalyst.Core.Entities
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; } = string.Empty;
    }
}
