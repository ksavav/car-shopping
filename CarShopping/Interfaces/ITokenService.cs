using CarShopping.Entities;

namespace CarShopping.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}