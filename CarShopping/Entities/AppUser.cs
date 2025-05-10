using Microsoft.AspNetCore.Identity;

namespace CarShopping.Entities;

public class AppUser : IdentityUser<int>
{
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}