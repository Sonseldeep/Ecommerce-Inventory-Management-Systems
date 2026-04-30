using Ecomm.Application.Common;
using Ecomm.Application.DTOs.Order;
using Ecomm.Application.Interfaces.Repositories;
using Ecomm.Application.Interfaces.Services;
using Ecomm.Application.Mappings;
using Ecomm.Domain.Entities;
using Ecomm.Domain.Enums;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Ecomm.Application.Services;

public class OrderService : IOrderService
{
    private readonly ICartRepository _carts;
    private readonly IAddressRepository _addresses;
    private readonly IOrderRepository _orders;
    private readonly IProductRepository _products;
    private readonly IRepository<OrderItem> _orderItems;
    private readonly IRepository<CartItem> _cartItems;
    private readonly ICurrentUserService _currentUser;
    private readonly IUnitOfWork _uow;
    private readonly ILogger<OrderService> _logger;
    private readonly IRealtimeNotifier _realtime;
    private readonly IValidator<CheckoutRequestDto> _checkoutValidator;

    public OrderService(
        ICartRepository carts,
        IAddressRepository addresses,
        IOrderRepository orders,
        IProductRepository products,
        IRepository<OrderItem> orderItems,
        IRepository<CartItem> cartItems,
        ICurrentUserService currentUser,
        IUnitOfWork uow,
        ILogger<OrderService> logger,
        IRealtimeNotifier realtime,
        IValidator<CheckoutRequestDto> checkoutValidator,
        IValidator<UpdateOrderStatusRequestDto> updateStatusValidator)
    {
        _carts = carts;
        _addresses = addresses;
        _orders = orders;
        _products = products;
        _orderItems = orderItems;
        _cartItems = cartItems;
        _currentUser = currentUser;
        _uow = uow;
        _logger = logger;
        _realtime = realtime;
        _checkoutValidator = checkoutValidator;
    }

    public async Task<OrderResponseDto> CheckoutAsync(CheckoutRequestDto request, CancellationToken ct = default)
    {
        await _checkoutValidator.ValidateAndThrowAsync(request, ct);
        var userId = _currentUser.GetUserId();

        var cart = await _carts.GetByUserIdWithItemsAsync(userId, ct);
        if (cart is null || !cart.Items.Any(x => !x.IsDeleted))
        {
            throw new BadRequestException("Cart is empty.");

        }
           
        var address = await _addresses.GetByIdAsync(request.AddressId, ct);
        if (address is null || address.UserId != userId)
        {
            throw new BadRequestException("Invalid address.");
        }

        var activeItems = cart.Items.Where(x => !x.IsDeleted).ToList();

        decimal subtotal = 0m;
        var pricingSnapshot = new List<(Guid ProductId, string Name, string Sku, int Qty, decimal UnitPrice)>();

        foreach (var item in activeItems)
        {
            var product = await _products.GetByIdAsync(item.ProductId, ct)
                ?? throw new NotFoundException("Product not found.");

            if (!product.IsActive)
            {
                throw new BadRequestException($"Product '{product.Name}' is inactive.");
            }

            if (product.QuantityInStock < item.Quantity)
            {
                throw new BadRequestException($"Insufficient stock for '{product.Name}'.");
            }
                

            var finalUnitPrice = ResolveSellingPrice(product.Price, product.DiscountPrice);
            pricingSnapshot.Add((product.Id, product.Name, product.SKU, item.Quantity, finalUnitPrice));
            subtotal += finalUnitPrice * item.Quantity;
        }

        var discount = 0m;
        var shipping = 0m;
        var total = subtotal - discount + shipping;

        var order = new Order
        {
            OrderNumber = $"ORD-{DateTime.UtcNow:yyyyMMddHHmmss}-{Random.Shared.Next(1000, 9999)}",
            UserId = userId,
            AddressId = address.Id,

            ShippingFullName    = address.FullName,
            ShippingPhoneNumber = address.PhoneNumber,
            ShippingLine1       = address.Line1,
            ShippingLine2       = address.Line2,
            ShippingCity        = address.City,
            ShippingState       = address.State,
            ShippingPostalCode  = address.PostalCode,
            ShippingCountry     = address.Country,

            Subtotal       = subtotal,
            DiscountAmount = discount,
            ShippingFee    = shipping,
            TotalAmount    = total,

            PaymentMethod = request.PaymentMethod,
            PaymentStatus = PaymentStatus.Pending,
            OrderStatus   = OrderStatus.Pending
        };

        await _orders.AddAsync(order, ct);

        foreach (var line in pricingSnapshot)
        {
            var product = await _products.GetByIdAsync(line.ProductId, ct)
                ?? throw new NotFoundException("Product not found.");

            //Deduct stock 
            product.QuantityInStock -= line.Qty;
            _products.Update(product);

            // Low stock alert after deduction 
            var reorderLevel = product.ReorderLevel > 0 ? product.ReorderLevel : 5;
            if (product.QuantityInStock <= reorderLevel)
            {
                await _realtime.LowStockAsync(
                    product.Id,
                    product.Name,
                    product.QuantityInStock,
                    reorderLevel,
                    ct
                );
            }

            var orderItem = new OrderItem
            {
                OrderId              = order.Id,
                ProductId            = line.ProductId,
                ProductNameSnapshot  = line.Name,
                ProductSkuSnapshot   = line.Sku,
                Quantity             = line.Qty,
                UnitPrice            = line.UnitPrice,
                LineTotal            = line.UnitPrice * line.Qty
            };

            await _orderItems.AddAsync(orderItem, ct);
        }

        foreach (var cartItem in activeItems)
        {
            _cartItems.Remove(cartItem);
        }
        
        await _uow.SaveChangesAsync(ct);

        var created = await _orders.GetByIdWithItemsAsync(order.Id, ct)
            ?? throw new NotFoundException("Order not found after creation.");

        await _realtime.OrderPlacedAsync(created.ToDto(), ct);

        _logger.LogInformation(
            "Order created. OrderNumber: {OrderNumber}, UserId: {UserId}",
            created.OrderNumber, userId);

        return created.ToDto();
    }

    public async Task<IEnumerable<OrderResponseDto>> GetMyOrdersAsync(CancellationToken ct = default)
    {
        var userId = _currentUser.GetUserId();
        var orders = await _orders.GetByUserIdWithItemsAsync(userId, ct);
        return orders.Select(x => x.ToDto());
    }

    private static decimal ResolveSellingPrice(decimal price, decimal? discountPrice)
    {
        if (discountPrice is > 0 && discountPrice.Value < price)
        {
            return discountPrice.Value;
        }
           

        return price;
    }
}