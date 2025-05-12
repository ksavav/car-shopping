using CarShopping.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class AdminController(UserManager<AppUser> userManager) : BaseController
{
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("get-users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await userManager.Users
            .OrderBy(u => u.UserName)
            .Select(x => new
            {
                Id = x.Id,
                UserName = x.UserName,
                Roles = x.UserRoles.Select(r => r.Role.Name).ToList()
            }).ToListAsync();
        
        return Ok(users);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username, string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest();
        var selectedRoles = roles.Split(",").ToArray();

        var user = await userManager.FindByNameAsync(username);
        if (user == null) return BadRequest();
        
        var userRoles = await userManager.GetRolesAsync(user);
        
        var result = await userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        if (!result.Succeeded) return BadRequest();
        
        result = await userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        if (!result.Succeeded) return BadRequest();

        return Ok(await userManager.GetRolesAsync(user));
    }
}