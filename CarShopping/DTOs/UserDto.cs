using System.ComponentModel.DataAnnotations;

namespace CarShopping.DTOs;

public class UserDto
{
    [Required] public string FirstName { get; set; } = null!;
    [Required] public string LastName { get; set; } = null!;
    [Required] public string Email { get; set; } = null!;
    [Required] public string Token { get; set; } = null!;
}