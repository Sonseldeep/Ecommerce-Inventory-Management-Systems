
using Ecomm.Application.Common;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace Ecomm.Api.MIddleware;

public sealed class GlobalExceptionMiddleware(IProblemDetailsService problemDetailsService) : IExceptionHandler
{
    public ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        var (status, title, detail) = exception switch
        {
            UnauthorizedException ex => (StatusCodes.Status401Unauthorized, "Unauthorized", ex.Message),
            NotFoundException ex     => (StatusCodes.Status404NotFound, "Not Found", ex.Message),
            BadRequestException ex   => (StatusCodes.Status400BadRequest, "Bad Request", ex.Message),
            _                        => (StatusCodes.Status500InternalServerError, "Internal Server Error",
                "An error occurred while processing your request. Please try again.")
        };

        httpContext.Response.StatusCode = status;

        return problemDetailsService.TryWriteAsync(new ProblemDetailsContext
        {
            HttpContext = httpContext,
            Exception = exception,
            ProblemDetails = new ProblemDetails
            {
                Title = title,
                Detail = detail,
                Status = status
            }
        });
    }
}