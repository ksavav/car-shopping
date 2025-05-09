namespace CarShopping.Entities;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int RegularPrice { get; set; }
    public int ActualPrice { get; set; }
    public int Quantity { get; set; }
    public string ProductCode { get; set; }
}