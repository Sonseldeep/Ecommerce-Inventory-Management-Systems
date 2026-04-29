using Ecomm.Domain.Entities;
using Ecomm.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Ecomm.Infrastructure.Persistence;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        await db.Database.MigrateAsync();

        var adminEmail = "admin@shop.com";
        var exists = await db.Users.AnyAsync(x => x.Email == adminEmail && !x.IsDeleted);
        if (exists) return;

        var admin = new User
        {
            FullName = "System Admin",
            Email = adminEmail,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
            Role = UserRole.Admin,
            IsActive = true
        };

        db.Users.Add(admin);
        await db.SaveChangesAsync();
    }
}