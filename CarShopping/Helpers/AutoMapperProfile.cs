using AutoMapper;
using CarShopping.DTOs;
using CarShopping.Entities;

namespace CarShopping.Helpers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterDto, AppUser>();
        CreateMap<LoginDto, AppUser>();
        CreateMap<UserDto, AppUser>();
        CreateMap<ProductDto, Product>();
        CreateMap<Product, ProductDto>();
        // CreateMap<List<Product>, List<ProductDto>>();
    }
}