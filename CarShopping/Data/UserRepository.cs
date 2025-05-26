using CarShopping.Entities;
using CarShopping.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Data;

public class UserRepository(UserManager<AppUser> userManager) : IUserRepository
{
    public async Task<AppUser?> GetUserByEmail(string email)
    {
        return await userManager.FindByEmailAsync(email);
    }
    
    public async Task<bool> UserExists(string email)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedEmail == email.ToLower());
    }
}