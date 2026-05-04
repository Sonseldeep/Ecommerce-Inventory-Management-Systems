namespace Ecomm.Application.DTOs.Cart;


public class CartResponseDto
{
    public Guid CartId { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemResponseDto> Items { get; set; } = [];
    public decimal TotalAmount { get; set; }
}