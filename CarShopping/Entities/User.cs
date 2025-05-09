using Microsoft.AspNetCore.Identity;

namespace CarShopping.Entities;

public class User : IdentityUser
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Surname { get; set; }
    public byte[] PasswordHash { get; set; }
    public byte[] PasswordSalt { get; set; }
}