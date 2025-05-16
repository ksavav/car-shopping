using System.Security.Claims;
using CarShopping.Data;
using CarShopping.DTOs;
using CarShopping.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class PageController(DataContext context, UserManager<AppUser> userManager) : BaseController
{
    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPost("add-page")]
    public async Task<ActionResult<PageContent>> AddPage(PageDto pageDto)
    {
        if (await context.Pages.AnyAsync(x => x.Section == pageDto.Section)) return BadRequest();
        var editor = userManager.GetUserAsync(User).Result;
        if (editor == null) return Unauthorized();
        if (editor.Email == null) return Unauthorized();

        var page = new PageContent
        {
            Page = pageDto.Page,
            Section = pageDto.Section,
            Content = pageDto.Content,
            LastEdited = DateTime.Now,
            EditedBy = editor.Email,
        };
        
        context.Pages.Add(page);
        await context.SaveChangesAsync();
        return Ok(page);
    }

    [Authorize(Policy = "RequireModeratorRole")]
    [HttpPut("edit-page/{pageDto.Page}+{pageDto.Section}")]
    public async Task<ActionResult<PageDto>> UpdatePage(PageDto pageDto)
    {
        var page = await context.Pages.Select(x => x)
            .Where(x => x.Section == pageDto.Section && x.Page == pageDto.Page)
            .FirstOrDefaultAsync();
        
        if (page == null) return BadRequest();
        
        var editor = userManager.GetUserAsync(User).Result;
        if (editor == null) return Unauthorized();
        if (editor.Email == null) return Unauthorized();

        context.Pages.Update(page);
        page.Content = pageDto.Content;
        page.LastEdited = DateTime.Now;
        page.EditedBy = editor.Email;
        await context.SaveChangesAsync();
        
        return Ok(new PageDto
        {
            Page = page.Page,
            Section = page.Section,
            Content = page.Content
        });
    }

    [HttpGet("{pageName}+{section}")]
    public async Task<ActionResult<PageDto>> GetPage(string pageName, string section)
    {
        var page = await context.Pages.Select(x => x)
            .Where(x => x.Section == section && x.Page == pageName)
            .FirstOrDefaultAsync();
        if (page == null) return BadRequest();
        
        return Ok(new PageDto
        {
            Page = page.Page,
            Section = page.Section,
            Content = page.Content,
        });
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PageDto>>> GetPages()
    {
        var pages = await context.Pages.ToListAsync();
        
        return Ok(pages);
    }
}