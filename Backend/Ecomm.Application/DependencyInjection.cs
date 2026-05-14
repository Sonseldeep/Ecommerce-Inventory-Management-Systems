using Ecomm.Application.DTOs.Product;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Reports.Export;
using Ecomm.Application.Reports.Interfaces;
using Ecomm.Application.Reports.Services;
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
        
        services.AddScoped<IValidator<ProductImportRowDto>, ProductImportRowValidator>();
        
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IReportExporter, ReportExporter>();
        
        // Excel Import Services
        services.AddScoped<IExcelParser, ExcelParser>();
        services.AddScoped<IImportValidator, ProductImportValidator>();
        services.AddScoped<IRowDataExtractor, RowDataExtractor>();
        services.AddScoped<IProductImportContextLoader, ProductImportContextLoader>();
        services.AddScoped<IProductImportRowProcessor, ProductImportRowProcessor>();
        services.AddScoped<IProductImportService, ProductImportService>();

        return services;
    }
}