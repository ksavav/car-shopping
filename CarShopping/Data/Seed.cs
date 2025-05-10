using System.Text.Json;
using CarShopping.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if(await userManager.Users.AnyAsync()) return;
        
        var userData = await File.ReadAllTextAsync("Data/SeedUsers.json");

        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
        
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData, options);
        
        if(users == null) return;

        foreach (var user in users)
        {
            Console.WriteLine(user.Name);
            Console.WriteLine(user.Surname);
            await userManager.CreateAsync(user, "Pa$$w0rd");
        }
    }
}