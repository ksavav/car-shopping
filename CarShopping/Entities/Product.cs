namespace CarShopping.Entities;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required string ProductId { get; set; }
    public required string ProductCode { get; set; }
    public required string Producer { get; set; }
    public required double RegularPrice { get; set; }
    public required double ActualPrice { get; set; }
    public required string Category { get; set; }
    public required int Quantity { get; set; }
    public List<string> Substitutes { get; set; } = [];
    public string? Photo { get; set; }
}