using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Cart;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Domain.Entities;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class CartService : ICartService
{
    private readonly ICartRepository _carts;
    private readonly IProductRepository _products;
    private readonly IUserRepository _users;
    private readonly IRepository<CartItem> _cartItems;
    private readonly ICurrentUserService _currentUser;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<CartService> _logger;

    public CartService(
        ICartRepository carts,
        IProductRepository products,
        IUserRepository users,
        IRepository<CartItem> cartItems,
        ICurrentUserService currentUser,
        IUnitOfWork uow,
        ILogger<CartService> logger)
    {
        _carts = carts;
        _products = products;
        _users = users;
        _cartItems = cartItems;
        _currentUser = currentUser;
        _uow = uow;
        _logger = logger;
    }

    public async Task<CartResponseDto> GetMyCartAsync(CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var cart = await GetOrCreateCart(userId, ct);
        return cart.ToDto();
    }

    public async Task<CartResponseDto> AddItemAsync(AddToCartRequestDto request, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();

        var product = await _products.GetByIdAsync(request.ProductId, ct);
        if (product is null || !product.IsActive)
            throw new NotFoundException("Product not found.");

        if (product.QuantityInStock < request.Quantity)
            throw new BadRequestException("Insufficient stock.");

        var cart = await GetOrCreateCart(userId, ct);

        var existing = cart.Items.FirstOrDefault(x => x.ProductId == request.ProductId && !x.IsDeleted);
        var unitPrice = ResolveSellingPrice(product.Price, product.DiscountPrice);

        if (existing is null)
        {
            var item = new CartItem
            {
                CartId = cart.Id,
                ProductId = product.Id,
                Quantity = request.Quantity,
                UnitPrice = unitPrice
            };
            await _cartItems.AddAsync(item, ct);
        }
        else
        {
            var newQty = existing.Quantity + request.Quantity;
            if (product.QuantityInStock < newQty)
                throw new BadRequestException("Insufficient stock for requested quantity.");

            existing.Quantity = newQty;
            existing.UnitPrice = unitPrice;
            _cartItems.Update(existing);
        }

        await _uow.SaveChangesAsync(ct);

        var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
        _logger.LogInformation("Item added to cart. UserId: {UserId}, ProductId: {ProductId}", userId, request.ProductId);

        return updated.ToDto();
    }

    public async Task<CartResponseDto> UpdateItemAsync(Guid cartItemId, UpdateCartItemRequestDto request, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");

        var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId && !x.IsDeleted)
                   ?? throw new NotFoundException("Cart item not found.");

        if (request.Quantity <= 0)
            throw new BadRequestException("Quantity must be greater than zero.");

        var product = await _products.GetByIdAsync(item.ProductId, ct) ?? throw new NotFoundException("Product not found.");
        if (product.QuantityInStock < request.Quantity)
            throw new BadRequestException("Insufficient stock.");

        item.Quantity = request.Quantity;
        item.UnitPrice = ResolveSellingPrice(product.Price, product.DiscountPrice);
        _cartItems.Update(item);

        await _uow.SaveChangesAsync(ct);

        var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
        return updated.ToDto();
    }

    public async Task<CartResponseDto> RemoveItemAsync(Guid cartItemId, CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");

        var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId && !x.IsDeleted)
                   ?? throw new NotFoundException("Cart item not found.");

        _cartItems.Remove(item);
        await _uow.SaveChangesAsync(ct);

        var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
        return updated.ToDto();
    }

    private async Task<Cart> GetOrCreateCart(Guid userId, CancellationToken ct)
    {
        var user = await _users.GetByIdAsync(userId, ct) ?? throw new UnauthorizedException("User not found.");

        var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct);
        if (cart is not null) return cart;

        cart = new Cart { UserId = user.Id };
        await _carts.AddAsync(cart, ct);
        await _uow.SaveChangesAsync(ct);

        return await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? cart;
    }

    private static decimal ResolveSellingPrice(decimal price, decimal? discountPrice)
    {
        if (discountPrice.HasValue && discountPrice.Value > 0 && discountPrice.Value < price)
            return discountPrice.Value;

        return price;
    }
}


