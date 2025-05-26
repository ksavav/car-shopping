using CarShopping.Entities;
using CarShopping.Helpers;

namespace CarShopping.Interfaces;

public interface IProductRepository
{
    Task<IQueryable<Product>> GetProductsFromQueryAsync(QueryParams queryParams);
    Task<Product?> GetProductAsync(string productId);
    Task<bool> ProductExists(string productId);
}