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
        await userManager.AddToRoleAsync(admin, "Admin");
    }

    public static async Task SeedProducts(DataContext context)
    {
        if(await context.Products.AnyAsync()) return;
        var productData = await File.ReadAllTextAsync("Data/SeedProducts.json");
        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
        var products = JsonSerializer.Deserialize<List<Product>>(productData, options);
        if(products == null) return;

        foreach (var p in products)
        {
            context.Products.Add(p);
        }
        await context.SaveChangesAsync();
    }
    
    public static async Task SeedPages(DataContext context)
    {
        if(await context.Pages.AnyAsync()) return;
        var pageData = await File.ReadAllTextAsync("Data/SeedPages.json");
        var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
        var pages = JsonSerializer.Deserialize<List<PageContent>>(pageData, options);
        if(pages == null) return;

        foreach (var p in pages)
        {
            context.Pages.Add(p);
        }
        await context.SaveChangesAsync();
    }
}