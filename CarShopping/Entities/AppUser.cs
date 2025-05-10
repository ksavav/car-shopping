using Microsoft.AspNetCore.Identity;

namespace CarShopping.Entities;

public class AppUser : IdentityUser<int>
{
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}