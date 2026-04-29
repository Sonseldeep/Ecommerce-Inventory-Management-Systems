using Ecomm.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Ecomm.Infrastructure.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");
        builder.HasKey(x => x.Id);

        builder.Property(x => x.OrderNumber).IsRequired().HasMaxLength(40);
        builder.HasIndex(x => x.OrderNumber).IsUnique();

        builder.Property(x => x.Subtotal).HasColumnType("decimal(18,2)");
        builder.Property(x => x.DiscountAmount).HasColumnType("decimal(18,2)");
        builder.Property(x => x.ShippingFee).HasColumnType("decimal(18,2)");
        builder.Property(x => x.TotalAmount).HasColumnType("decimal(18,2)");

        builder.Property(x => x.ShippingFullName).IsRequired().HasMaxLength(120);
        builder.Property(x => x.ShippingPhoneNumber).IsRequired().HasMaxLength(20);
        builder.Property(x => x.ShippingLine1).IsRequired().HasMaxLength(250);
        builder.Property(x => x.ShippingLine2).HasMaxLength(250);
        builder.Property(x => x.ShippingCity).IsRequired().HasMaxLength(120);
        builder.Property(x => x.ShippingState).IsRequired().HasMaxLength(120);
        builder.Property(x => x.ShippingPostalCode).IsRequired().HasMaxLength(20);
        builder.Property(x => x.ShippingCountry).IsRequired().HasMaxLength(120);

        builder.HasOne(x => x.User)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(x => x.Address)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.AddressId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}