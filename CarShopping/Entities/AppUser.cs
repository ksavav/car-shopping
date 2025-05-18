using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace CarShopping.Entities;

public class AppUser : IdentityUser<int>
{
    [StringLength(20, MinimumLength = 2)]
    public required string FirstName { get; set; }
    [StringLength(20, MinimumLength = 2)]
    public required string LastName { get; set; }
    public ICollection<AppUserRole> UserRoles { get; set; } = [];
}