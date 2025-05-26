using CarShopping.Entities;
using CarShopping.Helpers;
using CarShopping.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace CarShopping.Data;

public class ProductRepository(DataContext context) : IProductRepository
{
    public async Task<IQueryable<Product>> GetProductsFromQueryAsync(QueryParams queryParams)
    {
        var query = context.Products.AsQueryable();

        if (queryParams.Category != null) query = query.Where(p => p.Category == queryParams.Category);
        if (queryParams.Producer != null) query = query.Where(p => p.Producer == queryParams.Producer);

        query = query.Where(p =>
            p.ActualPrice >= queryParams.MinPrice &&
            p.ActualPrice <= queryParams.MaxPrice
        );

        query = queryParams.OrderBy switch
        {
            "descending" => query.OrderByDescending(p => p.ActualPrice),
            "ascending" => query.OrderBy(p => p.ActualPrice),
            _ => query
        };
        
        return await Task.FromResult(query);
    }

    public async Task<Product?> GetProductAsync(string productId)
    {
        return await context.Products.SingleOrDefaultAsync(x => x.ProductId == productId);
    }
    
    public async Task<bool> ProductExists(string productId)
    {
        return await context.Products.AnyAsync(x => x.ProductId.ToLower() == productId.ToLower());
    }
}