// public class CartService : ICartService
// {
//     private readonly ICartRepository _carts;
//     private readonly IProductRepository _products;
//     private readonly IUserRepository _users;
//     private readonly IRepository<CartItem> _cartItems;
//     private readonly ICurrentUserService _currentUser;
//     private readonly IUnitOfWork _uow;
//     private readonly ILogger<CartService> _logger;
//
//     public CartService(
//         ICartRepository carts,
//         IProductRepository products,
//         IUserRepository users,
//         IRepository<CartItem> cartItems,
//         ICurrentUserService currentUser,
//         IUnitOfWork uow,
//         ILogger<CartService> logger)
//     {
//         _carts = carts;
//         _products = products;
//         _users = users;
//         _cartItems = cartItems;
//         _currentUser = currentUser;
//         _uow = uow;
//         _logger = logger;
//     }
//
//     public async Task<CartResponseDto> GetMyCartAsync(CancellationToken ct = default)
//     {
//         var userId = _currentUser.GetUserId();
//         var cart = await GetOrCreateCart(userId, ct);
//         return cart.ToDto();
//     }
//
//     public async Task<CartResponseDto> AddItemAsync(AddToCartRequestDto request, CancellationToken ct = default)
//     {
//         var userId = _currentUser.GetUserId();
//
//         var product = await _products.GetByIdAsync(request.ProductId, ct);
//         if (product is null || !product.IsActive)
//             throw new NotFoundException("Product not found.");
//
//         if (product.QuantityInStock < request.Quantity)
//             throw new BadRequestException("Insufficient stock.");
//
//         var cart = await GetOrCreateCart(userId, ct);
//
//         var existing = cart.Items.FirstOrDefault(x => x.ProductId == request.ProductId && !x.IsDeleted);
//         var unitPrice = product.DiscountPrice ?? product.Price;
//
//         if (existing is null)
//         {
//             var item = new CartItem
//             {
//                 CartId = cart.Id,
//                 ProductId = product.Id,
//                 Quantity = request.Quantity,
//                 UnitPrice = unitPrice
//             };
//             await _cartItems.AddAsync(item, ct);
//         }
//         else
//         {
//             var newQty = existing.Quantity + request.Quantity;
//             if (product.QuantityInStock < newQty)
//                 throw new BadRequestException("Insufficient stock for requested quantity.");
//
//             existing.Quantity = newQty;
//             existing.UnitPrice = unitPrice;
//             _cartItems.Update(existing);
//         }
//
//         await _uow.SaveChangesAsync(ct);
//
//         var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
//         _logger.LogInformation("Item added to cart. UserId: {UserId}, ProductId: {ProductId}", userId, request.ProductId);
//
//         return updated.ToDto();
//     }
//
//     public async Task<CartResponseDto> UpdateItemAsync(Guid cartItemId, UpdateCartItemRequestDto request, CancellationToken ct = default)
//     {
//         var userId = _currentUser.GetUserId();
//         var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
//
//         var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId && !x.IsDeleted)
//                    ?? throw new NotFoundException("Cart item not found.");
//
//         if (request.Quantity <= 0)
//             throw new BadRequestException("Quantity must be greater than zero.");
//
//         var product = await _products.GetByIdAsync(item.ProductId, ct) ?? throw new NotFoundException("Product not found.");
//         if (product.QuantityInStock < request.Quantity)
//             throw new BadRequestException("Insufficient stock.");
//
//         item.Quantity = request.Quantity;
//         item.UnitPrice = product.DiscountPrice ?? product.Price;
//         _cartItems.Update(item);
//
//         await _uow.SaveChangesAsync(ct);
//
//         var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
//         return updated.ToDto();
//     }
//
//     public async Task<CartResponseDto> RemoveItemAsync(Guid cartItemId, CancellationToken ct = default)
//     {
//         var userId = _currentUser.GetUserId();
//         var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
//
//         var item = cart.Items.FirstOrDefault(x => x.Id == cartItemId && !x.IsDeleted)
//                    ?? throw new NotFoundException("Cart item not found.");
//
//         _cartItems.Remove(item);
//         await _uow.SaveChangesAsync(ct);
//
//         var updated = await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? throw new NotFoundException("Cart not found.");
//         return updated.ToDto();
//     }
//
//     private async Task<Cart> GetOrCreateCart(Guid userId, CancellationToken ct)
//     {
//         var user = await _users.GetByIdAsync(userId, ct) ?? throw new UnauthorizedException("User not found.");
//
//         var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct);
//         if (cart is not null) return cart;
//
//         cart = new Cart { UserId = user.Id };
//         await _carts.AddAsync(cart, ct);
//         await _uow.SaveChangesAsync(ct);
//
//         return await _carts.GetByUserIdWithItemsAsync(userId, ct) ?? cart;
//     }
// }