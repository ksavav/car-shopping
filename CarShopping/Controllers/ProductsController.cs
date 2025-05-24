using CarShopping.Data;
using CarShopping.Entities;
using CarShopping.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class ProductsController(DataContext context) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery]QueryParams queryParams)
    {
        var query = context.Products.AsQueryable();

        if (queryParams.Category != null)
        {
            query = query.Where(p => p.Category == queryParams.Category);
        }
        if (queryParams.Producer != null)
        {
            query = query.Where(p => p.Producer == queryParams.Producer);
        }

        query = query.Where(p =>
            p.ActualPrice >= queryParams.minPrice &&
            p.ActualPrice <= queryParams.maxPrice
        );

        query = queryParams.OrderBy switch
        {
            "descending" => query.OrderByDescending(p => p.ActualPrice),
            "ascending" => query.OrderBy(p => p.ActualPrice),
            _ => query.OrderBy(p => p.ActualPrice)
        };

        var skipNumber = (queryParams.PageNumber - 1) * queryParams.PageSize;

        var products = await query.Skip(skipNumber).Take(queryParams.PageSize).ToListAsync();

        return Ok(products);
    }
    
    [HttpGet("{productId}")]
    public async Task<ActionResult<Product>> GetProductByProductId(string productId)
    {
        var product = await context.Products.SingleOrDefaultAsync(x => x.ProductId == productId);
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

    [HttpGet("list/{productsIds}")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductsListBasedOnProductsId(string productsIds)
    {
        var queryString = productsIds.Split("+");
        var productsList = new List<Product>();

        foreach (var p in queryString)
        {
            var product = await context.Products.SingleOrDefaultAsync(x => x.ProductId == p);
            if (product != null)
            {
                productsList.Add(product);
            }
        }

        return Ok(productsList);
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
    [HttpDelete("delete/{productId}")]
    public async Task<ActionResult<Product>> DeleteProduct(string productId)
    {
        var productToDelete = await GetProduct(productId);
        if (productToDelete == null) return BadRequest("Product with such does not exist");

        context.Products.Remove(productToDelete);
        await context.SaveChangesAsync();
        return Ok(productToDelete); 
    }
    
    private async Task<bool> ProductExists(string productId)
    {
        return await context.Products.AnyAsync(x => x.ProductId.ToLower() == productId.ToLower());
    }

    private async Task<Product?> GetProduct(string productId)
    {
        var product = await context.Products.SingleOrDefaultAsync(x => x.ProductId.ToLower() == productId.ToLower());
        
        return product;
    }
}