using AutoMapper;
using CarShopping.DTOs;
using CarShopping.Entities;
using CarShopping.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class AccountController(UserManager<AppUser> userManager, IMapper mapper, ITokenService tokenService) : BaseController
{
    [HttpPost("login")]
    public async Task<ActionResult<UserDto>> Login(LogionDto loginDto)
    {
        var user = await userManager.FindByEmailAsync(loginDto.Email);
        if (user == null || user.Email == null) return Unauthorized("Email or password is incorrect");
        var results = await userManager.CheckPasswordAsync(user, loginDto.Password);
        if(!results) return Unauthorized("Email or password is incorrect");
        
        return new UserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Token = await tokenService.CreateToken(user)
        };
    }
    
    [HttpPost("register")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
    {
        if (await UserExists(registerDto.Email)) return BadRequest();
        var user = mapper.Map<AppUser>(registerDto);
        user.Email = registerDto.Email.ToLower();
        user.UserName = registerDto.Email;
        var result = await userManager.CreateAsync(user, registerDto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        return new UserDto
        {
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Token = await tokenService.CreateToken(user)
        };
    }
    
    private async Task<bool> UserExists(string email)
    {
        return await userManager.Users.AnyAsync(x => x.NormalizedEmail == email.ToLower());
    }
}