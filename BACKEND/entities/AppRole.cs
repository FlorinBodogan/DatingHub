using Microsoft.AspNetCore.Identity;

namespace BACKEND.Entities
{
    public class AppRole : IdentityRole<int>
    {
        public ICollection<AppUserRole> UserRoles { get; set; }
    }
}