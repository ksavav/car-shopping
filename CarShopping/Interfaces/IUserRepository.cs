using CarShopping.Entities;

namespace CarShopping.Interfaces;

public interface IUserRepository
{
    Task<AppUser?> GetUserByEmail(string email);
    Task<bool> UserExists(string email);
}