using Microsoft.AspNetCore.Http;

namespace Ecomm.Application.DTOs.Product;

public class ReplaceProductImageDto
{
    public IFormFile File { get; set; } = null!;  // ← Required!
    public bool IsPrimary { get; set; } = false;  // ← Optional, default false
}