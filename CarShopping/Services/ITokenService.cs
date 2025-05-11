using CarShopping.Entities;

namespace CarShopping.Services;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}