using System.Net;
using System.Text.Json;
using Ecomm.Application.Common;
using FluentValidation;

namespace Ecomm.Api.MIddleware;


public class GlobalExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionMiddleware> _logger;

    public GlobalExceptionMiddleware(RequestDelegate next, ILogger<GlobalExceptionMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var (status, message, errors) = ex switch
        {
            ValidationException v => ((int)HttpStatusCode.BadRequest, "Validation failed", v.Errors.Select(e => e.ErrorMessage)),
            BadRequestException b => ((int)HttpStatusCode.BadRequest, b.Message, Enumerable.Empty<string>()),
            UnauthorizedException u => ((int)HttpStatusCode.Unauthorized, u.Message, Enumerable.Empty<string>()),
            NotFoundException n => ((int)HttpStatusCode.NotFound, n.Message, Enumerable.Empty<string>()),
            _ => ((int)HttpStatusCode.InternalServerError, "Internal server error", Enumerable.Empty<string>())
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = status;

        var payload = new
        {
            success = false,
            message,
            errors
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}