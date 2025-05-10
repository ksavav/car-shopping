using AutoMapper;
using CarShopping.DTOs;
using CarShopping.Entities;

namespace CarShopping.Helpers;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<RegisterDto, AppUser>();
    }
}