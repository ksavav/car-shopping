namespace CarShopping.Entities;

public class Product
{
    public int Id { get; set; }
    public required string Name { get; set; }
    public required int RegularPrice { get; set; }
    public required int ActualPrice { get; set; }
    public required int Quantity { get; set; }
    public required string ProductCode { get; set; }
}