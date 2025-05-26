namespace CarShopping.Helpers;

public class SearchParams
{
    public required string SearchTerm { get; set; }
    public int MinPrice { get; set; } = 1;
    public int MaxPrice { get; set; } = 99999999;
    public string? Category { get; set; }
    public string? Producer { get; set; }
    public string? OrderBy { get; set; }
    public int PageNumber { get; set; } = 1;
    public int PageSize
    {
        get { return _pageSize; }
        set
        {
            if (value > 100)
            {
                _pageSize = 100;
            }
            else if (value <= 5)
            {
                _pageSize = 5;
            }
            else
            {
                _pageSize = value;
            }
        }
    }

    private int _pageSize = 20;
}
