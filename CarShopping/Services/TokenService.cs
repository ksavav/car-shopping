using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CarShopping.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace CarShopping.Services;

public class TokenService(IConfiguration config, UserManager<AppUser> userManager, RoleManager<AppRole> roleManager) : ITokenService
{
    public async Task<string> CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"] ?? throw new Exception();
        if (tokenKey.Length < 64) throw new Exception("Invalid token key");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));
        
        if (user.Email == null) throw new Exception("Invalid email");

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Email, user.Email)
        };
        
        var roles = await userManager.GetRolesAsync(user);
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };
        
        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}