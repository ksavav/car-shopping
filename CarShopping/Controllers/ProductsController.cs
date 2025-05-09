using CarShopping.Data;
using CarShopping.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class ProductsController : BaseController
{
    private readonly DataContext _context;

    public ProductsController(DataContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await _context.Products.ToListAsync();
        
        return Ok(products);
    }
    
    [HttpGet("{name}")]
    public async Task<ActionResult<Product>> GetProductByName(string name)
    {
        var product = await _context.Products.SingleOrDefaultAsync(x => x.Name == name);
        if (product == null) return NotFound("Product not found");
        return Ok(product);
    }
    
    // [Authorize]
    [HttpPost("add")]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (await ProductExists(product.Name)) return BadRequest("Product with such name already exists");
        _context.Products.Add(product);
        await _context.SaveChangesAsync();
        return Ok(product);
    }

    private async Task<bool> ProductExists(string name)
    {
        return await _context.Products.AnyAsync(x => x.Name.ToLower() == name.ToLower());
    }
}