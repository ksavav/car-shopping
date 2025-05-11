using System.Text.Json;
using CarShopping.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if(await userManager.Users.AnyAsync()) return;
        
        var userData = await File.ReadAllTextAsync("Data/SeedUsers.json");

        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
        
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);
        
        if(users == null) return;

        var roles = new List<AppRole>
        {
            new () { Name = "Member" },
            new () { Name = "Moderator" },
            new () { Name = "Admin" }
        };

        foreach (var role in roles)
        {
            await roleManager.CreateAsync(role);
        }
        
        foreach (var user in users)
        {
            Console.WriteLine(user.FirstName);
            Console.WriteLine(user.LastName);
            user.UserName = user.Email;
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "Member");
        }

        var admin = new AppUser
        {
            Email = "admin@gmail.com",
            UserName = "admin@gmail.com",
            FirstName = "Admin",
            LastName = "Admin"
        };
        
        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, ["Admin", "Moderator"]);
    }
}