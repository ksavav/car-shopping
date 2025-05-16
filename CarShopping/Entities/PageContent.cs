namespace CarShopping.Entities;

public class PageContent
{
    public int Id { get; set; }
    public required string Page { get; set; }
    public required string Section { get; set; }
    public required string Content { get; set; }
    public DateTime? LastEdited { get; set; }
    public string? EditedBy { get; set; }
}