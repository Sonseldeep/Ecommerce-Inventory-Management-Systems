using Ecomm.Api.MIddleware;

namespace Ecomm.Api.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseGlobalExceptionMiddleware(this IApplicationBuilder app)
        => app.UseMiddleware<GlobalExceptionMiddleware>();
}