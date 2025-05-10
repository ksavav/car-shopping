using System.ComponentModel.DataAnnotations;

namespace CarShopping.DTOs;

public class LogionDto
{
    [Required] public string Email { get; set; } = null!;
    [Required] public string Password { get; set; } = null!;
}