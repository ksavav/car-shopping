using Microsoft.AspNetCore.Identity;

namespace CarShopping.Entities;

public class AppRole : IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}