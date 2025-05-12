using CarShopping.Data;
using CarShopping.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class ProductsController(DataContext context) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
    {
        var products = await context.Products.ToListAsync();
        return Ok(products);
    }
    
    [HttpGet("{name}")]
    public async Task<ActionResult<Product>> GetProductByName(string name)
    {
        var product = await context.Products.SingleOrDefaultAsync(x => x.Name == name);
        if (product == null) return NotFound("Product not found");
        return Ok(product);
    }
    
    [HttpGet("code/{productCode}")]
    public async Task<ActionResult<Product>> GetProductByCode(string productCode)
    {
        var product = await context.Products.SingleOrDefaultAsync(x => x.ProductCode.ToLower() == productCode.ToLower());
        if (product == null) return NotFound("Product not found");
        return Ok(product);
    }
    
    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("add")]
    public async Task<ActionResult<Product>> CreateProduct(Product product)
    {
        if (await ProductExists(product.ProductCode)) return BadRequest("Product with such name already exists");
        context.Products.Add(product);
        await context.SaveChangesAsync();
        return Ok(product);
    }
    
    /* TODO
     * Change the function to not include id and product code 
     * Probably need to create a ProductDto to not include id both in this request
     * and on the client side
     */
    [Authorize(Policy = "RequireAdminRole")]
    [HttpPut("edit")]
    public async Task<ActionResult<Product>> UpdateProduct(Product product)
    {
        var productToUpdate = await GetProduct(product.ProductCode);
        if (productToUpdate == null) return BadRequest("Product with such does not exist");

        // _mapper.Map(productUpdateDto, productToUpdate);
        
        context.Entry(productToUpdate).CurrentValues.SetValues(product);
        await context.SaveChangesAsync();
        return Ok(productToUpdate);
    }

    [Authorize(Policy = "RequireAdminRole")]
    [HttpDelete("delete/{productCode}")]
    public async Task<ActionResult<Product>> DeleteProduct(string productCode)
    {
        var productToDelete = await GetProduct(productCode);
        if (productToDelete == null) return BadRequest("Product with such does not exist");

        context.Products.Remove(productToDelete);
        await context.SaveChangesAsync();
        return Ok(productToDelete); 
    }
    
    private async Task<bool> ProductExists(string productCode)
    {
        return await context.Products.AnyAsync(x => x.ProductCode.ToLower() == productCode.ToLower());
    }

    private async Task<Product?> GetProduct(string productCode)
    {
        var product = await context.Products.SingleOrDefaultAsync(x => x.ProductCode.ToLower() == productCode.ToLower());
        
        return product;
    }
}