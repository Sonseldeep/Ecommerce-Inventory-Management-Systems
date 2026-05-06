using Ecomm.Application.DTOs.Cart;
using Ecomm.Domain.Entities;

namespace Ecomm.Application.Mappings;

public static class CartMappingExtensions
{
    public static CartResponseDto ToDto(this Cart cart)
    {
        var items = cart.Items.Select(i => new CartItemResponseDto
        {
            CartItemId = i.Id,
            ProductId = i.ProductId,
            ProductName = i.Product?.Name ?? string.Empty,
            SKU = i.Product?.SKU ?? string.Empty,
            Quantity = i.Quantity,
            UnitPrice = i.UnitPrice,
            LineTotal = i.UnitPrice * i.Quantity,
            ImageUrl = i.Product?.Images?.OrderBy(x => x.SortOrder).FirstOrDefault()?.ImageUrl
        }).ToList();

        return new CartResponseDto
        {
            CartId = cart.Id,
            UserId = cart.UserId,
            Items = items,
            TotalAmount = items.Sum(x => x.LineTotal)
        };
    }
}