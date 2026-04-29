// using Ecomm.Domain.Entities;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.EntityFrameworkCore.Metadata.Builders;
//
// namespace Ecomm.Infrastructure.Configurations;
//
//
// public class UserConfiguration : IEntityTypeConfiguration<User>
// {
//     public void Configure(EntityTypeBuilder<User> builder)
//     {
//         builder.ToTable("Users");
//         builder.HasKey(x => x.Id);
//
//         builder.Property(x => x.FullName).IsRequired().HasMaxLength(120);
//         builder.Property(x => x.Email).IsRequired().HasMaxLength(150);
//         builder.Property(x => x.PasswordHash).IsRequired();
//         builder.HasIndex(x => x.Email).IsUnique();
//         
//         // OTP
//         builder.Property(x => x.EmailOtpHash).HasMaxLength(200);
//
//         builder.HasMany(x => x.RefreshTokens)
//             .WithOne(x => x.User)
//             .HasForeignKey(x => x.UserId)
//             .OnDelete(DeleteBehavior.Cascade);
//         
//     
//
//
//         builder.HasMany(x => x.Addresses)
//             .WithOne(x => x.User)
//             .HasForeignKey(x => x.UserId)
//             .OnDelete(DeleteBehavior.Cascade);
//
//         builder.HasOne(x => x.Cart)
//             .WithOne(x => x.User)
//             .HasForeignKey<Cart>(x => x.UserId)
//             .OnDelete(DeleteBehavior.Cascade);
//     }
// }


using Ecomm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.FullName).IsRequired().HasMaxLength(120);
        builder.Property(x => x.Email).IsRequired().HasMaxLength(150);
        builder.Property(x => x.PasswordHash).IsRequired();
        builder.HasIndex(x => x.Email).IsUnique();

        builder.Property(x => x.EmailOtpHash).HasMaxLength(200);
        builder.Property(x => x.PasswordResetTokenHash).HasMaxLength(200);

        builder.HasMany(x => x.RefreshTokens)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(x => x.Addresses)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(x => x.Cart)
            .WithOne(x => x.User)
            .HasForeignKey<Cart>(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}