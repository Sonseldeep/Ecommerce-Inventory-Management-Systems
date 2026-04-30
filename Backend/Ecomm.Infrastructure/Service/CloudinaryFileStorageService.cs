using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Ecomm.Application.Common;
using Ecomm.Application.Interfaces.Services;
using Microsoft.Extensions.Options;

namespace Ecomm.Infrastructure.Service;

public class CloudinaryFileStorageService : IFileStorageService
{
    private readonly Cloudinary _cloudinary;
    private readonly CloudinarySettings _settings;

    public CloudinaryFileStorageService(IOptions<CloudinarySettings> options)
    {
        _settings = options.Value;

        var account = new Account(_settings.CloudName, _settings.ApiKey, _settings.ApiSecret);
        _cloudinary = new Cloudinary(account);
    }

    public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType, CancellationToken ct = default)
    {
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(fileName, fileStream),
            Folder = _settings.Folder,
            UseFilename = true,
            UniqueFilename = true,
            Overwrite = false
        };

        var result = await _cloudinary.UploadAsync(uploadParams, ct);

        if (result.Error is not null)
        {
            throw new BadRequestException($"Cloudinary upload failed: {result.Error.Message}");
        }
            

        return result.SecureUrl?.ToString() ?? throw new Exception("Cloudinary returned empty URL.");
    }

    public async Task DeleteImageAsync(string publicIdOrUrl, CancellationToken ct = default)
    {
        if (string.IsNullOrWhiteSpace(publicIdOrUrl) ||
            publicIdOrUrl.StartsWith("http", StringComparison.OrdinalIgnoreCase))
        {
            return;
        }
           

        var deletionParams = new DeletionParams(publicIdOrUrl);
        var result = await _cloudinary.DestroyAsync(deletionParams);

        if (result.Error is not null)
        {
            throw new BadRequestException($"Cloudinary delete failed: {result.Error.Message}");
        }
            
    }
}