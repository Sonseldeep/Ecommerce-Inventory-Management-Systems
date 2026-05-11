using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Services;
using Ecomm.Application.Validators.Product;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Ecomm.Application;


public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(typeof(DependencyInjection).Assembly);

        services.AddScoped<IAuthService, AuthService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<ICurrentUserService, CurrentUserService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IAddressService, AddressService>();
        services.AddScoped<IAdminOrderService, AdminOrderService>();
        
        services.AddScoped<IProductImageService, ProductImageService>();
        services.AddScoped<IUserService, UserService>();
        
        services.AddScoped<IAdminAnalyticsService, AdminAnalyticsService>();
        services.AddScoped<IAdminUserAnalyticsService, AdminUserAnalyticsService>();
        
        services.AddScoped<IProductImportService, ProductImportService>();
        services.AddScoped<IValidator<ProductImportRowDto>, ProductImportRowValidator>();

        return services;
    }
}