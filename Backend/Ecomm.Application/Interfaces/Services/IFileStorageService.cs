namespace Ecomm.Application.Interfaces.Services;

public interface IFileStorageService
{
    Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken ct = default);
    Task DeleteImageAsync(string publicIdOrUrl, CancellationToken ct = default);
}