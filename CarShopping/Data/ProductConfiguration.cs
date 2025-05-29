using CarShopping.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CarShopping.Data;

public class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        // builder.HasIndex(p => new { p.Name, p.ProductId, p.Category, p.Producer })
        //     .HasMethod("GIN")
        //     .IsTsVectorExpressionIndex("simple");
        builder.HasGeneratedTsVectorColumn(
                p => p.SearchVector,
                "simple",
                p => new { p.Name, p.ProductId, p.Category, p.Producer })
            .HasIndex(p => p.SearchVector)
            .HasMethod("GIN");
    }
}