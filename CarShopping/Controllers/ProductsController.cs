using AutoMapper;
using CarShopping.Data;
using CarShopping.DTOs;
using CarShopping.Entities;
using CarShopping.Helpers;
using CarShopping.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Controllers;

public class ProductsController(DataContext context, IProductRepository productRepository, IMapper mapper) : BaseController
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProducts([FromQuery]QueryParams queryParams)
    {
        var query = await productRepository.GetProductsFromQueryAsync(queryParams);

        var skipNumber = (queryParams.PageNumber - 1) * queryParams.PageSize;
        var products = await query.Skip(skipNumber).Take(queryParams.PageSize).ToListAsync();
        var productsDto = mapper.Map<List<ProductDto>>(products);
        return Ok(productsDto);
    }

    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Product>>> GetProductsSearch([FromQuery]SearchParams searchParams)
    {
        var searchTerm = searchParams.SearchTerm;
        var products = context.Products
            .Where(p => p.SearchVector.Matches(EF.Functions.PhraseToTsQuery("simple", searchTerm)) ||
                        EF.Functions.ILike(p.Name, $"%{searchTerm}%") ||
                        EF.Functions.ILike(p.Category, $"%{searchTerm}%") ||
                        EF.Functions.ILike(p.ProductId, $"%{searchTerm}%") ||
                        EF.Functions.ILike(p.Producer, $"%{searchTerm}%"))
            .OrderByDescending(p => p.SearchVector.Rank(EF.Functions.PhraseToTsQuery("simple", searchTerm)));
        
        var skipNumber = (searchParams.PageNumber - 1) * searchParams.PageSize;
        var productsList = await products.Skip(skipNumber).Take(searchParams.PageSize).ToListAsync();
        var productsDto = mapper.Map<List<Product>, List<ProductDto>>(productsList);
        return Ok(productsDto);
    }
    
    [HttpGet("{productId}")]
    public async Task<ActionResult<Product>> GetProductByProductId(string productId)
    {
        var product = await productRepository.GetProductAsync(productId);
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
            var product = await productRepository.GetProductAsync(p);
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
        if (await productRepository.ProductExists(product.ProductCode)) return BadRequest("Product with such name already exists");
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
        var productToUpdate = await productRepository.GetProductAsync(product.ProductCode);
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
        var productToDelete = await productRepository.GetProductAsync(productId);
        if (productToDelete == null) return BadRequest("Product with such does not exist");

        context.Products.Remove(productToDelete);
        await context.SaveChangesAsync();
        return Ok(productToDelete); 
    }
    
    
}
